// Isolated rehearsal server: no database, production credentials or external API calls.
const express = require('express');
const { randomBytes, timingSafeEqual } = require('node:crypto');
const path = require('node:path');
const { createSocialRouter } = require('./routes/social');
const { validateHistoryPost } = require('./historyImport');
const same = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };
function createReviewApp({ password, token = randomBytes(32).toString('hex'), dist = path.resolve(__dirname, '../frontend/dist-review') }) {
  if (!password || password.length < 20) throw new Error('Configurez un mot de passe de démonstration distinct, de 20 caractères minimum.');
  // This is a separate process; never require the production index or load dotenv.
  process.env.ADMIN_TOKEN = token;
  for (const key of ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 'LINKEDIN_TOKEN_KEY', 'LINKEDIN_ACCESS_TOKEN', 'FACEBOOK_PAGE_ACCESS_TOKEN', 'MONGO_URI', 'STRIPE_SECRET_KEY']) delete process.env[key];
  const posts = new Map();
  const links = { facebook: '', instagram: '', linkedin: '' };
  const repository = {
    async links() { return links; },
    async setLinks(value) { Object.assign(links, value); return links; },
    async posts(isPublic, page) { const all = [...posts.values()].filter(p => !isPublic || p.status === 'published').reverse(); return { posts: all.slice((page - 1) * 30, page * 30), hasMore: all.length > page * 30 }; },
    async create(value) { const post = { ...value, _id: randomBytes(12).toString('hex'), publishedAt: value.status === 'published' ? new Date() : null }; posts.set(post._id, post); return post; },
    async update(id, value) { if (!posts.has(id)) return null; const post = { ...posts.get(id), ...value, publishedAt: value.status === 'published' ? new Date() : null }; posts.set(id, post); return post; },
    async remove(id) { return posts.delete(id); },
    async published(id) { const p = posts.get(id); return p?.status === 'published' ? p : null; },
    async importDraft(value) { if ([...posts.values()].some(p => p.importKey === value.importKey)) return { created: false }; await this.create(value); return { created: true }; }
  };
  const app = express();
  app.disable('x-powered-by');
  app.use(express.urlencoded({ extended: false, limit: '2kb' }));
  app.get('/review-login', (req, res) => res.set('Cache-Control', 'no-store').type('html').send('<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>MecaPrint3D — Répétition</title><body style="background:#18181b;color:white;font:18px Arial;max-width:600px;margin:60px auto;padding:24px"><h1>MecaPrint3D — Répétition</h1><p>Données fictives. Aucun accès LinkedIn réel.</p><form action="/review-login" method="post"><label>Identifiant <input name="username" autocomplete="username" required></label><p><label>Mot de passe <input name="password" type="password" autocomplete="current-password" required></label></p><button>Ouvrir la démonstration</button></form></body></html>'));
  app.post('/review-login', require('express-rate-limit')({ windowMs: 900000, limit: 10 }), (req, res) => {
    if (!same(req.body.username || '', 'linkedin-review') || !same(req.body.password || '', password)) return res.status(401).send('Identifiants de démonstration invalides.');
    res.set('Set-Cookie', `review_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=14400${req.secure ? '; Secure' : ''}`).redirect('/admin/social');
  });
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    const basic = req.get('authorization') || '';
    let supplied = '';
    try { supplied = Buffer.from(basic.slice(6), 'base64').toString(); } catch {}
    // API requests use a separate, memory-only token issued only in the protected page.
    const session = (req.get('cookie') || '').split(';').map(s => s.trim()).find(s => s.startsWith('review_session='))?.slice(15) || '';
    if (same(session, token) || (req.path.startsWith('/review-api/') && same(basic, `Bearer ${token}`)) || (basic.startsWith('Basic ') && same(supplied, `linkedin-review:${password}`))) return next();
    if (req.path.startsWith('/review-api/')) return res.status(401).json({ success: false, error: 'Accès de démonstration requis.' });
    res.redirect('/review-login');
  });
  app.use(express.json({ limit: '100kb' }));
  app.get('/review-api/api/site-content', (req, res) => res.json({ success: true, content: {} }));
  app.post('/review-api/api/social/admin/linkedin/import', async (req, res, next) => {
    try {
      const text = 'EXEMPLE FICTIF — Une pièce technique conçue sur mesure. Ce contenu sert uniquement à répéter la démonstration.';
      const result = await repository.importDraft(validateHistoryPost({ title: 'Exemple fictif — Pièce sur mesure', content: text, socialText: text, category: 'realisation', image: '', imageAlt: '', sources: [{ platform: 'linkedin', id: '999999999999999', url: 'https://www.linkedin.com/feed/update/urn:li:share:999999999999999', publishedDate: '2026-11-03', originalText: text }] }));
      res.json({ success: true, created: Number(result.created), skipped: Number(!result.created), unsupported: 0, nextStart: null });
    } catch (error) { next(error); }
  });
  // Never mount Mongo-backed delivery routes in this process.
  app.get('/review-api/api/social/admin/deliveries/:id', (req, res) => res.json({ success: true, deliveries: [] }));
  app.post('/review-api/api/social/admin/posts/:id/distribute', (req, res) => res.status(409).json({ success: false, error: 'Répétition uniquement : aucun envoi LinkedIn n’est possible.' }));
  app.use('/review-api/api/social', createSocialRouter(repository));
  app.use('/review-api', (req, res) => res.status(404).json({ success: false, error: 'Fonction indisponible dans cet espace isolé.' }));
  app.get('/review-session.js', (req, res) => res.type('js').send(`localStorage.setItem('mecaprint3d_admin_token',${JSON.stringify(token)});`));
  app.use(express.static(dist, { index: false }));
  app.get('*', (req, res) => {
    const fs = require('node:fs');
    const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8').replace('<head>', '<head><script src="/review-session.js"></script>').replace('<body>', '<body><div style="position:sticky;top:0;z-index:9999;padding:16px;background:#ffdb77;color:#151515;font:700 16px Arial">RÉPÉTITION — Données fictives, stockage temporaire, aucun accès LinkedIn réel. Ne pas présenter comme une intégration validée.</div>');
    res.type('html').send(html);
  });
  return app;
}
if (require.main === module) {
  const app = createReviewApp({ password: process.env.REVIEW_PASSWORD });
  app.listen(Number(process.env.PORT || 4319), process.env.REVIEW_HOST || '127.0.0.1', () => console.log('Démonstration isolée démarrée. Identifiant : linkedin-review.'));
}
module.exports = { createReviewApp };
