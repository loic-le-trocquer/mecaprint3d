const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 160 },
  content: { type: String, required: true, maxlength: 10000 },
  category: { type: String, enum: ['actualite', 'realisation'], required: true },
  status: { type: String, enum: ['draft', 'ready', 'published'], default: 'draft', index: true },
  socialText: { type: String, default: '', maxlength: 5000 },
  channels: [{ type: String, enum: ['facebook', 'instagram', 'linkedin'] }],
  image: { type: String, default: '', maxlength: 1000 },
  imageAlt: { type: String, default: '', maxlength: 240 },
  publishedAt: { type: Date, default: null }
}, { timestamps: true });
schema.index({ status: 1, publishedAt: -1, _id: -1 });
module.exports = mongoose.model('SocialPost', schema);
