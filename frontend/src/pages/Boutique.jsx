import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search, ShoppingBag, ArrowUpRight, Plus, Minus, X, Package, Check, SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header';
import { API_URL } from '../lib/api';
import './Boutique.css';

const euro = cents => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100);
const weight = grams => grams >= 1000 ? `${grams / 1000} kg` : `${grams} g`;
const format = product => ['Filament', 'Resin'].includes(product.type) ? weight(product.weight) : 'Unité fournisseur';
const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const typeNames = { Filament: 'Filaments', Resin: 'Résines', 'Resin Cleaner': 'Nettoyants résine', Adhesive: 'Adhésifs', 'ReFill System': 'Bobines réutilisables', 'FEP Sheet': 'Films FEP', Tape: 'Rubans' };
function family(product) {
  if (product.type !== 'Filament') return typeNames[product.type] || product.type;
  const name = product.name.toUpperCase();
  if (/PLA|GALAXY|STONEFIL|EASYWOOD|BIOFIL - WOOD/.test(name)) return 'PLA & composites';
  if (/APOLLO|ASA/.test(name)) return 'ASA';
  if (/TITAN|ABS/.test(name)) return 'ABS';
  if (/TPU|FLEX/.test(name)) return 'Flexibles';
  if (/PA6|PAHT/.test(name)) return 'Nylons';
  if (/PET|HDGLASS|CARBONFIL|ATHENA/.test(name)) return 'PET & PETG';
  if (/SUPPORT|PVA|BVOH/.test(name)) return 'Supports';
  return 'Autres techniques';
}
function Spool({ type }) {
  const patternId = useId();
  return <div className="shop-product-art" aria-hidden="true">{type === 'Filament' ? <svg viewBox="0 0 240 155"><defs><pattern id={patternId} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0V4" stroke="currentColor" strokeWidth="2" opacity=".32" /></pattern></defs><ellipse cx="94" cy="79" rx="51" ry="58" fill="#31382f"/><path d="M94 21H155V137H94Z" fill="currentColor"/><path d="M94 21H155V137H94Z" fill={`url(#{patternId})`}/><ellipse cx="155" cy="79" rx="51" ry="58" fill="#41483e"/><ellipse cx="155" cy="79" rx="42" ry="48" fill="#535d4e"/><ellipse cx="155" cy="79" rx="20" ry="25" fill="#f0efe8"/><ellipse cx="155" cy="79" rx="13" ry="17" fill="#282e25"/><path d="M122 50L137 39M179 50L171 39M122 108L137 119M179 108L171 119" stroke="#858e7f" strokeWidth="5"/></svg> : <Package size={70} strokeWidth={.8}/>}<span>FORMFUTURA</span></div>;
}
function ProductCard({ variants, onAdd }) {
  const [sku, setSku] = useState(variants[0].sku);
  const product = variants.find(item => item.sku === sku) || variants[0];
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const selectId = `variant-${variants[0].sku}`;
  return <article className="shop-card">
    <Spool type={product.type}/>
    <div className="shop-card-body"><div className="shop-card-meta"><span>{family(product)}</span><span>{variants.length} variante{variants.length > 1 ? 's' : ''}</span></div>
    <h2>{product.name}</h2><p className="shop-brand">{product.brand}</p>
    <label htmlFor={selectId}>Couleur · format · diamètre</label>
    <select id={selectId} value={product.sku} onChange={event => { setSku(event.target.value); setAdded(false); }}>{variants.map(item => <option key={item.sku} value={item.sku}>{item.color} · {format(item)}{item.diameter !== '0' ? ` · ${item.diameter.replace('.', ',')} mm` : ''}</option>)}</select>
    <p className="shop-sku">Réf. {product.sku}</p>
    <div className="shop-price"><strong>{euro(product.priceCents)}</strong><span>prix net / unité</span></div>
    <div className="shop-card-actions"><label className="shop-quantity-label">Quantité<input aria-label={`Quantité ${product.name}`} type="number" min="1" max="999" step="1" value={quantity} onChange={event => { setQuantity(event.target.value); setAdded(false); }}/></label><button disabled={!Number.isInteger(Number(quantity)) || Number(quantity) < 1 || Number(quantity) > 999} onClick={() => { onAdd(product, Number(quantity)); setAdded(true); }} className="shop-add">{added ? <Check size={17}/> : <Plus size={17}/>} {added ? 'Ajouté' : 'Ajouter'}</button></div>
    </div>
  </article>;
}
function readCart() {
  try { const stored = JSON.parse(localStorage.getItem('meca-shop-cart') || '[]'); return Array.isArray(stored) ? stored.filter(item => typeof item.sku === 'string' && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 999).slice(0, 100) : []; } catch { return []; }
}
export default function Boutique({ content }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tous');
  const [diameter, setDiameter] = useState('Tous');
  const [color, setColor] = useState('Tous');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState(readCart);
  const [notice, setNotice] = useState('');
  const [delivery, setDelivery] = useState('delivery');
  const [sending, setSending] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const dialog = useRef(null);
  const requestId = useRef(null);
  useEffect(() => { document.title = 'Boutique FormFutura — MecaPrint3D'; const controller = new AbortController(); fetch(`${API_URL}/api/catalog`, { signal: controller.signal }).then(async response => { if (!response.ok) throw new Error(); return response.json(); }).then(data => { if (!Array.isArray(data.products)) throw new Error(); setProducts(data.products); setLoading(false); }).catch(err => { if (err.name !== 'AbortError') { setError('Le catalogue est momentanément indisponible. Réessayez dans un instant.'); setLoading(false); } }); return () => controller.abort(); }, []);
  useEffect(() => { try { localStorage.setItem('meca-shop-cart', JSON.stringify(cart)); } catch { /* Browsing remains available when storage is disabled. */ } requestId.current = null; }, [cart]);
  const cartItems = cart.map(line => { const product = products.find(item => item.sku === line.sku); return product ? { ...product, quantity: line.quantity } : null; }).filter(Boolean);
  const unavailable = !loading && !error && cartItems.length !== cart.length;
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.priceCents, 0);
  const categories = ['Tous', ...new Set(products.map(family))];
  const colors = [...new Set(products.map(item => item.color))].sort((a, b) => a.localeCompare(b, 'fr'));
  const groups = useMemo(() => {
    const selected = products.filter(item => (category === 'Tous' || family(item) === category) && (diameter === 'Tous' || item.diameter === diameter) && (color === 'Tous' || item.color === color) && normalize(`${item.name} ${item.color} ${item.sku} ${item.brand} ${item.type}`).includes(normalize(query.trim())));
    const grouped = new Map(); selected.forEach(item => { if (!grouped.has(item.name)) grouped.set(item.name, []); grouped.get(item.name).push(item); });
    return [...grouped.values()].sort((a, b) => sort === 'name' ? a[0].name.localeCompare(b[0].name, 'fr') : (Math.min(...a.map(item => item.priceCents)) - Math.min(...b.map(item => item.priceCents))) * (sort === 'asc' ? 1 : -1));
  }, [products, category, diameter, color, query, sort]);
  const pages = Math.max(1, Math.ceil(groups.length / 12));
  function filter(setter, value) { setter(value); setPage(1); }
  function add(product, quantity) {
    if (!cart.some(item => item.sku === product.sku) && cart.length >= 100) { setNotice('Le panier est limité à 100 références.'); return; }
    setCart(previous => { const found = previous.find(item => item.sku === product.sku); return found ? previous.map(item => item.sku === product.sku ? { ...item, quantity: Math.min(999, item.quantity + quantity) } : item) : [...previous, { sku: product.sku, quantity }]; });
    setConfirmation(null); setNotice(`${product.name} ajouté au panier.`);
  }
  function changeQuantity(sku, quantity) { setCart(previous => previous.map(item => item.sku === sku ? { ...item, quantity: Math.max(1, Math.min(999, quantity)) } : item)); }
  async function submit(event) {
    event.preventDefault(); setSubmitError(''); setSending(true);
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    if (!requestId.current) requestId.current = crypto.randomUUID();
    try {
      const response = await fetch(`${API_URL}/api/catalog/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...fields, consent: fields.consent === 'on', requestId: requestId.current, delivery, items: cartItems.map(item => ({ sku: item.sku, quantity: item.quantity })) }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Enregistrement impossible.');
      setConfirmation(result); setCart([]);
    } catch (err) { setSubmitError(err.message || 'Connexion impossible. Votre panier est conservé.'); } finally { setSending(false); }
  }
  return <div className="atelier-site shop-page"><Header content={content}/><main>
    <div className="shop-breadcrumb"><a href="/">Accueil</a><span>/</span><span>Boutique</span></div>
    <section className="shop-hero"><div><p className="shop-eyebrow">MECAPRINT3D / MATIÈRES & CONSOMMABLES</p><h1>La bonne matière.<br/><em>Pour chaque idée.</em></h1><p>Filaments, résines et accessoires FormFutura.<br/>Composez votre panier, nous préparons votre commande.</p><a href="#catalogue" className="shop-discover">Explorer le catalogue <ArrowUpRight size={18}/></a></div><div className="shop-hero-art"><Spool type="Filament"/><span>FORMFUTURA<br/><small>LE CATALOGUE 2026</small></span></div></section>
    <div className="shop-trust"><span><Package size={17}/> {products.length || '…'} références au catalogue</span><span>Disponibilité confirmée avant commande</span><span>Livraison ou retrait à l’atelier</span></div>
    <section id="catalogue" className="shop-catalog"><div className="shop-section-title"><div><p className="shop-eyebrow">LE CHOIX DE LA MATIÈRE</p><h2>Le catalogue FormFutura</h2></div><button className="shop-cart-button" onClick={() => dialog.current.showModal()}><ShoppingBag size={18}/> Mon panier <span>{count}</span></button></div>
    <div className="shop-filters"><label className="shop-search"><Search size={18}/><input aria-label="Rechercher dans le catalogue" placeholder="Une matière, une couleur, une référence…" value={query} onChange={event => filter(setQuery, event.target.value)}/></label><label><span>Matière / catégorie</span><select value={category} onChange={event => filter(setCategory, event.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select></label><label><span>Diamètre</span><select value={diameter} onChange={event => filter(setDiameter, event.target.value)}><option>Tous</option><option value="1.75">1,75 mm</option><option value="2.85">2,85 mm</option><option value="0">Sans diamètre</option></select></label><label><span>Couleur</span><select value={color} onChange={event => filter(setColor, event.target.value)}><option>Tous</option>{colors.map(item => <option key={item}>{item}</option>)}</select></label></div>
    <div className="shop-results"><span><SlidersHorizontal size={15}/> {groups.length} gammes · {groups.reduce((sum, group) => sum + group.length, 0)} variantes</span><label>Trier <select aria-label="Trier le catalogue" value={sort} onChange={event => filter(setSort, event.target.value)}><option value="name">Nom A → Z</option><option value="asc">Prix croissant</option><option value="desc">Prix décroissant</option></select></label></div>
    <p className="shop-announcement" role="status" aria-live="polite">{notice}</p>
    {loading && <p role="status">Chargement du catalogue…</p>}{error && <p role="alert">{error} <button onClick={() => window.location.reload()}>Réessayer</button></p>}
    {!loading && !error && !groups.length && <div className="shop-empty"><Search size={30}/><h3>Aucun produit ne correspond.</h3><button onClick={() => { setQuery(''); setCategory('Tous'); setDiameter('Tous'); setColor('Tous'); setPage(1); }}>Effacer les filtres</button></div>}
    <div className="shop-grid">{groups.slice((page - 1) * 12, page * 12).map(group => <ProductCard key={`${group[0].name}-${group[0].sku}`} variants={group} onAdd={add}/>)}</div>
    {pages > 1 && <nav className="shop-pagination" aria-label="Pages du catalogue"><button disabled={page === 1} onClick={() => setPage(page - 1)}>← Précédent</button><span>Page {page} / {pages}</span><button disabled={page === pages} onClick={() => { setPage(page + 1); document.getElementById('catalogue').scrollIntoView(); }}>Suivant →</button></nav>}
    <p className="shop-price-note">Prix nets en euros, hors livraison. TVA non applicable, art. 293 B du CGI. Produits sur demande : disponibilité, délai et frais de port confirmés par Mecaprint3D avant validation. Visuels illustratifs.</p></section>
    <section className="shop-help"><div><p className="shop-eyebrow">UN PROJET PARTICULIER ?</p><h2>On vous aide à choisir.</h2><p>Une pièce technique, une série ou une matière spécifique ? Parlons de votre besoin.</p></div><a href="/#devis">Contacter l’atelier <ArrowUpRight size={20}/></a></section>
    </main><footer className="shop-footer"><a href="/">MecaPrint3D</a><a href="mailto:contact@mecaprint3d.fr">contact@mecaprint3d.fr</a><span>Goupillières · Normandie</span></footer>
    <dialog ref={dialog} className="shop-dialog"><div className="shop-dialog-head"><h2>Votre panier</h2><button aria-label="Fermer le panier" onClick={() => dialog.current.close()}><X/></button></div>
    {confirmation ? <div className="shop-confirmation" role="status"><Check size={40}/><h3>Demande enregistrée</h3><p>Votre référence : <strong>{confirmation.reference}</strong></p><p>Sous-total produits : {euro(confirmation.totalCents)}</p><p>L’atelier vous recontactera pour confirmer la disponibilité, les frais de livraison et les modalités de paiement. Aucun paiement n’a été effectué.</p><button onClick={() => { dialog.current.close(); setConfirmation(null); }}>Continuer la visite</button></div> : <>
    {!cartItems.length && <p className="shop-empty">Votre panier attend vos premières matières.</p>}
    {unavailable && <p role="alert">Certaines références de votre ancien panier ne sont plus proposées. <button onClick={() => setCart(cartItems.map(item => ({ sku: item.sku, quantity: item.quantity })))}>Actualiser le panier</button></p>}
    {cartItems.map(item => <div className="shop-cart-line" key={item.sku}><div><strong>{item.name}</strong><p>{item.color} · {format(item)}{item.diameter !== '0' ? ` · ${item.diameter} mm` : ''}</p><small>{item.sku}</small><div className="shop-stepper"><button aria-label={`Diminuer ${item.name}`} disabled={sending || item.quantity <= 1} onClick={() => changeQuantity(item.sku, item.quantity - 1)}><Minus size={14}/></button><span>{item.quantity}</span><button aria-label={`Augmenter ${item.name}`} disabled={sending || item.quantity >= 999} onClick={() => changeQuantity(item.sku, item.quantity + 1)}><Plus size={14}/></button></div></div><div><strong>{euro(item.priceCents * item.quantity)}</strong><button className="shop-remove" disabled={sending} onClick={() => setCart(cart.filter(line => line.sku !== item.sku))}>Retirer</button></div></div>)}
    {!!cartItems.length && <><div className="shop-total"><span>Sous-total produits</span><strong>{euro(total)}</strong></div><p className="shop-price-note">Prix nets · TVA non applicable (art. 293 B). Livraison et disponibilité à confirmer. Aucun paiement à cette étape.</p>
    <form className="shop-order-form" onSubmit={submit}><h3>Vos coordonnées</h3><fieldset disabled={sending}><label>Nom et prénom *<input name="name" autoComplete="name" required maxLength="120"/></label><label>E-mail *<input name="email" type="email" autoComplete="email" required maxLength="200"/></label><label>Téléphone<input name="phone" type="tel" autoComplete="tel" maxLength="40"/></label><label>Entreprise<input name="company" autoComplete="organization" maxLength="160"/></label><label>Réception<select value={delivery} onChange={event => setDelivery(event.target.value)}><option value="delivery">Livraison — frais à confirmer</option><option value="pickup">Retrait à l’atelier — Goupillières</option></select></label>{delivery === 'delivery' && <label>Adresse, code postal, ville et pays *<textarea name="address" autoComplete="street-address" required maxLength="1000" rows="3"/></label>}<label>Précisions<textarea name="comment" rows="3" maxLength="2000"/></label><label className="shop-consent"><input type="checkbox" name="consent" required/><span>J’accepte que Mecaprint3D utilise mes coordonnées pour traiter et suivre cette demande. Je peux contacter contact@mecaprint3d.fr pour toute question sur mes données.</span></label><button className="shop-send" type="submit" disabled={sending || unavailable}>{sending ? 'Enregistrement…' : 'Envoyer ma demande de commande'} <ArrowUpRight size={18}/></button></fieldset><p className="shop-price-note">La commande sera finalisée après confirmation de l’atelier et votre accord sur le montant total.</p>{submitError && <p role="alert">{submitError}</p>}</form></>}
    </>}
    </dialog>
  </div>;
}
