const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { createSocialRouter } = require('./routes/social');
const { validateLinks, validatePost } = require('./socialValidation');
const draft = { title: 'Une pièce sur mesure', content: 'Texte du site', socialText: 'Texte social privé', image: '', imageAlt: '', category: 'realisation', status: 'draft', channels: ['linkedin'] };

test('Liens officiels, contenus et destinations validés', () => {
  assert.equal(validateLinks({ facebook: 'https://www.facebook.com/mecaprint3d' }).facebook, 'https://www.facebook.com/mecaprint3d');
  for (const value of ['javascript:alert(1)', 'https://facebook.com.evil.test/', 'https://user:pass@facebook.com/', 'http://facebook.com/']) assert.throws(() => validateLinks({ facebook: value }));
  assert.equal(validateLinks({}).instagram, '');
  assert.throws(() => validatePost({ ...draft, title: '' }));
  assert.throws(() => validatePost({ ...draft, image: 'javascript:alert(1)' }));
  assert.throws(() => validatePost({ ...draft, status: 'scheduled' }));
  assert.throws(() => validatePost({ ...draft, channels: ['unknown'] }));
  assert.equal(validatePost({ ...draft, image: 'https://res.cloudinary.com/example/photo.jpg' }).image, 'https://res.cloudinary.com/example/photo.jpg');
  assert.equal(validatePost({ ...draft, image: '/images/piece.jpg' }).image, '/images/piece.jpg');
  assert.equal(validatePost({ ...draft, publishedAt: '2020-01-01', _id: 'injected' }).publishedAt, undefined);
});

test('MongoDB : la requête publique exclut brouillons et champs de préparation', async t => {
  const SocialPost = require('./models/SocialPost');
  const repository = require('./socialRepository');
  let projection;
  t.mock.method(SocialPost, 'find', (query, fields) => {
    assert.deepEqual(query, { status: 'published', publishedAt: { $ne: null } });
    projection = fields;
    return { sort(value) { assert.deepEqual(value, { publishedAt: -1, _id: -1 }); return this; }, skip(value) { assert.equal(value, 12); return this; }, limit(value) { assert.equal(value, 13); return this; }, async lean() { return Array.from({ length: 13 }, (_, i) => ({ _id: String(i), title: 'Publié' })); } };
  });
  const result = await repository.posts(true, 2);
  assert.equal(result.posts.length, 12);
  assert.equal(result.hasMore, true);
  assert.deepEqual(Object.keys(projection).sort(), ['category', 'content', 'image', 'imageAlt', 'publishedAt', 'sourcePublishedDate', 'title']);
});

test('MongoDB : publication, retrait et données durables utilisent le modèle', async t => {
  const Post = require('./models/SocialPost');
  const Settings = require('./models/SocialSettings');
  const repository = require('./socialRepository');
  let stored;
  t.mock.method(Post, 'create', async data => { stored = data; return { toObject: () => data }; });
  await repository.create({ ...draft, status: 'published' });
  assert.ok(stored.publishedAt instanceof Date);
  await repository.create(draft);
  assert.equal(stored.publishedAt, null);
  const doc = { ...draft, publishedAt: new Date('2026-01-01'), async save() { return { toObject: () => ({ ...this }) }; } };
  t.mock.method(Post, 'findById', async () => doc);
  assert.equal((await repository.update('id', draft)).publishedAt, null);
  assert.ok((await repository.update('id', { ...draft, status: 'published' })).publishedAt instanceof Date);
  t.mock.method(Settings, 'findOneAndUpdate', async (query, update, options) => { assert.deepEqual(query, { key: 'main' }); assert.deepEqual(update.$set, { facebook: '', instagram: '', linkedin: '' }); assert.equal(options.upsert, true); assert.equal(options.runValidators, true); });
  await repository.setLinks({ facebook: '', instagram: '', linkedin: '' });
  const invalid = new Post({ title: 'Titre', category: 'unknown', status: 'scheduled' });
  assert.ok(invalid.validateSync());
});

