const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createFlow, encrypt, decrypt, config, SCOPES } = require('./linkedinOAuth');
const env = { LINKEDIN_CLIENT_ID: 'client', LINKEDIN_CLIENT_SECRET: 'secret', LINKEDIN_TOKEN_KEY: 'ab'.repeat(32), LINKEDIN_ORGANIZATION_ID: '129744062', LINKEDIN_API_VERSION: '202610' };
function setup(response = { access_token: 'private-access', expires_in: 3600, scope: SCOPES.join(' ') }, pageAllowed = true) {
  const states = new Map(); let saved, calls = 0;
  const repo = { async putState(key, binding) { states.set(key, binding); }, async takeState(key, binding) { if (states.get(key) !== binding) return null; states.delete(key); return true; }, async save(value) { saved = value; }, async get() { return saved; } };
  const flow = createFlow({ env, repo, fetchImpl: async (url, options) => { calls++; assert.equal(options.redirect, 'error'); if (url === 'https://www.linkedin.com/oauth/v2/accessToken') { assert.equal(options.body.get('client_secret'), 'secret'); return { ok: true, json: async () => response }; } assert.equal(new URL(url).origin, 'https://api.linkedin.com'); assert.equal(new URL(url).searchParams.get('author'), 'urn:li:organization:129744062'); return { ok: pageAllowed, json: async () => ({ elements: [] }) }; } });
  return { flow, saved: () => saved, calls: () => calls };
}
async function begin(flow) { const start = new URL(await flow.start()); return flow.authorize(start.searchParams.get('ticket')); }
test('OAuth uses one-time ticket, browser-bound state, minimum scopes and encrypted expiring token', async () => {
  const s = setup(), initial = new URL(await s.flow.start()), ticket = initial.searchParams.get('ticket');
  const auth = await s.flow.authorize(ticket), target = new URL(auth.url);
  await assert.rejects(s.flow.authorize(ticket));
  assert.equal(target.origin, 'https://www.linkedin.com'); assert.equal(target.searchParams.get('scope'), SCOPES.join(' '));
  assert.ok(!auth.url.includes('secret'));
  const query = { state: target.searchParams.get('state'), code: 'authorization-code' };
  await assert.rejects(s.flow.callback(query, 'x'.repeat(43))); assert.equal(s.calls(), 0);
  assert.equal(await s.flow.callback(query, auth.binding), 'https://www.mecaprint3d.fr/admin/social?linkedin=connected');
  assert.ok(!JSON.stringify(s.saved()).includes('private-access')); assert.equal((await s.flow.credentials()).token, 'private-access');
  await assert.rejects(s.flow.callback(query, auth.binding)); assert.equal(s.calls(), 2);
  s.saved().expires = new Date(0); assert.equal(await s.flow.credentials(), null);
});
test('refused consent, missing scopes, and wrong page never store an authorization', async () => {
  const canceled = setup(), auth = await begin(canceled.flow);
  await assert.rejects(canceled.flow.callback({ state: new URL(auth.url).searchParams.get('state'), error: 'access_denied' }, auth.binding)); assert.equal(canceled.calls(), 0);
  for (const s of [setup({ access_token: 't', expires_in: 3600, scope: 'w_member_social' }), setup(undefined, false)]) {
    const a = await begin(s.flow);
    await assert.rejects(s.flow.callback({ state: new URL(a.url).searchParams.get('state'), code: 'code' }, a.binding)); assert.equal(s.saved(), undefined);
  }
});
test('configuration requires HTTPS callback and encryption detects tampering', () => {
  for (const patch of [{ LINKEDIN_TOKEN_KEY: 'short' }, { LINKEDIN_REDIRECT_URI: 'http://example.com/api/social/linkedin/callback' }, { LINKEDIN_REDIRECT_URI: 'https://example.com/wrong' }]) assert.throws(() => config({ ...env, ...patch }));
  const key = config(env).key, value = encrypt('secret-token', key); assert.equal(decrypt(value, key), 'secret-token');
  assert.throws(() => decrypt(value, Buffer.alloc(32)));
});
