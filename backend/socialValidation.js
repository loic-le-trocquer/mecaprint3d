const { socialEmbed } = require('./socialEmbed');
const networks = ['facebook', 'instagram', 'linkedin'];
function validateLinks(body) {
  return Object.fromEntries(networks.map(network => {
    const value = body?.[network] ?? '';
    if (typeof value !== 'string' || value.length > 1000) throw new Error('Lien trop long ou invalide.');
    if (!value.trim()) return [network, ''];
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port || ![`${network}.com`, `www.${network}.com`].includes(url.hostname)) throw new Error(`Utilisez le lien HTTPS de votre profil ${network}.`);
    return [network, url.href];
  }));
}
function validatePost(body) {
  if (!body || typeof body !== 'object') throw new Error('Publication invalide.');
  const text = (key, max, required = false) => {
    const value = body[key] ?? '';
    if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new Error(`Champ ${key} invalide.`);
    return value.trim();
  };
  if (!['draft', 'ready', 'published'].includes(body.status)) throw new Error('État invalide.');
  if (!['actualite', 'realisation'].includes(body.category)) throw new Error('Rubrique invalide.');
  const image = text('image', 1000);
  if (image && !/^\/images\/[\w./-]+$/.test(image)) {
    const url = new URL(image);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Utilisez une image HTTPS.');
  }
  if (!Array.isArray(body.channels) || body.channels.some(n => !networks.includes(n))) throw new Error('Réseau invalide.');
  const source = socialEmbed(text('sourceUrl', 5000));
  return { sourceUrl: source?.sourceUrl || '', title: text('title', 160, true), content: text('content', 10000, true), socialText: text('socialText', 5000), image, imageAlt: text('imageAlt', 240), category: body.category, status: body.status, channels: [...new Set(body.channels)] };
}
module.exports = { networks, validateLinks, validatePost };
