import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { API_URL } from '../lib/api';
import { socialNames, postStatuses, newPost, socialRequest } from '../lib/social';
import { PublicationCard } from '../components/SocialNews';

const field = 'mt-2 w-full rounded-xl border border-white/20 bg-zinc-950 p-3 text-white focus:border-orange-500';
const button = 'rounded-xl border border-white/20 px-4 py-3 text-sm font-bold transition hover:border-orange-500 disabled:opacity-50';
function Field({ label, children }) { return <label className="my-4 block text-sm font-semibold text-zinc-300">{label}{children}</label>; }

export default function AdminSocial() {
  const token = localStorage.getItem('mecaprint3d_admin_token') || '';
  const [data, setData] = useState(null);
  const [post, setPost] = useState(newPost);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [authError, setAuthError] = useState(false);
  const refresh = async (nextPage = page) => { const result = await socialRequest(`/admin?page=${nextPage}`, token); setData(result); setPage(nextPage); };
  useEffect(() => {
    let cancelled = false;
    if (token) socialRequest('/admin', token).then(result => { if (!cancelled) setData(result); }).catch(error => { if (!cancelled) { setNotice(error.message); setAuthError(true); } });
    return () => { cancelled = true; };
  }, [token]);
  async function perform(action) {
    setBusy(true); setNotice('');
    try { await action(); } catch (error) { setNotice(error.message); } finally { setBusy(false); }
  }
  const change = (key, value) => setPost(prev => ({ ...prev, [key]: value }));
  async function upload(file) {
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) { setNotice('Choisissez une image de moins de 10 Mo.'); return; }
    await perform(async () => {
      const body = new FormData(); body.append('image', file);
      const response = await fetch(`${API_URL}/api/site-content/admin/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body });
      const result = await response.json();
      if (!response.ok || !result.imageUrl) throw new Error(result.error || 'Envoi de l’image impossible.');
      change('image', result.imageUrl); setNotice('Image envoyée. Enregistrez la publication pour la conserver.');
    });
  }
  if (!token) return <AdminLayout title="Actualités & Réseaux"><p><a className="text-orange-400 underline" href="/admin">Connectez-vous à l’administration existante</a> pour préparer vos publications.</p></AdminLayout>;
  return <AdminLayout title="Actualités & Réseaux">
    <p className="mb-6 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 leading-7 text-orange-100">Facebook, Instagram et LinkedIn ne sont pas connectés. Aucune diffusion automatique ni programmation n’est active. Ajouter un lien de profil ne connecte pas son API.</p>
    <p role="status" aria-live="polite" className="mb-4 whitespace-pre-wrap text-orange-300">{notice}</p>
    {authError && <a href="/admin" className="text-orange-400 underline">Vérifier votre connexion à l’administration</a>}
    {!data && !authError && <p role="status">Chargement…</p>}
    {data && <>
      <form className="mb-10 rounded-3xl border border-white/10 bg-zinc-900 p-6" onSubmit={e => { e.preventDefault(); perform(async () => { await socialRequest('/admin/links', token, 'PUT', data.links); setNotice('Liens enregistrés. Ils apparaissent sur le site, sans connexion automatique.'); }); }}>
        <h3 className="text-2xl font-black">Vos profils sociaux</h3><p className="mt-2 text-zinc-400">Laissez vide pour masquer un réseau.</p>
        <fieldset disabled={busy} className="mt-4 grid gap-4 xl:grid-cols-3">{Object.entries(socialNames).map(([key, name]) => <Field key={key} label={name}><input type="url" className={field} value={data.links[key] || ''} placeholder={`https://www.${key}.com/…`} onChange={e => setData(prev => ({ ...prev, links: { ...prev.links, [key]: e.target.value } }))} /></Field>)}</fieldset><button disabled={busy} className={button}>Enregistrer les liens</button>
      </form>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(240px,1fr)_minmax(0,2fr)]">
        <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6"><h3 className="mb-4 text-2xl font-black">Publications</h3><button disabled={busy} type="button" className={button} onClick={() => { setPost(newPost()); setNotice(''); }}>Nouvelle publication</button>
          {!data.posts.length && <p className="mt-6 text-zinc-400">Aucune publication sur cette page.</p>}
          {data.posts.map(item => <div key={item._id} className="border-b border-white/10 py-5"><h4 className="break-words font-bold">{item.title}</h4><p className="my-2 text-sm text-zinc-400">{postStatuses[item.status]}</p><button disabled={busy} type="button" className={button} onClick={() => { setPost({ ...newPost(), ...item }); setNotice(''); }}>Modifier</button></div>)}
          <div className="mt-4 flex flex-wrap gap-2">{page > 1 && <button disabled={busy} className={button} onClick={() => perform(() => refresh(page - 1))}>Précédent</button>}{data.hasMore && <button disabled={busy} className={button} onClick={() => perform(() => refresh(page + 1))}>Suivant</button>}</div>
        </section>
        <form className="min-w-0 rounded-3xl border border-white/10 bg-zinc-900 p-6" onSubmit={e => { e.preventDefault(); perform(async () => { const saved = await socialRequest(post._id ? `/admin/posts/${post._id}` : '/admin/posts', token, post._id ? 'PUT' : 'POST', post); setPost(saved.post); await refresh(1); setNotice(saved.post.status === 'published' ? 'Publication visible sur le site. Aucun envoi vers les réseaux sociaux.' : 'Préparation enregistrée. Elle reste privée.'); }); }}>
          <h3 className="text-2xl font-black">{post._id ? 'Modifier' : 'Créer'} une publication</h3>
          <fieldset disabled={busy}>
            <Field label="Titre"><input className={field} required maxLength={160} value={post.title} onChange={e => change('title', e.target.value)} /></Field>
            <Field label="Rubrique"><select className={field} value={post.category} onChange={e => change('category', e.target.value)}><option value="actualite">Actualité</option><option value="realisation">Réalisation</option></select></Field>
            <Field label="Texte du site"><textarea className={field} required rows={8} maxLength={10000} value={post.content} onChange={e => change('content', e.target.value)} /></Field>
            <Field label="Envoyer une image (10 Mo maximum)"><input className={field} type="file" accept="image/*" onChange={e => { upload(e.target.files[0]); e.target.value = ''; }} /></Field>
            <Field label="Adresse de l’image (HTTPS ou /images/…)"><input className={field} maxLength={1000} value={post.image} onChange={e => change('image', e.target.value)} /></Field>
            <Field label="Description de l’image"><input className={field} maxLength={240} value={post.imageAlt} onChange={e => change('imageAlt', e.target.value)} /></Field>
            <Field label="Texte à copier sur les réseaux"><textarea className={field} rows={5} maxLength={5000} value={post.socialText} onChange={e => change('socialText', e.target.value)} /></Field>
            <fieldset className="my-6"><legend className="font-bold">Destinations envisagées — partage manuel</legend>{Object.entries(socialNames).map(([key, name]) => <label className="mt-3 flex items-center gap-3 text-sm text-zinc-300" key={key}><input type="checkbox" checked={post.channels.includes(key)} onChange={e => change('channels', e.target.checked ? [...post.channels, key] : post.channels.filter(n => n !== key))} />{name} — non connecté</label>)}</fieldset>
            <Field label="État de la publication"><select className={field} value={post.status} onChange={e => change('status', e.target.value)}>{Object.entries(postStatuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
            <p className="mb-4 text-sm text-zinc-400">« Publié sur le site » rend le contenu public uniquement sur MecaPrint3D. Les brouillons et les préparations de partage restent privés.</p>
            <div className="flex flex-wrap gap-3"><button className={`${button} border-orange-500 bg-orange-500 text-black`}>Enregistrer</button><button type="button" className={button} onClick={() => perform(async () => { await navigator.clipboard.writeText(post.socialText || post.content); setNotice('Texte copié. Collez-le sur le réseau choisi et ajoutez votre image.'); })}>Copier le texte social</button>
            {post._id && <button type="button" className={`${button} text-red-300`} onClick={() => { if (window.confirm('Supprimer définitivement cette publication ?')) perform(async () => { await socialRequest(`/admin/posts/${post._id}`, token, 'DELETE'); setPost(newPost()); await refresh(1); setNotice('Publication supprimée.'); }); }}>Supprimer</button>}</div>
          </fieldset>
          <h4 className="mb-4 mt-10 text-xl font-bold">Aperçu du contenu</h4><PublicationCard post={{ ...post, title: post.title || 'Titre de votre publication' }} />
        </form>
      </div>
    </>}
  </AdminLayout>;
}
