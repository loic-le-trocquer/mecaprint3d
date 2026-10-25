const { articleUrl } = require('./socialEmbed');
const CHANNELS = ['facebook', 'linkedin'];
function configuration(env = process.env) {
  return {
    facebook: { configured: Boolean(env.FACEBOOK_PAGE_ACCESS_TOKEN && /^\d+$/.test(env.FACEBOOK_PAGE_ID || '') && /^v\d+\.0$/.test(env.FACEBOOK_GRAPH_VERSION || '')) },
    linkedin: { configured: Boolean(env.LINKEDIN_ACCESS_TOKEN && /^\d+$/.test(env.LINKEDIN_ORGANIZATION_ID || '') && /^20\d{4}$/.test(env.LINKEDIN_API_VERSION || '')) }
  };
}
function prepare(post, channel) {
  const link = articleUrl(String(post._id));
  const base = (post.socialText || post.content).trim();
  const text = base.includes(link) ? base : `${base}\n\n${link}`;
  if (text.length > (channel === 'linkedin' ? 3000 : 60000)) throw new Error('Le texte dépasse la limite du réseau. Raccourcissez le texte destiné aux réseaux.');
  return { text, link };
}
// Tokens stay on the server. A timeout has an unknown outcome: never automatically retry.
async function send(post, channel, { env = process.env, fetchImpl = fetch } = {}) {
  if (!CHANNELS.includes(channel) || !configuration(env)[channel].configured) throw new Error('Connexion de publication non configurée.');
  const { text, link } = prepare(post, channel);
  let url, headers, payload;
  if (channel === 'facebook') {
    url = `https://graph.facebook.com/${env.FACEBOOK_GRAPH_VERSION}/${env.FACEBOOK_PAGE_ID}/feed`;
    headers = { Authorization: `Bearer ${env.FACEBOOK_PAGE_ACCESS_TOKEN}`, 'Content-Type': 'application/json' };
    payload = { message: text, link };
  } else {
    url = 'https://api.linkedin.com/rest/posts';
    headers = { Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`, 'Content-Type': 'application/json', 'LinkedIn-Version': env.LINKEDIN_API_VERSION, 'X-Restli-Protocol-Version': '2.0.0' };
    payload = { author: `urn:li:organization:${env.LINKEDIN_ORGANIZATION_ID}`, commentary: text, visibility: 'PUBLIC', distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] }, lifecycleState: 'PUBLISHED', isReshareDisabledByAuthor: false, content: { article: { source: link, title: post.title, description: post.content.slice(0, 200) } } };
  }
  let response;
  try { response = await fetchImpl(url, { method: 'POST', headers, body: JSON.stringify(payload), signal: AbortSignal.timeout(25000) }); }
  catch { return { state: 'unknown', message: 'Réponse non reçue. Vérifiez directement le réseau avant toute nouvelle action.' }; }
  if (!response.ok) return { state: response.status >= 500 ? 'unknown' : 'rejected', message: response.status === 401 || response.status === 403 ? 'Autorisation refusée ou expirée. Reconnectez le réseau.' : `Envoi refusé par le réseau (HTTP ${response.status}).` };
  let externalId;
  try { externalId = channel === 'facebook' ? (await response.json()).id : response.headers.get('x-restli-id'); } catch {}
  if (typeof externalId !== 'string' || !(channel === 'facebook' ? /^\d+_\d+$/ : /^urn:li:(share|ugcPost):\d+$/).test(externalId)) return { state: 'unknown', message: 'Le réseau a répondu sans identifiant vérifiable. Vérifiez la publication sur le réseau.' };
  return { state: 'sent', externalId, sentAt: new Date(), message: 'Publication envoyée.' };
}
module.exports = { CHANNELS, configuration, prepare, send };
