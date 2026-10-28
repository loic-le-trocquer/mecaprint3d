const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { products, validateOrder } = require('./catalogOrder');
const { createCatalogRouter } = require('./routes/catalog');
const valid = () => ({ name: 'Client test', email: 'client@example.com', consent: true, delivery: 'pickup', requestId: '12345678-1234-1234-1234-123456789012', items: [{ sku: products[0].sku, quantity: 2, priceCents: 1 }] });
test('all source SKUs are present and public data contains no purchasing information', () => {
  assert.equal(products.length, 1159); assert.equal(new Set(products.map(p => p.sku)).size, 1159);
  for (const product of products) { assert.deepEqual(Object.keys(product).sort(), ['sku','ean','diameter','name','color','weight','brand','priceCents','type'].sort()); assert.ok(Number.isInteger(product.priceCents) && product.priceCents > 0); }
  assert.equal(products.find(p => p.sku === 'APRO-175BLCK-00500').priceCents, 3470);
});
test('server recalculates prices and rejects invalid quantities, duplicates, unknown SKUs and missing consent', () => {
  assert.equal(validateOrder(valid()).totalCents, products[0].priceCents * 2);
  for (const quantity of [0, -1, 1.5, '2', 1000]) assert.throws(() => validateOrder({ ...valid(), items: [{ sku: products[0].sku, quantity }] }));
  assert.throws(() => validateOrder({ ...valid(), items: [...valid().items, ...valid().items] }));
  assert.throws(() => validateOrder({ ...valid(), items: [{ sku: 'unknown', quantity: 1 }] }));
  assert.throws(() => validateOrder({ ...valid(), consent: false }));
  assert.throws(() => validateOrder({ ...valid(), delivery: 'delivery' }));
});
test('API persists orders despite email outage, retries do not duplicate them and admin is protected', async () => {
  const stored = []; const emails = [];
  const Order = { findOne: async query => stored.find(item => item.requestId === query.requestId), create: async data => { const item = { ...data, save: async () => {} }; stored.push(item); return item; } };
  const app = express(); app.use(express.json()); app.use('/api/catalog', createCatalogRouter({ Order, sendEmail: async mail => { emails.push(mail); throw new Error('mail unavailable'); } }));
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/catalog`;
  try {
    const catalog = await (await fetch(url)).json(); assert.equal(catalog.products.length, 1159);
    const body = { ...valid(), name: '<script>unsafe</script>' };
    for (let i = 0; i < 2; i++) { const response = await fetch(`${url}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); assert.equal(response.status, 201); const result = await response.json(); assert.equal(result.totalCents, products[0].priceCents * 2); }
    assert.equal(stored.length, 1); assert.ok(emails[0].html.includes('&lt;script&gt;')); assert.equal(stored[0].notified, undefined);
    const privateResponse = await fetch(`${url}/admin/orders`); assert.ok([401,503].includes(privateResponse.status));
    const failed = await fetch(`${url}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, requestId: 'bad' }) }); assert.equal(failed.status, 400);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
