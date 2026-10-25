const publisher = require('./socialPublisher');
function createDistributor({ posts, deliveries, send = publisher.send, configuration = publisher.configuration }) {
  return async function distribute(id, channels) {
    if (!Array.isArray(channels) || !channels.length || channels.length > 2 || new Set(channels).size !== channels.length || channels.some(c => !publisher.CHANNELS.includes(c))) throw Object.assign(new Error('Choisissez Facebook et/ou LinkedIn.'), { status: 400 });
    const post = await posts.publishedForDistribution(id);
    if (!post) throw Object.assign(new Error('Enregistrez et publiez d’abord cette actualité sur le site.'), { status: 400 });
    const config = configuration();
    // Validate every target before making any external change.
    for (const channel of channels) {
      if (!config[channel].configured) throw Object.assign(new Error(`La publication vers ${channel} n’est pas configurée.`), { status: 409 });
      publisher.prepare(post, channel);
      if (!post.channels.includes(channel)) throw Object.assign(new Error('Enregistrez votre sélection de réseaux avant la diffusion.'), { status: 400 });
    }
    const result = [];
    for (const channel of channels) {
      const claim = await deliveries.claim(id, channel);
      if (!claim) { result.push({ channel, ...(await deliveries.get(id, channel)) }); continue; }
      let outcome;
      try { outcome = await send(post, channel); }
      catch { outcome = { state: 'unknown', message: 'Envoi interrompu. Vérifiez le réseau avant toute nouvelle action.' }; }
      // A database error leaves the unique sending claim in place: no duplicate on retry.
      await deliveries.finish(id, channel, outcome);
      result.push({ channel, ...outcome });
    }
    return result;
  };
}
module.exports = { createDistributor };
