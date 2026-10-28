const products = require('./data/catalog.json');
const bySku = new Map(products.map(product => [product.sku, product]));
function clean(value, max, required = false) {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new Error('Coordonnées manquantes ou trop longues.');
  return value.trim();
}
function validateOrder(body) {
  if (!body || !Array.isArray(body.items) || !body.items.length || body.items.length > 100) throw new Error('Choisissez entre 1 et 100 références.');
  if (body.consent !== true) throw new Error('Votre accord est nécessaire pour traiter cette demande.');
  const customer = { name: clean(body.name, 120, true), email: clean(body.email, 200, true), phone: clean(body.phone || '', 40), company: clean(body.company || '', 160), address: clean(body.address || '', 1000), comment: clean(body.comment || '', 2000) };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) throw new Error('Adresse e-mail invalide.');
  if (!['delivery', 'pickup'].includes(body.delivery)) throw new Error('Choisissez un mode de réception.');
  if (body.delivery === 'delivery' && !customer.address) throw new Error('Renseignez votre adresse de livraison.');
  const seen = new Set();
  const items = body.items.map(item => {
    const product = bySku.get(item?.sku);
    if (!product || seen.has(item.sku) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 999) throw new Error('Référence ou quantité invalide.');
    seen.add(item.sku);
    // Never accept a price, description or total supplied by the browser.
    return { sku: product.sku, name: product.name, color: product.color, diameter: product.diameter, weight: product.weight, quantity: item.quantity, priceCents: product.priceCents };
  });
  return { customer, delivery: body.delivery, items, totalCents: items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0) };
}
module.exports = { products, validateOrder };
