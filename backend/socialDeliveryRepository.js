const Delivery = require('./models/SocialDelivery');
module.exports = {
  async claim(post, channel) {
    await Delivery.init();
    try { await Delivery.create({ post, channel, state: 'sending', message: 'Envoi en cours ; ne relancez pas avant vérification.' }); return true; }
    catch (error) { if (error.code === 11000) return false; throw error; }
  },
  async get(post, channel) { return Delivery.findOne({ post, channel }).select('state externalId message sentAt -_id').lean(); },
  async list(post) { return Delivery.find({ post }).select('channel state externalId message sentAt -_id').lean(); },
  async finish(post, channel, result) { await Delivery.updateOne({ post, channel, state: 'sending' }, { $set: result }, { runValidators: true }); }
};
