const mongoose = require('mongoose');
module.exports = mongoose.model('SocialSettings', new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  facebook: { type: String, default: '', maxlength: 1000 },
  instagram: { type: String, default: '', maxlength: 1000 },
  linkedin: { type: String, default: '', maxlength: 1000 }
}, { timestamps: true }));
