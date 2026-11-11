const Delivery = require('./models/SocialDelivery');
module.exports = {
  async claim(post, channel) {
    await Delivery.init();
    try { await Delivery.create({ post, channel, state: 'sending', message: 'Envoi en cours ; ne relancez pas avant vérification.' }); return true; }
    catch (error) {
      if (error.code !== 11000) throw error;
      // Only explicit rejections can be retried; unknown, sending and sent stay locked.
      const retried = await Delivery.findOneAndUpdate(
        { post, channel, state: 'rejected' },
        { $set: { state: 'sending', message: 'Nouvelle tentative en cours ; ne relancez pas avant vérification.' },
          $unset: { externalId: 1, sentAt: 1 } },
        { new: true, runValidators: true }
      );
      return Boolean(retried);
    }
  },
  async get(post, channel) { return Delivery.findOne({ post, channel }).select('state externalId message sentAt -_id').lean(); },
  async list(post) { return Delivery.find({ post }).select('channel state externalId message sentAt -_id').lean(); },
  async finish(post, channel, result) { await Delivery.updateOne({ post, channel, state: 'sending' }, { $set: result }, { runValidators: true }); }
};
