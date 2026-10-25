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
  sourceUrl: { type: String, default: '', maxlength: 2000 },
  importKey: { type: String, maxlength: 100 },
  sourceKeys: { type: [String], default: undefined },
  sourcePublishedDate: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
  sources: [{
    _id: false,
    platform: { type: String, enum: ['facebook', 'linkedin'] },
    id: { type: String, maxlength: 40 },
    url: { type: String, maxlength: 2000 },
    publishedDate: String,
    originalText: { type: String, maxlength: 10000 }
  }],
  publishedAt: { type: Date, default: null }
}, { timestamps: true });
schema.index({ status: 1, publishedAt: -1, _id: -1 });
schema.index({ importKey: 1 }, { unique: true, sparse: true });
schema.index({ sourceKeys: 1 }, { unique: true, sparse: true });
module.exports = mongoose.model('SocialPost', schema);
