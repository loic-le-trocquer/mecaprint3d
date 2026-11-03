const fs = require('node:fs');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const dir = path.resolve(__dirname, '../.review-local');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, 'acces-demonstration.json');
let credentials;
if (fs.existsSync(file)) credentials = JSON.parse(fs.readFileSync(file, 'utf8'));
else {
  credentials = { username: 'linkedin-review', password: randomBytes(24).toString('base64url'), url: 'http://127.0.0.1:4319/admin/social', warning: 'Accès local de répétition uniquement. Ne pas soumettre à LinkedIn.' };
  fs.writeFileSync(file, JSON.stringify(credentials, null, 2));
}
require('./reviewServer').createReviewApp({ password: credentials.password }).listen(4319, '127.0.0.1', () => console.log('Espace de répétition prêt : http://127.0.0.1:4319/admin/social'));
