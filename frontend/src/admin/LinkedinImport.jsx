import { useState } from 'react';
import { socialRequest } from '../lib/social';

export default function LinkedinImport({ token, busy, perform, refresh, setNotice }) {
  const [nextStart, setNextStart] = useState(null);
  const [result, setResult] = useState('');
  const run = start => perform(async () => {
    const r = await socialRequest('/admin/linkedin/import', token, 'POST', { start });
    setNextStart(r.nextStart);
    const message = `${r.created} brouillon(s) ajouté(s), ${r.skipped} déjà présent(s), ${r.unsupported} contenu(s) non importable(s).`;
    setResult(message); setNotice(message); await refresh(1);
  });
  return <section className="mb-6 rounded-3xl border border-white/10 bg-zinc-900 p-6">
    <h3 className="text-2xl font-black">LinkedIn vers le site</h3>
    <p className="my-3 text-sm leading-6 text-zinc-300">Récupérez les publications publiques de votre page par lots de 10. Elles deviennent des brouillons à relire, avec leur date et un lien vers l’original. Les publications déjà importées sont ignorées. Aucun envoi vers LinkedIn n’est déclenché.</p>
    <p className="mb-3 text-sm text-zinc-400">La lecture nécessite un accès LinkedIn approuvé et configuré sur le serveur. Les images et vidéos restent dans la publication LinkedIn intégrée ; elles ne sont pas copiées. La synchronisation se lance ici manuellement.</p>
    <div className="flex flex-wrap gap-3"><button type="button" disabled={busy} className="rounded-xl border border-white/20 px-4 py-3 font-bold disabled:opacity-50" onClick={() => run(0)}>Récupérer les publications récentes</button>
    {nextStart !== null && <button type="button" disabled={busy} className="rounded-xl border border-white/20 px-4 py-3 font-bold disabled:opacity-50" onClick={() => run(nextStart)}>Récupérer le lot suivant</button>}</div>
    {result && <p role="status" className="mt-3 text-sm text-orange-300">{result}</p>}
  </section>;
}
