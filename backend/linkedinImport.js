const { configuration } = require('./socialPublisher');
const { validateHistoryPost } = require('./historyImport');

function failure(message, status = 502) { return Object.assign(new Error(message), { status }); }
async function importLinkedin({ repository, start = 0, env = process.env, fetchImpl = fetch, alreadySent = async () => false }) {
  if (env === process.env) env = await require('./linkedinOAuth').runtimeEnv(env);
  if (!configuration(env).linkedin.configured) throw failure('Configurez les accès LinkedIn sur le serveur avant de récupérer les publications.', 409);
  if (!Number.isSafeInteger(start) || start < 0 || start > 10000) throw failure('Position de récupération invalide.', 400);
  const author = `urn:li:organization:${env.LINKEDIN_ORGANIZATION_ID}`;
  const url = new URL('https://api.linkedin.com/rest/posts');
  url.search = new URLSearchParams({ q: 'author', author, count: '10', start: String(start), sortBy: 'LAST_MODIFIED' }).toString();
  let response;
  try {
    response = await fetchImpl(url.href, { headers: { Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`, 'LinkedIn-Version': env.LINKEDIN_API_VERSION, 'X-Restli-Protocol-Version': '2.0.0' }, signal: AbortSignal.timeout(25000), redirect: 'error' });
  } catch { throw failure('LinkedIn ne répond pas. Vous pouvez réessayer sans créer de doublons.'); }
  if (!response.ok) throw failure(response.status === 401 || response.status === 403 ? 'LinkedIn refuse la lecture : vérifiez la validité de l’accès et l’autorisation r_organization_social.' : `Lecture LinkedIn indisponible (HTTP ${response.status}).`, response.status === 401 || response.status === 403 ? 409 : 502);
  let data;
  try { data = await response.json(); } catch { throw failure('Réponse LinkedIn illisible.'); }
  if (!Array.isArray(data.elements) || data.elements.length > 10) throw failure('Réponse LinkedIn inattendue.');
  let created = 0, skipped = 0, unsupported = 0;
  for (const item of data.elements) {
    const match = /^urn:li:(share|ugcPost):(\d{1,40})$/.exec(item.id || '');
    if (item.author !== author || item.lifecycleState !== 'PUBLISHED' || item.visibility !== 'PUBLIC' || !match || typeof item.commentary !== 'string' || !item.commentary.trim() || !Number.isSafeInteger(item.publishedAt) || item.publishedAt <= 0) { unsupported++; continue; }
    if (await alreadySent(item.id)) { skipped++; continue; }
    const originalText = item.commentary;
    let post;
    try {
      post = validateHistoryPost({ title: originalText.trim().split('\n')[0].slice(0, 160), content: originalText, socialText: originalText.slice(0, 5000), category: 'actualite', image: '', imageAlt: '', sourceUrl: `https://www.linkedin.com/embed/feed/update/${item.id}`, sources: [{ platform: 'linkedin', id: match[2], url: `https://www.linkedin.com/feed/update/${item.id}`, publishedDate: new Date(item.publishedAt).toISOString().slice(0, 10), originalText }] });
    } catch { unsupported++; continue; }
    try { if ((await repository.importDraft(post)).created) created++; else skipped++; }
    catch { throw failure(`Récupération interrompue après ${created} ajout(s). Les brouillons sont conservés ; relancez ce lot sans doublon.`, 500); }
  }
  // Do not follow provider-supplied links with the access token.
  return { created, skipped, unsupported, nextStart: data.elements.length === 10 && start < 10000 ? start + 10 : null };
}
module.exports = { importLinkedin };
