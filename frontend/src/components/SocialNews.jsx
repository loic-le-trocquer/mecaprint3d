import { useEffect, useState } from 'react';
import { socialNames, socialRequest, profileUrl, publicationUrl } from '../lib/social';

export function SocialLinks({ links = {} }) {
  const profiles = Object.entries(socialNames).filter(([key]) => profileUrl(links[key], key));
  if (!profiles.length) return null;
  return <nav aria-label="Réseaux sociaux" className="flex flex-wrap gap-3">{profiles.map(([key, name]) => <a key={key} href={profileUrl(links[key], key)} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#d9dad1] px-4 py-2 text-sm transition hover:border-orange-500 hover:text-[#bc421d]">{name} ↗</a>)}</nav>;
}
export function PublicationCard({ post }) {
  const displayDate = post.sourcePublishedDate || post.publishedAt;
  const url = publicationUrl(post);
  return <article id={post._id ? `publication-${post._id}` : undefined} className="scroll-mt-28 overflow-hidden rounded-none border border-[#d9dad1] bg-[#f4f3ed]">
    {post.image && <img src={post.image} alt={post.imageAlt || post.title} loading="lazy" referrerPolicy="no-referrer" className="h-60 w-full object-cover" />}
    <div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#bc421d]">{post.category === 'realisation' ? 'Réalisation' : 'Actualité'}{displayDate && <> · <time title={post.sourcePublishedDate ? 'Date de publication d’origine' : undefined} dateTime={displayDate}>{new Date(displayDate).toLocaleDateString('fr-FR', post.sourcePublishedDate ? { timeZone: 'UTC' } : undefined)}</time></>}</p><h3 className="mt-3 break-words text-2xl font-black">{post.title}</h3><p className="mt-4 whitespace-pre-wrap break-words leading-7 text-[#65695f]">{post.content?.length > 320 ? post.content.slice(0,320) + '…' : post.content}</p>{url && <a href={url} className="mt-5 inline-flex font-bold text-[#bc421d]">Découvrir le projet et les détails →</a>}</div>
  </article>;
}
export default function SocialNews({ onLinks }) {
  const [posts, setPosts] = useState([]);
  const [links, setLinks] = useState({});
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    socialRequest('/public').then(data => { if (!cancelled) { setPosts(data.posts); setLinks(data.links); onLinks(data.links); setHasMore(data.hasMore); setPage(1); } }).catch(() => { if (!cancelled) setError('Les actualités sont momentanément indisponibles.'); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [onLinks]);
  async function more() {
    setLoading(true); setError('');
    try { const data = await socialRequest(`/public?page=${page + 1}`); setPosts(prev => [...prev, ...data.posts.filter(p => !prev.some(old => old._id === p._id))]); setLinks(data.links); onLinks(data.links); setPage(page + 1); setHasMore(data.hasMore); }
    catch { setError('Impossible de charger les publications. Réessayez.'); } finally { setLoading(false); }
  }
  const visible = posts.filter(p => filter === 'all' || p.category === filter);
  return <section id="actualites" className="scroll-mt-24 px-6 py-20 lg:px-8"><div className="mx-auto max-w-7xl">
    <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="text-xs font-black uppercase tracking-[.3em] text-orange-500">La vie de l’atelier</p><h2 className="mt-4 text-3xl font-black md:text-5xl">Actualités & Réalisations</h2><p className="mt-4 text-[#65695f]">Projets, pièces sur mesure et coulisses de MecaPrint3D.</p></div><SocialLinks links={links} /></div>
    <div className="my-8 flex flex-wrap gap-3" role="group" aria-label="Filtrer les publications">{[['all', 'Tout'], ['actualite', 'Actualités'], ['realisation', 'Réalisations']].map(([value, label]) => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-full border px-5 py-2 text-sm font-semibold ${filter === value ? 'border-orange-500 bg-orange-500 text-black' : 'border-[#d9dad1] text-[#65695f]'}`}>{label}</button>)}</div>
    {error && <p role="status" className="mb-6 text-[#65695f]">{error}</p>}
    {!loading && !error && !visible.length && <p className="text-[#65695f]">Les prochaines nouvelles de l’atelier seront présentées ici.</p>}
    <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">{visible.map(post => <PublicationCard key={post._id} post={post} />)}</div>
    {loading && <p role="status" className="mt-6 text-[#65695f]">Chargement des publications…</p>}
    {!loading && (hasMore || (error && page === 0)) && <button onClick={more} className="mt-8 rounded-full border border-[#d9dad1] px-6 py-3">{page === 0 ? 'Réessayer' : 'Charger les publications suivantes'}</button>}
  </div></section>;
}
