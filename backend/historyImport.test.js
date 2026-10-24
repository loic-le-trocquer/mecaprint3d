const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { validateHistoryPost, validateHistoryBatch } = require('./historyImport');
const { createSocialRouter } = require('./routes/social');

const sample = () => ({
  title: 'Une publication historique', content: 'Texte original de l’atelier.', socialText: 'Texte original de l’atelier.',
  category: 'actualite', status: 'published', channels: ['instagram'], image: '', imageAlt: '',
  sourcePublishedDate: '2000-01-01', publishedAt: '2000-01-01', importKey: 'untrusted',
  sources: [
    { platform: 'facebook', id: '123', url: 'https://www.facebook.com/permalink.php?story_fbid=123&id=456', publishedDate: '2026-06-20', originalText: 'Texte original de l’atelier.' },
    { platform: 'linkedin', id: '789', url: 'https://www.linkedin.com/feed/update/urn:li:activity:789', publishedDate: '2026-06-19', originalText: 'Texte  original de l’atelier.' }
  ]
});
test('Historique : brouillons forcés, dates et textes originaux préservés', () => {
  const post = validateHistoryPost(sample());
  assert.equal(post.status, 'draft'); assert.equal(post.publishedAt, null);
  assert.deepEqual(post.channels, ['facebook', 'linkedin']);
  assert.equal(post.sourcePublishedDate, '2026-06-19');
  assert.deepEqual(post.sourceKeys, ['facebook:123', 'linkedin:789']);
  assert.equal(post.sources[1].originalText, 'Texte  original de l’atelier.');
  assert.match(post.importKey, /^history-v1:[a-f0-9]{64}$/);
  assert.equal(validateHistoryPost({ ...sample(), content: 'Texte  original de l’atelier.' }).importKey, post.importKey);
  for (const date of ['2026-02-30', '2026-13-01', 'invalid']) assert.throws(() => validateHistoryPost({ ...sample(), sources: [{ ...sample().sources[0], publishedDate: date }] }));
  assert.throws(() => validateHistoryPost({ ...sample(), sources: [{ ...sample().sources[0], url: 'https://facebook.com.evil.test/' }] }));
  assert.throws(() => validateHistoryPost({ ...sample(), sources: [{ ...sample().sources[0], originalText: 'Autre contenu' }] }));
  assert.throws(() => validateHistoryBatch({ posts: Array.from({ length: 11 }, sample) }));
  assert.throws(() => validateHistoryBatch({ posts: [sample(), sample()] }));
});

test('Historique : modèle, dates conservées après édition et collisions protégées', async t => {
  const Model = require('./models/SocialPost');
  const repository = require('./socialRepository');
  const data = validateHistoryPost(sample());
  await new Model(data).validate();
  let saved;
  t.mock.method(Model, 'init', async () => {});
  t.mock.method(Model, 'findOne', query => { assert.ok(query.$or[0].importKey); assert.deepEqual(query.$or[1].sourceKeys.$in, data.sourceKeys); return { select() { return this; }, async lean() { return null; } }; });
  t.mock.method(Model, 'create', async post => { saved = post; return post; });
  assert.equal((await repository.importDraft(data)).created, true);
  assert.equal(saved.status, 'draft'); assert.equal(saved.publishedAt, null);
  t.mock.method(Model, 'create', async () => { throw Object.assign(new Error('collision'), { code: 11000 }); });
  assert.equal((await repository.importDraft(data)).created, false);
  t.mock.method(Model, 'create', async () => { throw new Error('storage failure'); });
  await assert.rejects(() => repository.importDraft(data), /storage failure/);
});

test('Historique : fichier de préparation et lots respectent les limites', async () => {
  const { prepareHistoryFile, historyBatches } = await import('../frontend/src/lib/historyImport.mjs');
  const raw = sample();
  const source = raw.sources[0];
  const prepared = prepareHistoryFile({ schemaVersion: 1, posts: [{ ...raw, sourceVariants: [{ source, originalText: source.originalText }] }], needsCompletion: [{ source }] });
  assert.equal(prepared.posts[0].status, 'draft');
  assert.equal(prepared.missingCount, 1);
  const batches = historyBatches(Array.from({ length: 68 }, () => prepared.posts[0]));
  assert.equal(batches.flat().length, 68);
  assert.ok(batches.every(batch => batch.length <= 10));
  assert.throws(() => prepareHistoryFile({ schemaVersion: 1, posts: [] }));
  assert.throws(() => prepareHistoryFile({ posts: [raw] }));
});

test('Historique : authentification, validation complète et reprise sans doublon', async t => {
  const previousToken = process.env.ADMIN_TOKEN;
  process.env.ADMIN_TOKEN = 'local-test-only';
  const stored = new Map();
  const repo = { async importDraft(post) { if (stored.has(post.importKey)) return { created: false }; stored.set(post.importKey, post); return { created: true }; } };
  const app = express(); app.use(express.json({ limit: '1mb' })); app.use('/api/social', createSocialRouter(repo));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); if (previousToken === undefined) delete process.env.ADMIN_TOKEN; else process.env.ADMIN_TOKEN = previousToken; });
  const call = (posts, token = 'local-test-only') => fetch(`http://127.0.0.1:${server.address().port}/api/social/admin/import`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ posts }) });
  assert.equal((await call([sample()], 'wrong')).status, 401);
  assert.equal(stored.size, 0);
  assert.equal((await call([sample(), { ...sample(), content: '' }])).status, 400);
  assert.equal(stored.size, 0);
  assert.deepEqual(await (await call([sample()])).json(), { success: true, created: 1, skipped: 0 });
  assert.equal([...stored.values()][0].status, 'draft');
  assert.deepEqual(await (await call([sample()])).json(), { success: true, created: 0, skipped: 1 });
  assert.equal(stored.size, 1);
  repo.importDraft = async () => { throw new Error('private database credentials'); };
  const failure = await call([sample()]);
  assert.equal(failure.status, 500);
  const message = await failure.json();
  assert.equal(message.created, 0); assert.equal(message.skipped, 0);
  assert.ok(!JSON.stringify(message).includes('credentials'));
});
