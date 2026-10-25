import { useEffect, useState } from 'react';
import { socialRequest } from '../lib/social';
const names = { facebook: 'Facebook', linkedin: 'LinkedIn' };
const states = { sending: 'Envoi à vérifier', sent: 'Envoyé', rejected: 'Refusé', unknown: 'Résultat à vérifier sur le réseau' };
export default function SocialDistribution({ token, post, busy, perform, save, setNotice }) {
  const [connections, setConnections] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; socialRequest('/admin/distribution', token).then(r => { if (active) setConnections(r.connections); }).catch(() => { if (active) setError('État des connexions indisponible.'); }); return () => { active = false; }; }, [token]);
  useEffect(() => { let active = true; setDeliveries([]); if (post._id) socialRequest(`/admin/deliveries/${post._id}`, token).then(r => { if (active) setDeliveries(r.deliveries); }).catch(() => { if (active) setError('Historique des envois indisponible.'); }); return () => { active = false; }; }, [post._id, token]);
  const selected = post.channels.filter(c => names[c]);
  const available = selected.length > 0 && selected.every(c => connections?.[c]?.configured);
  return <section className="my-6 rounded-xl border border-orange-500/30 p-4">
    <h4 className="font-bold text-orange-300">Diffusion depuis le site</h4>
    <p className="mt-2 text-sm leading-6 text-zinc-300">Ce bouton enregistre l’actualité sur le site, puis envoie le texte destiné aux réseaux et le lien vers sa page sur les réseaux sélectionnés. L’image reste sur la page du site ; son aperçu dépend du réseau.</p>
    <ul className="my-3 space-y-2 text-sm">{Object.entries(names).map(([channel, name]) => <li key={channel}>{name} : {connections ? connections[channel]?.configured ? 'Accès de publication configuré — validation au prochain envoi' : 'À activer — autorisation de publication nécessaire' : 'Vérification…'}</li>)}</ul>
    {!available && <p className="mb-3 text-sm text-zinc-400">La diffusion sera disponible après configuration des accès de publication pour les réseaux choisis. Les liens de profils et la connexion au navigateur ne les activent pas.</p>}
    {error && <p role="status" className="text-sm text-orange-300">{error}</p>}
    <button type="button" disabled={busy || !available || !post.title.trim() || !post.content.trim()} className="rounded-xl border border-orange-500 bg-orange-500 px-4 py-3 font-bold text-black disabled:opacity-40" onClick={() => perform(async () => {
      const saved = await save({ ...post, status: 'published' });
      setNotice('Actualité enregistrée sur le site. Diffusion en cours…');
      const result = await socialRequest(`/admin/posts/${saved._id}/distribute`, token, 'POST', { channels: selected });
      setDeliveries(result.deliveries);
      setNotice(result.deliveries.every(d => d.state === 'sent') ? 'Actualité publiée sur le site et envoyée aux réseaux sélectionnés.' : 'Actualité visible sur le site. Consultez le résultat de chaque réseau ; ne relancez pas un envoi au résultat incertain.');
    })}>Publier sur le site et les réseaux sélectionnés</button>
    {deliveries.length > 0 && <ul className="mt-4 space-y-3 text-sm">{deliveries.map(d => <li key={d.channel}><strong>{names[d.channel]} : {states[d.state] || d.state}</strong><p>{d.message}</p>{d.externalId && <p className="break-all text-zinc-400">Référence : {d.externalId}</p>}</li>)}</ul>}
    <p className="mt-3 text-xs leading-5 text-zinc-400">Une seule tentative par actualité et par réseau. En cas de refus ou de résultat incertain, vérifiez le réseau avant de demander une intervention. Enregistrer seul n’envoie rien sur les réseaux.</p>
  </section>;
}
