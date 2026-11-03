const { test } = require('node:test');
const assert = require('node:assert/strict');
const { importLinkedin } = require('./linkedinImport');
const env = { LINKEDIN_ACCESS_TOKEN: 'private-token', LINKEDIN_ORGANIZATION_ID: '129744062', LINKEDIN_API_VERSION: '202610' };
const item = { id: 'urn:li:share:123', author: 'urn:li:organization:129744062', lifecycleState: 'PUBLISHED', visibility: 'PUBLIC', commentary: 'Une réalisation de l’atelier', publishedAt: Date.parse('2026-10-01T12:00:00Z') };
test('imports private drafts and deduplicates existing history on repeated pulls', async () => {
  const keys = new Set();
  const repository = { async importDraft(post) { assert.equal(post.status, 'draft'); assert.equal(post.publishedAt, null); assert.equal(post.sources[0].publishedDate, '2026-10-01'); assert.equal(post.sourceUrl, 'https://www.linkedin.com/embed/feed/update/urn:li:share:123'); const created = !keys.has(post.importKey); keys.add(post.importKey); return { created }; } };
  const fetchImpl = async (url, options) => { assert.equal(new URL(url).origin, 'https://api.linkedin.com'); assert.equal(new URL(url).searchParams.get('author'), item.author); assert.equal(options.headers.Authorization, 'Bearer private-token'); assert.equal(options.redirect, 'error'); return { ok: true, json: async () => ({ elements: [item] }) }; };
  assert.equal((await importLinkedin({ env, repository, fetchImpl })).created, 1);
  assert.equal((await importLinkedin({ env, repository, fetchImpl })).skipped, 1);
});
test('does not import other organizations, unpublished or nonpublic posts, or site deliveries', async () => {
  const result = await importLinkedin({ env, repository: { importDraft() { assert.fail('must not write'); } }, alreadySent: async () => true, fetchImpl: async () => ({ ok: true, json: async () => ({ elements: [item, { ...item, author: 'urn:li:organization:1' }, { ...item, lifecycleState: 'DRAFT' }, { ...item, visibility: 'CONNECTIONS' }] }) }) });
  assert.equal(result.skipped, 1); assert.equal(result.unsupported, 3);
});
test('fails closed without credentials, with invalid cursor or refused permissions', async () => {
  const fetchImpl = () => assert.fail('must not send');
  await assert.rejects(importLinkedin({ env: {}, fetchImpl }), { status: 409 });
  await assert.rejects(importLinkedin({ env, start: -1, fetchImpl }), { status: 400 });
  await assert.rejects(importLinkedin({ env, fetchImpl: async () => ({ ok: false, status: 403 }) }), /r_organization_social/);
});
test('offers bounded next page without following provider links', async () => {
  const result = await importLinkedin({ env, repository: { importDraft: async () => ({ created: false }) }, fetchImpl: async () => ({ ok: true, json: async () => ({ elements: Array(10).fill(item), paging: { links: [{ href: 'https://untrusted.invalid' }] } }) }) });
  assert.equal(result.nextStart, 10);
});
