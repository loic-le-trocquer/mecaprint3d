const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createDistributor } = require('./socialDistribution');
const { send, configuration } = require('./socialPublisher');
const post = { _id: '6adc820f33a3608435cd2f28', title: 'Atelier', content: 'Une nouvelle réalisation.', channels: ['facebook', 'linkedin'] };
test('Concurrent and repeated requests send once per destination', async () => {
  const records = new Map(); let calls = 0;
  const distribute = createDistributor({ posts: { publishedForDistribution: async () => post }, deliveries: {
    claim: async (id, channel) => { if (records.has(channel)) return false; records.set(channel, { state: 'sending' }); return true; },
    get: async (id, channel) => records.get(channel), finish: async (id, channel, result) => records.set(channel, result)
  }, configuration: () => ({ facebook: { configured: true }, linkedin: { configured: true } }), send: async () => { calls++; return { state: 'sent' }; } });
  await Promise.all([distribute(post._id, ['facebook']), distribute(post._id, ['facebook'])]); await distribute(post._id, ['facebook']); assert.equal(calls, 1);
});
test('Unconfigured targets, drafts and unsupported targets send nothing', async () => {
  let calls = 0; const deps = { posts: { publishedForDistribution: async () => post }, deliveries: { claim: async () => { calls++; } }, configuration: () => ({ facebook: { configured: true }, linkedin: { configured: false } }) };
  await assert.rejects(createDistributor(deps)(post._id, ['facebook', 'linkedin'])); assert.equal(calls, 0);
  await assert.rejects(createDistributor({ ...deps, posts: { publishedForDistribution: async () => null } })(post._id, ['facebook']));
  await assert.rejects(createDistributor(deps)(post._id, ['instagram']));
});
test('Tokens stay out of configuration and URLs; official endpoints receive the site link', async () => {
  const env = { FACEBOOK_PAGE_ACCESS_TOKEN: 'secret', FACEBOOK_PAGE_ID: '61578525465265', FACEBOOK_GRAPH_VERSION: 'v25.0', LINKEDIN_ACCESS_TOKEN: 'li-secret', LINKEDIN_ORGANIZATION_ID: '129744062', LINKEDIN_API_VERSION: '202610' };
  assert.equal(JSON.stringify(configuration(env)).includes('secret'), false);
  const fb = await send(post, 'facebook', { env, fetchImpl: async (url, options) => { assert.match(url, /^https:\/\/graph.facebook.com\//); assert.equal(url.includes('secret'), false); assert.match(JSON.parse(options.body).link, /\/actualites\/6adc/); return { ok: true, json: async () => ({ id: '61578525465265_123' }) }; } }); assert.equal(fb.state, 'sent');
  const li = await send(post, 'linkedin', { env, fetchImpl: async (url, options) => { assert.equal(url, 'https://api.linkedin.com/rest/posts'); assert.equal(JSON.parse(options.body).author, 'urn:li:organization:129744062'); return { ok: true, headers: { get: () => 'urn:li:share:123' } }; } }); assert.equal(li.state, 'sent');
});
test('Network timeout, missing receipt and server error remain uncertain', async () => {
  const env = { FACEBOOK_PAGE_ACCESS_TOKEN: 'secret', FACEBOOK_PAGE_ID: '1', FACEBOOK_GRAPH_VERSION: 'v25.0' };
  for (const fetchImpl of [async () => { throw Error('secret'); }, async () => ({ ok: true, json: async () => ({}) }), async () => ({ ok: false, status: 500 })]) assert.equal((await send(post, 'facebook', { env, fetchImpl })).state, 'unknown');
});
