const express = require('express');
const rateLimit = require('express-rate-limit');
const crypto = require('node:crypto');
const { products, validateOrder } = require('../catalogOrder');
const adminAuth = require('../middleware/adminAuth');
function createCatalogRouter({ Order = require('../models/CatalogOrder'), sendEmail = require('../utils/sendEmail') } = {}) {
  const router = express.Router();
  router.get('/', (req, res) => res.json({ products }));
  router.post('/orders', rateLimit({ windowMs: 60 * 60 * 1000, limit: 15, standardHeaders: true, legacyHeaders: false }), async (req, res) => {
    let order;
    try { order = validateOrder(req.body); }
    catch (error) { return res.status(400).json({ success: false, error: error.message }); }
    const requestId = req.body.requestId;
    if (typeof requestId !== 'string' || !/^[a-f0-9-]{36}$/i.test(requestId)) return res.status(400).json({ success: false, error: 'Identifiant de demande invalide.' });
    try {
      let saved = await Order.findOne({ requestId });
      if (saved && saved.customer.email !== order.customer.email) return res.status(409).json({ success: false, error: 'Veuillez renouveler votre demande.' });
      if (!saved) {
        try { saved = await Order.create({ ...order, requestId, reference: `MP-${crypto.randomBytes(6).toString('hex').toUpperCase()}` }); }
        catch (error) { if (error.code !== 11000) throw error; saved = await Order.findOne({ requestId }); if (!saved || saved.customer.email !== order.customer.email) throw error; }
      }
      if (!saved.notified) {
        const text = [`Demande ${saved.reference}`, saved.customer.name, saved.customer.email, saved.customer.phone, saved.customer.company, saved.delivery === 'pickup' ? 'Retrait atelier' : `Livraison : ${saved.customer.address}`, ...saved.items.map(item => `${item.quantity} × ${item.sku} — ${item.name} / ${item.color} — ${(item.priceCents / 100).toFixed(2)} EUR`), `Sous-total produits : ${(saved.totalCents / 100).toFixed(2)} EUR`, 'Disponibilité et frais de livraison à confirmer.', saved.customer.comment].join('\n');
        try {
          // Explicit HTML escaping because the existing mail helper interpolates text.
          const escaped = text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
          await sendEmail({ to: process.env.ADMIN_EMAIL || 'contact@mecaprint3d.fr', subject: `Boutique — ${saved.reference}`, text, html: `<pre style="white-space:pre-wrap;font-family:Arial">${escaped}</pre>` });
          saved.notified = true; await saved.save();
        } catch { console.error('Catalog notification failed; order retained:', saved.reference); }
      }
      res.status(201).json({ success: true, reference: saved.reference, totalCents: saved.totalCents });
    } catch { res.status(503).json({ success: false, error: 'Enregistrement indisponible. Votre panier est conservé ; réessayez ou contactez contact@mecaprint3d.fr.' }); }
  });
  router.get('/admin/orders', adminAuth, async (req, res) => {
    res.set('Cache-Control', 'no-store');
    try { const page = Math.max(1, Math.min(10000, parseInt(req.query.page, 10) || 1)); const orders = await Order.find().sort({ createdAt: -1 }).skip((page - 1) * 25).limit(26).lean(); res.json({ orders: orders.slice(0, 25), hasMore: orders.length > 25, page }); }
    catch { res.status(503).json({ success: false, error: 'Demandes indisponibles.' }); }
  });
  return router;
}
module.exports = { createCatalogRouter };
