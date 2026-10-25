const {renderArticle} = require('../socialArticle');
const express = require('express');
const rateLimit = require('express-rate-limit');
const adminAuth = require('../middleware/adminAuth');
const { networks, validateLinks, validatePost } = require('../socialValidation');
const { validateHistoryBatch } = require('../historyImport');

function createSocialRouter(repository = require('../socialRepository')) {
  const router = express.Router();
  const wrap = handler => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
  const page = req => Math.max(1, Math.min(10000, Number.parseInt(req.query.page, 10) || 1));
  router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.get('/article/:id', wrap(async (req, res) => {
    if (!/^[a-f0-9]{24}$/i.test(req.params.id)) return res.status(404).type('html').send('<h1>Publication introuvable</h1><a href="https://www.mecaprint3d.fr/#actualites">Retour aux actualités</a>');
    const post = await repository.published(req.params.id);
    if (!post) return res.status(404).type('html').send('<h1>Publication introuvable</h1><a href="https://www.mecaprint3d.fr/#actualites">Retour aux actualités</a>');
    res.set('X-Content-Type-Options','nosniff');
    res.set('Referrer-Policy','strict-origin-when-cross-origin');
    res.set('Content-Security-Policy', "default-src 'none'; img-src https:; style-src 'self' https://www.mecaprint3d.fr; script-src 'self' https://www.mecaprint3d.fr; frame-src https://www.facebook.com https://www.linkedin.com; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
    res.type('html').send(renderArticle(post));
  }));
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
  router.get('/admin/distribution', (req, res) => res.json({ success: true, connections: require('../socialPublisher').configuration() }));
  router.get('/admin/deliveries/:id', wrap(async (req, res) => {
    if (!/^[a-f0-9]{24}$/i.test(req.params.id)) return res.status(400).json({ success: false, error: 'Identifiant invalide.' });
    res.json({ success: true, deliveries: await require('../socialDeliveryRepository').list(req.params.id) });
  }));
  router.post('/admin/posts/:id/distribute', wrap(async (req, res) => {
    if (!/^[a-f0-9]{24}$/i.test(req.params.id)) return res.status(400).json({ success: false, error: 'Identifiant invalide.' });
    try {
      const distribute = require('../socialDistribution').createDistributor({ posts: repository, deliveries: require('../socialDeliveryRepository') });
      res.json({ success: true, deliveries: await distribute(req.params.id, req.body?.channels) });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ success: false, error: error.message });
      throw error;
    }
  }));
  router.put('/admin/links', wrap(async (req, res) => {
    let links;
    try { links = validateLinks(req.body); } catch (err) { return res.status(400).json({ success: false, error: err.message }); }
    res.json({ success: true, links: await repository.setLinks(links) });
  }));
  router.post('/admin/import', wrap(async (req, res) => {
    let posts;
    try { posts = validateHistoryBatch(req.body); }
    catch (error) { return res.status(400).json({ success: false, error: error.message }); }
    let created = 0;
    let skipped = 0;
    for (const post of posts) {
      try {
        const result = await repository.importDraft(post);
        if (result.created) created++; else skipped++;
      } catch {
        return res.status(500).json({ success: false, created, skipped, error: 'Import interrompu. Les brouillons déjà enregistrés sont conservés ; vous pouvez relancer sans doublon.' });
      }
    }
    res.json({ success: true, created, skipped });
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
