const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createReviewApp } = require('./reviewServer');
test('review login isolates data, blocks production routes and external sending', async t => {
  const password = 'review-only-test-password-123';
  const server = createReviewApp({ password, token: 'review-session-token' }).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  const basic = { Authorization: `Basic ${Buffer.from('linkedin-review:' + password).toString('base64')}` };
  assert.equal((await fetch(base + '/review-session.js', { headers: basic })).status, 200);
  const headers = { Authorization: 'Bearer review-session-token', 'Content-Type': 'application/json' };
  assert.equal((await fetch(base + '/review-api/api/social/admin')).status, 401);
  assert.equal((await fetch(base + '/review-api/api/quotes', { headers })).status, 404);
  for (const expected of [1, 0]) {
    const response = await fetch(base + '/review-api/api/social/admin/linkedin/import', { headers, method: 'POST', body: '{}' });
    assert.equal((await response.json()).created, expected);
  }
  const feed = await (await fetch(base + '/review-api/api/social/admin', { headers })).json();
  assert.equal(feed.posts.length, 1); assert.equal(feed.posts[0].status, 'draft');
  assert.equal((await fetch(base + '/review-api/api/social/admin/posts/' + feed.posts[0]._id + '/distribute', { headers, method: 'POST', body: '{}' })).status, 409);
  const config = await (await fetch(base + '/review-api/api/social/admin/distribution', { headers })).json();
  assert.equal(config.connections.linkedin.configured, false);
});
