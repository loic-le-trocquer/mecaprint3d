import { apiFetch } from './api';
export const socialNames = { facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn' };
export const postStatuses = { draft: 'Brouillon', ready: 'Prêt pour partage manuel', published: 'Publié sur le site' };
export const newPost = () => ({ title: '', content: '', socialText: '', image: '', imageAlt: '', category: 'actualite', status: 'draft', channels: [] });
export const socialRequest = (path, token, method = 'GET', body) => apiFetch(`/api/social${path}`, {
  method,
  headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
  ...(body ? { body: JSON.stringify(body) } : {})
});
export function profileUrl(value, network) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.port && [network + '.com', 'www.' + network + '.com'].includes(url.hostname) ? url.href : null;
  } catch { return null; }
}
