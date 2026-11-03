import { useEffect, useState } from 'react';
import { socialRequest } from '../lib/social';
export default function LinkedinConnection({ token, busy, perform }) {
  const [connection, setConnection] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; socialRequest('/admin/linkedin/connection', token).then(r => { if (active) setConnection(r); }).catch(() => { if (active) setError('État de la connexion LinkedIn indisponible.'); }); return () => { active = false; }; }, [token]);
  return <section className="mb-6 rounded-3xl border border-white/10 bg-zinc-900 p-6">
    <h3 className="text-2xl font-black">Connecter la page LinkedIn</h3>
    <p className="my-3 text-sm text-zinc-300">Autorisez MecaPrint3D à lire les publications de votre page et à publier lorsque vous le demandez. Aucun contenu n’est envoyé pendant la connexion.</p>
    <p role="status" className="mb-3 text-orange-300">{error || (!connection ? 'Vérification…' : connection.connected ? `Page autorisée — accès valable jusqu’au ${new Date(connection.expires).toLocaleDateString('fr-FR')}. La publication sera vérifiée lors d’un envoi.` : connection.configured ? 'Connexion à effectuer ou à renouveler.' : 'Configuration serveur nécessaire avant la connexion.')}</p>
    <button type="button" disabled={busy || !connection?.configured} className="rounded-xl border border-orange-500 px-4 py-3 font-bold disabled:opacity-50" onClick={() => perform(async () => { const r = await socialRequest('/admin/linkedin/connect', token, 'POST', {}); window.location.assign(r.url); })}>{connection?.connected ? 'Renouveler l’autorisation LinkedIn' : 'Se connecter avec LinkedIn'}</button>
    <p className="mt-3 text-xs text-zinc-400">Les identifiants sont saisis chez LinkedIn. L’autorisation expire : revenez ici pour la renouveler. Pour retirer l’autorisation, utilisez les applications autorisées dans votre compte LinkedIn.</p>
  </section>;
}
