const crypto = require('node:crypto');
const tokenHash = token => crypto.createHash('sha256').update(token).digest('hex');
function visitorAuthorized(conversation, authorization = '') {
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!/^[a-f0-9]{64}$/.test(token) || !/^[a-f0-9]{64}$/.test(conversation.visitorTokenHash || '')) return false;
  return crypto.timingSafeEqual(Buffer.from(tokenHash(token), 'hex'), Buffer.from(conversation.visitorTokenHash, 'hex'));
}
function publicConversation(conversation) {
  return { _id: conversation._id, status: conversation.status, messages: (conversation.messages || []).map(m => ({ _id: m._id, from: m.from, text: m.text, createdAt: m.createdAt, files: (m.files || []).map(f => ({ originalName: f.originalName, path: f.path })) })) };
}
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports = { tokenHash, visitorAuthorized, publicConversation, escapeHtml };