test('API : accès existant, cycle de publication, erreurs et suppression', async t => {
  const oldToken = process.env.ADMIN_TOKEN;
  const oldPassword = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_TOKEN = 'test-only-existing-admin-token';
  process.env.ADMIN_PASSWORD = 'test-only-password';
  let posts = [];
  let links = { facebook: '', instagram: '', linkedin: '' };
  const id = '0123456789abcdef01234567';
  const repo = {
    async links() { return links; },
    async setLinks(value) { links = value; return links; },
    async posts(isPublic) { return { posts: isPublic ? posts.filter(p => p.status === 'published').map(({ _id, title, content, category, image, imageAlt, publishedAt }) => ({ _id, title, content, category, image, imageAlt, publishedAt })) : posts, hasMore: false }; },
    async create(post) { const saved = { ...post, _id: id }; posts.push(saved); return saved; },
    async update(key, post) { if (key !== id || !posts.length) return null; posts[0] = { ...posts[0], ...post, publishedAt: post.status === 'published' ? new Date().toISOString() : null }; return posts[0]; },
    async remove(key) { if (key !== id || !posts.length) return false; posts = []; return true; }
  };
  const app = express(); app.use(express.json()); app.use('/api/social', createSocialRouter(repo));
  app.use('/api/site-content', require('./routes/siteContent'));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    if (oldToken === undefined) delete process.env.ADMIN_TOKEN; else process.env.ADMIN_TOKEN = oldToken;
    if (oldPassword === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = oldPassword;
  });
  const base = `http://127.0.0.1:${server.address().port}/api/social`;
  const call = (url, method = 'GET', body, token = 'test-only-existing-admin-token') => fetch(base + url, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  assert.equal((await call('/admin', 'GET', null, 'wrong')).status, 401);
  assert.equal((await call('/admin', 'GET', null, 'test-only-password')).status, 401);
  assert.equal((await call('/admin/posts', 'POST', draft, 'wrong')).status, 401);
  assert.equal((await call('/admin/links', 'PUT', { facebook: 'https://evil.test/' })).status, 400);
  assert.equal((await call('/admin/links', 'PUT', { instagram: 'https://www.instagram.com/mecaprint3d' })).status, 200);
  assert.equal((await call('/admin/posts', 'POST', { ...draft, title: '' })).status, 400);
  assert.equal((await call('/admin/posts', 'POST', draft)).status, 201);
  assert.equal((await (await call('/public')).json()).posts.length, 0);
  assert.equal((await call(`/admin/posts/${id}`, 'PUT', { ...draft, status: 'ready' })).status, 200);
  assert.equal((await (await call('/public')).json()).posts.length, 0);
  assert.equal((await call(`/admin/posts/${id}`, 'PUT', { ...draft, status: 'published' })).status, 200);
  const publicData = await (await call('/public')).json();
  assert.equal(publicData.posts.length, 1);
  assert.equal(publicData.posts[0].socialText, undefined);
  assert.equal(publicData.posts[0].channels, undefined);
  assert.equal((await call(`/admin/posts/${id}`, 'PUT', draft)).status, 200);
  assert.equal((await (await call('/public')).json()).posts.length, 0);
  assert.equal((await (await call('/admin')).json()).connections.linkedin, 'not_connected');
  assert.equal((await call('/admin/posts/bad-id', 'PUT', draft)).status, 400);
  assert.equal((await call('/admin/posts/111111111111111111111111', 'PUT', draft)).status, 404);
  assert.equal((await call(`/admin/posts/${id}`, 'DELETE')).status, 200);
  assert.equal((await call(`/admin/posts/${id}`, 'DELETE')).status, 404);
  delete process.env.ADMIN_TOKEN;
  assert.equal((await call('/admin', 'GET', null, 'test-only-password')).status, 200);
  process.env.ADMIN_TOKEN = 'test-only-existing-admin-token';
  delete process.env.ADMIN_PASSWORD;
  const login = body => fetch(`http://127.0.0.1:${server.address().port}/api/site-content/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  assert.equal((await login({})).status, 401);
  assert.equal((await login({ password: null })).status, 401);
  assert.equal((await login({ password: 'wrong' })).status, 401);
  assert.equal((await login({ password: 'test-only-existing-admin-token' })).status, 200);
  delete process.env.ADMIN_TOKEN;
  assert.equal((await call('/admin')).status, 503);
  repo.links = async () => { throw new Error('database password must not be disclosed'); };
  const failed = await call('/public');
  assert.equal(failed.status, 500);
  assert.ok(!(await failed.text()).includes('password'));
});
