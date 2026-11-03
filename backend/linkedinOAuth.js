const crypto = require('node:crypto');
const SCOPES = ['r_organization_social', 'w_organization_social'];
const CALLBACK = '/api/social/linkedin/callback';
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const random = () => crypto.randomBytes(32).toString('base64url');
const fail = message => Object.assign(new Error(message), { status: 409 });
function config(env) {
  const redirect = new URL(env.LINKEDIN_REDIRECT_URI || 'https://mecaprint3d-backend.onrender.com' + CALLBACK);
  const website = new URL(env.SITE_URL || 'https://www.mecaprint3d.fr');
  if (!env.LINKEDIN_CLIENT_ID || !env.LINKEDIN_CLIENT_SECRET || !/^[a-f0-9]{64}$/i.test(env.LINKEDIN_TOKEN_KEY || '') || !/^\d+$/.test(env.LINKEDIN_ORGANIZATION_ID || '') || !/^20\d{4}$/.test(env.LINKEDIN_API_VERSION || '') || redirect.protocol !== 'https:' || redirect.pathname !== CALLBACK || redirect.username || redirect.password || redirect.search || redirect.hash || website.protocol !== 'https:' || website.username || website.password) throw fail('Connexion LinkedIn à configurer sur le serveur.');
  return { redirect: redirect.href, returnUrl: new URL('/admin/social', website.origin).href, key: Buffer.from(env.LINKEDIN_TOKEN_KEY, 'hex') };
}
function encrypt(token, key) {
  const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), body].map(b => b.toString('base64url')).join('.');
}
function decrypt(value, key) {
  const [iv, tag, body] = value.split('.').map(s => Buffer.from(s, 'base64url'));
  const cipher = crypto.createDecipheriv('aes-256-gcm', key, iv); cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(body), cipher.final()]).toString('utf8');
}
function repository() {
  const mongoose = require('mongoose');
  const State = mongoose.models.LinkedInState || mongoose.model('LinkedInState', new mongoose.Schema({ key: { type: String, unique: true }, binding: String, expires: { type: Date, expires: 0 } }));
  const Connection = mongoose.models.LinkedInConnection || mongoose.model('LinkedInConnection', new mongoose.Schema({ key: { type: String, unique: true }, encryptedToken: String, expires: Date, organizationId: String, scopes: [String] }));
  return {
    async putState(key, binding) { await State.create({ key, binding, expires: new Date(Date.now() + 600000) }); },
    async takeState(key, binding) { return State.findOneAndDelete({ key, binding, expires: { $gt: new Date() } }).lean(); },
    async save(value) { await Connection.init(); await Connection.findOneAndUpdate({ key: 'main' }, { $set: value }, { upsert: true }); },
    async get() { return Connection.findOne({ key: 'main' }).lean(); }
  };
}
function createFlow({ env = process.env, repo = repository(), fetchImpl = fetch } = {}) {
  return {
    async start() {
      const c = config(env), ticket = random(); await repo.putState('ticket:' + hash(ticket), 'ticket');
      return new URL('/api/social/linkedin/authorize?ticket=' + ticket, c.redirect).href;
    },
    async authorize(ticket) {
      const c = config(env);
      if (typeof ticket !== 'string' || !/^[\w-]{43}$/.test(ticket) || !await repo.takeState('ticket:' + hash(ticket), 'ticket')) throw fail('Demande expirée. Relancez la connexion depuis l’administration.');
      const state = random(), binding = random(); await repo.putState('state:' + hash(state), hash(binding));
      const url = new URL('https://www.linkedin.com/oauth/v2/authorization');
      url.search = new URLSearchParams({ response_type: 'code', client_id: env.LINKEDIN_CLIENT_ID, redirect_uri: c.redirect, state, scope: SCOPES.join(' ') }).toString();
      return { url: url.href, binding };
    },
    async callback(query, binding) {
      const c = config(env);
      if (typeof query.state !== 'string' || !/^[\w-]{43}$/.test(query.state) || typeof binding !== 'string' || !/^[\w-]{43}$/.test(binding) || !await repo.takeState('state:' + hash(query.state), hash(binding))) throw fail('Retour LinkedIn invalide ou expiré. Recommencez depuis l’administration.');
      if (query.error || typeof query.code !== 'string' || !query.code || query.code.length > 4096) throw fail('Autorisation LinkedIn annulée ou refusée.');
      let result;
      try {
        const response = await fetchImpl('https://www.linkedin.com/oauth/v2/accessToken', { method: 'POST', redirect: 'error', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'authorization_code', code: query.code, redirect_uri: c.redirect, client_id: env.LINKEDIN_CLIENT_ID, client_secret: env.LINKEDIN_CLIENT_SECRET }), signal: AbortSignal.timeout(20000) });
        if (!response.ok) throw new Error(); result = await response.json();
      } catch { throw fail('LinkedIn n’a pas confirmé l’autorisation. Relancez la connexion.'); }
      const scopes = typeof result.scope === 'string' ? result.scope.split(/[ ,]+/) : [];
      if (typeof result.access_token !== 'string' || !result.access_token || result.access_token.length > 10000 || !Number.isSafeInteger(result.expires_in) || result.expires_in < 60 || result.expires_in > 31536000 || !SCOPES.every(s => scopes.includes(s))) throw fail('Les droits de lecture et de publication LinkedIn ne sont pas tous accordés.');
      // Check the configured page, not an organization selected through callback parameters.
      const url = new URL('https://api.linkedin.com/rest/posts');
      url.search = new URLSearchParams({ q: 'author', author: 'urn:li:organization:' + env.LINKEDIN_ORGANIZATION_ID, count: '1' }).toString();
      try {
        const response = await fetchImpl(url.href, { redirect: 'error', headers: { Authorization: 'Bearer ' + result.access_token, 'LinkedIn-Version': env.LINKEDIN_API_VERSION, 'X-Restli-Protocol-Version': '2.0.0' }, signal: AbortSignal.timeout(20000) });
        if (!response.ok || !Array.isArray((await response.json()).elements)) throw new Error();
      } catch { throw fail('La lecture de la page MecaPrint3D n’est pas autorisée. Vérifiez la page et votre rôle administrateur.'); }
      await repo.save({ encryptedToken: encrypt(result.access_token, c.key), expires: new Date(Date.now() + result.expires_in * 1000), scopes: SCOPES, organizationId: env.LINKEDIN_ORGANIZATION_ID });
      return c.returnUrl + '?linkedin=connected';
    },
    async credentials() {
      const c = config(env), value = await repo.get();
      if (!value || value.organizationId !== env.LINKEDIN_ORGANIZATION_ID || new Date(value.expires).getTime() < Date.now() + 60000 || !SCOPES.every(s => value.scopes.includes(s))) return null;
      return { token: decrypt(value.encryptedToken, c.key), expires: value.expires };
    }
  };
}
async function runtimeEnv(env = process.env) {
  if (!env.LINKEDIN_CLIENT_ID) return env;
  // Once OAuth is selected, do not silently fall back to an old manual token.
  const value = await createFlow({ env }).credentials();
  return { ...env, LINKEDIN_ACCESS_TOKEN: value?.token || '' };
}
module.exports = { createFlow, runtimeEnv, config, encrypt, decrypt, SCOPES };
