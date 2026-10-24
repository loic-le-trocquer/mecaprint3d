const { createHash } = require('node:crypto');
const { validatePost } = require('./socialValidation');

function normalizeText(value) {
  return value.normalize('NFC').replace(/\s+/gu, ' ').trim();
}
function validateHistoryPost(input) {
  if (!input || !Array.isArray(input.sources) || !input.sources.length || input.sources.length > 10) throw new Error('Chaque brouillon doit avoir entre 1 et 10 sources.');
  const sources = input.sources.map(source => {
    if (!source || !['facebook', 'linkedin'].includes(source.platform) || typeof source.id !== 'string' || !/^\d{1,40}$/.test(source.id)) throw new Error('Source historique invalide.');
    if (typeof source.url !== 'string' || source.url.length > 2000) throw new Error('Lien source invalide.');
    const url = new URL(source.url);
    const hosts = source.platform === 'facebook' ? ['facebook.com', 'www.facebook.com', 'm.facebook.com'] : ['linkedin.com', 'www.linkedin.com'];
    if (url.protocol !== 'https:' || url.username || url.password || url.port || !hosts.includes(url.hostname)) throw new Error('Lien source non autorisé.');
    const date = source.publishedDate;
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error('Date d’origine invalide.');
    if (typeof source.originalText !== 'string' || source.originalText.length > 10000 || !source.originalText.trim()) throw new Error('Texte d’origine manquant ou trop long.');
    return { platform: source.platform, id: source.id, url: url.href, publishedDate: date, originalText: source.originalText };
  });
  const sourceKeys = sources.map(source => `${source.platform}:${source.id}`);
  if (new Set(sourceKeys).size !== sourceKeys.length) throw new Error('Source répétée dans le même brouillon.');
  const post = validatePost({ ...input, status: 'draft', channels: [...new Set(sources.map(source => source.platform))] });
  if (!normalizeText(post.content)) throw new Error('Texte historique vide.');
  if (sources.some(source => normalizeText(source.originalText) !== normalizeText(post.content))) throw new Error('Les versions regroupées ont des textes différents.');
  return {
    ...post,
    status: 'draft', publishedAt: null,
    sources, sourceKeys,
    sourcePublishedDate: sources.map(source => source.publishedDate).sort()[0],
    importKey: 'history-v1:' + createHash('sha256').update(normalizeText(post.content)).digest('hex')
  };
}
function validateHistoryBatch(body) {
  if (!body || !Array.isArray(body.posts) || body.posts.length < 1 || body.posts.length > 10) throw new Error('Importez entre 1 et 10 brouillons par lot.');
  const posts = body.posts.map(validateHistoryPost);
  const keys = posts.flatMap(post => post.sourceKeys);
  if (new Set(keys).size !== keys.length) throw new Error('Une publication source figure dans plusieurs brouillons du lot.');
  return posts;
}
module.exports = { normalizeText, validateHistoryPost, validateHistoryBatch };
