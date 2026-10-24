const { matchesSecret } = require('./adminCredentials');

// Same credentials as the existing site administration.
module.exports = function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD;
  if (!expected) return res.status(503).json({ success: false, error: 'Administration non configurée.' });
  const header = req.get('Authorization') || '';
  const supplied = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!matchesSecret(supplied, expected)) return res.status(401).json({ success: false, error: 'Accès admin refusé.' });
  next();
};
