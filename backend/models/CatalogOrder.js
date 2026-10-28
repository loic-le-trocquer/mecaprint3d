const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  reference: { type: String, unique: true, required: true },
  requestId: { type: String, unique: true, required: true },
  customer: { name: String, email: String, phone: String, company: String, address: String, comment: String },
  delivery: { type: String, enum: ['delivery', 'pickup'] },
  items: [{ _id: false, sku: String, name: String, color: String, diameter: String, weight: Number, quantity: Number, priceCents: Number }],
  totalCents: Number,
  status: { type: String, default: 'Nouvelle' },
  notified: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('CatalogOrder', schema);
