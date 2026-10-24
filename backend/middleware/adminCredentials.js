const { createHash, timingSafeEqual } = require('node:crypto');
function matchesSecret(supplied, expected) {
  if (typeof supplied !== 'string' || typeof expected !== 'string' || !supplied || !expected) return false;
  const hash = value => createHash('sha256').update(value).digest();
  return timingSafeEqual(hash(supplied), hash(expected));
}
module.exports = { matchesSecret };
