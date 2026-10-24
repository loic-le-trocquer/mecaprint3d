const express = require('express');
const rateLimit = require('express-rate-limit');
const adminAuth = require('../middleware/adminAuth');
const { networks, validateLinks, validatePost } = require('../socialValidation');

function createSocialRouter(repository = require('../socialRepository')) {
  const router = express.Router();
  const wrap = handler => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
  const page = req => Math.max(1, Math.min(10000, Number.parseInt(req.query.page, 10) || 1));
  router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.get('/public', wrap(async (req, res) => {
    const [links, feed] = await Promise.all([repository.links(), repository.posts(true, page(req))]);
    res.json({ success: true, links, ...feed });
  }));
  router.use('/admin', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-8', legacyHeaders: false }));
  router.use('/admin', adminAuth);
  router.get('/admin', wrap(async (req, res) => {
    const [links, feed] = await Promise.all([repository.links(), repository.posts(false, page(req))]);
    res.json({ success: true, links, ...feed, connections: Object.fromEntries(networks.map(n => [n, 'not_connected'])) });
  }));
  router.put('/admin/links', wrap(async (req, res) => {
    let links;
    try { links = validateLinks(req.body); } catch (err) { return res.status(400).json({ success: false, error: err.message }); }
    res.json({ success: true, links: await repository.setLinks(links) });
  }));
  router.post('/admin/posts', wrap(async (req, res) => {
    let post;
    try { post = validatePost(req.body); } catch (err) { return res.status(400).json({ success: false, error: err.message }); }
    res.status(201).json({ success: true, post: await repository.create(post) });
  }));
  router.use('/admin/posts/:id', (req, res, next) => /^[a-f0-9]{24}$/i.test(req.params.id) ? next() : res.status(400).json({ success: false, error: 'Identifiant invalide.' }));
  router.put('/admin/posts/:id', wrap(async (req, res) => {
    let post;
    try { post = validatePost(req.body); } catch (err) { return res.status(400).json({ success: false, error: err.message }); }
    const saved = await repository.update(req.params.id, post);
    res.status(saved ? 200 : 404).json(saved ? { success: true, post: saved } : { success: false, error: 'Publication introuvable.' });
  }));
  router.delete('/admin/posts/:id', wrap(async (req, res) => {
    const found = await repository.remove(req.params.id);
    res.status(found ? 200 : 404).json(found ? { success: true } : { success: false, error: 'Publication introuvable.' });
  }));
  router.use((err, req, res, next) => {
    console.error('Social API:', err.name);
    res.status(500).json({ success: false, error: 'Impossible de lire ou enregistrer les publications. Réessayez.' });
  });
  return router;
}
module.exports = { createSocialRouter };
