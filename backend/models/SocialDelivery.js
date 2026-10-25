const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'SocialPost' },
  channel: { type: String, enum: ['facebook', 'linkedin'], required: true },
  state: { type: String, enum: ['sending', 'sent', 'rejected', 'unknown'], required: true },
  externalId: String,
  message: String,
  sentAt: Date
}, { timestamps: true });
schema.index({ post: 1, channel: 1 }, { unique: true });
module.exports = mongoose.model('SocialDelivery', schema);
