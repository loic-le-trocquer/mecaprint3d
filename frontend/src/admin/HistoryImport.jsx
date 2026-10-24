import { useState } from 'react';
import { prepareHistoryFile, historyBatches } from '../lib/historyImport.mjs';
import { socialRequest } from '../lib/social';

export default function HistoryImport({ token, busy, perform, refresh, setNotice }) {
  const [history, setHistory] = useState(null);
  const [progress, setProgress] = useState('');
  const [finished, setFinished] = useState(false);
  async function selectFile(file) {
    if (!file) return;
    setHistory(null); setFinished(false); setProgress('');
    await perform(async () => {
      if (file.size > 5 * 1024 * 1024) throw new Error('Le fichier doit faire moins de 5 Mo.');
      let raw;
      try { raw = JSON.parse(await file.text()); } catch { throw new Error('Choisissez le fichier JSON de préparation, pas le CSV ou le XLS d’origine.'); }
      const prepared = prepareHistoryFile(raw);
      historyBatches(prepared.posts);
      setHistory(prepared);
      setNotice('Fichier prêt à importer. Aucun contenu n’a encore été ajouté.');
    });
  }
  async function runImport() {
    await perform(async () => {
      let created = 0, skipped = 0, processed = 0;
      try {
        for (const batch of historyBatches(history.posts)) {
          const result = await socialRequest('/admin/import', token, 'POST', { posts: batch });
          created += result.created; skipped += result.skipped; processed += batch.length;
          setProgress(`${processed} / ${history.posts.length} contenus traités — ${created} ajoutés, ${skipped} déjà présents.`);
        }
      } catch (error) {
        await refresh(1).catch(() => {});
        throw new Error(`${error.message} Relancez l’import : les contenus déjà présents ne seront pas dupliqués.`);
      }
      setFinished(true);
      await refresh(1);
      setNotice(`Import terminé : ${created} brouillons ajoutés, ${skipped} contenus déjà présents. Aucun contenu publié sur le site ou les réseaux.`);
    });
  }
  return <section className="mb-10 rounded-3xl border border-white/10 bg-zinc-900 p-6">
    <h3 className="text-2xl font-black">Importer votre historique</h3>
    <p className="mt-3 text-zinc-400">Choisissez le fichier JSON de préparation Facebook/LinkedIn. Les contenus seront ajoutés comme brouillons avec leurs dates, textes et liens d’origine. Les publications déjà présentes restent inchangées.</p>
    <label className="my-4 block text-sm font-bold">Fichier de préparation (.json)<input disabled={busy} className="mt-3 block w-full text-sm" type="file" accept=".json,application/json" onChange={e => { selectFile(e.target.files[0]); e.target.value = ''; }} /></label>
    {history && <div className="mt-5 space-y-4"><p>{history.posts.length} brouillons prêts · {history.missingCount} publications sans texte laissées à compléter.</p><p className="text-sm text-zinc-400">Les photos et vidéos absentes de l’export ne seront pas ajoutées. Les textes identiques regroupés peuvent correspondre à des photos différentes : relisez-les avant publication.</p><ul className="list-inside list-disc text-sm text-zinc-300">{history.posts.slice(0, 3).map((post, i) => <li key={i}>{post.title}</li>)}</ul><button disabled={busy || finished} type="button" onClick={runImport} className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-black disabled:opacity-50">{finished ? 'Import effectué' : `Importer ${history.posts.length} brouillons`}</button></div>}
    <p role="status" aria-live="polite" className="mt-4 text-sm text-orange-300">{progress}</p>
  </section>;
}
