import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, RefreshCw, Send, LogOut, MessageCircle, Download } from 'lucide-react';
import { API_URL } from '../lib/api';
import './MobileChat.css';
const key = 'mecaprint3d_admin_token';
const savedToken = () => { try { return localStorage.getItem(key) || ''; } catch { return ''; } };
export default function MobileChat() {
  const [token, setToken] = useState(savedToken);
  const [password, setPassword] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [refreshed, setRefreshed] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installHelp, setInstallHelp] = useState(false);
  const [standalone, setStandalone] = useState(() => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true);
  const busy = useRef(false);
  const sendingRef = useRef(false);
  const revision = useRef(0);
  const selected = conversations.find(c => c._id === selectedId);
  const unread = c => (c.messages || []).filter(m => m.from === 'client' && !m.readByAdmin).length;
  const unreadTotal = conversations.reduce((sum,c)=>sum+unread(c),0);
  const end = useRef(null);
  const lastMessage = selected?.messages?.at(-1)?._id || selected?.messages?.length;
  useEffect(() => { const previous = document.title; document.title = unreadTotal ? `(${unreadTotal}) Messages · MecaPrint3D` : 'Messages · MecaPrint3D'; return () => { document.title=previous; }; }, [unreadTotal]);
  useEffect(() => {
    const manifest=document.createElement('link'); manifest.rel='manifest';manifest.href='/chat.webmanifest';document.head.appendChild(manifest);
    const theme=document.createElement('meta');theme.name='theme-color';theme.content='#252b25';document.head.appendChild(theme);
    const apple=document.createElement('link');apple.rel='apple-touch-icon';apple.href='/chat-icon-192.png';document.head.appendChild(apple);
    function prompt(e){e.preventDefault();setInstallPrompt(e);}function installed(){setStandalone(true);setInstallPrompt(null);setInstallHelp(false);}
    window.addEventListener('beforeinstallprompt',prompt);window.addEventListener('appinstalled',installed);
    return()=>{manifest.remove();theme.remove();apple.remove();window.removeEventListener('beforeinstallprompt',prompt);window.removeEventListener('appinstalled',installed);};
  },[]);
  const request = useCallback(async(path,options={})=>{
    const response=await fetch(`${API_URL}${path}`,{...options,headers:{Authorization:`Bearer ${token}`,...options.headers},signal:AbortSignal.timeout(15000)});
    const data=await response.json().catch(()=>({}));
    if(response.status===401){try{localStorage.removeItem(key);}catch{}setToken('');setConversations([]);throw new Error('Connecte-toi pour accéder aux messages.');}
    if(!response.ok || !data.success)throw new Error(data.error || 'Connexion impossible. Réessaie dans un instant.');
    return data;
  },[token]);
  const load = useCallback(async(manual=false)=>{
    if(!token || busy.current || sendingRef.current || (!manual && document.hidden))return;
    busy.current=true;const stamp=revision.current;if(manual)setLoading(true);
    try{const data=await request('/api/chat/admin');if(stamp===revision.current && !sendingRef.current){setConversations(data.conversations || []);setRefreshed(new Date());setError('');}}
    catch(e){setError(e.message);}finally{busy.current=false;setLoading(false);}
  },[request,token]);
  useEffect(()=>{if(!token)return;load(true);const timer=setInterval(()=>load(),5000);const visible=()=>load();document.addEventListener('visibilitychange',visible);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',visible);};},[load,token]);
  useEffect(()=>{end.current?.scrollIntoView({block:'nearest'});},[selectedId,lastMessage]);
  async function login(e){e.preventDefault();setLoginBusy(true);setError('');try{const res=await fetch(`${API_URL}/api/site-content/admin/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password}),signal:AbortSignal.timeout(15000)});const data=await res.json();if(!res.ok || !data.success || !data.token)throw new Error(data.error || 'Connexion refusée.');try{localStorage.setItem(key,data.token);}catch{}setPassword('');setToken(data.token);}catch(e){setError(e.message);}finally{setLoginBusy(false);}}
  async function choose(c){setSelectedId(c._id);setError('');if(unread(c)){try{const data=await request(`/api/chat/admin/${c._id}/read`,{method:'PUT'});setConversations(list=>list.map(item=>item._id===c._id ? data.conversation : item));}catch(e){setError(e.message);}}}
  async function send(e){e.preventDefault();const text=drafts[selectedId]?.trim();if(!text || !selected || sendingRef.current)return;const id=selectedId;sendingRef.current=true;revision.current++;setSending(true);setError('');try{const form=new FormData();form.append('message',text);const data=await request(`/api/chat/admin/${id}/reply`,{method:'POST',body:form});setConversations(list=>list.map(c=>c._id===id ? data.conversation : c));setDrafts(d=>({...d,[id]:''}));setRefreshed(new Date());}catch(e){setError(e.message);}finally{sendingRef.current=false;revision.current++;setSending(false);}}
  async function install(){if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;setInstallPrompt(null);}else setInstallHelp(v=>!v);}
  function logout(){try{localStorage.removeItem(key);}catch{}setToken('');setConversations([]);setDrafts({});setSelectedId(null);}
  return <div className="mobile-chat-app">
    <header className="mc-top"><a href="/admin/chat/mobile" className="mc-brand"><MessageCircle size={25}/><span>MecaPrint3D<small>Messages clients</small></span></a><div>{token && <><button onClick={()=>load(true)} aria-label="Actualiser les messages" disabled={loading}><RefreshCw size={20}/></button><button onClick={logout} aria-label="Déconnexion"><LogOut size={19}/></button></>}{!standalone && <button onClick={install} className="mc-install" aria-expanded={installHelp}><Download size={18}/><span>Raccourci</span></button>}</div></header>
    {installHelp && <aside className="mc-install-help"><strong>Une icône sur ton téléphone</strong><p><b>Android :</b> ouvre cette page dans Chrome, puis menu ⋮ → « Ajouter à l’écran d’accueil » ou « Installer l’application ».</p><p><b>iPhone :</b> ouvre cette page dans Safari, puis Partager → « Sur l’écran d’accueil ».</p><p>Le raccourci ouvre directement les messages. Une connexion Internet est nécessaire.</p><button onClick={()=>setInstallHelp(false)}>Fermer</button></aside>}
    {!token ? <main className="mc-login"><MessageCircle size={40}/><h1>Tes messages, à portée de main.</h1><p>Connecte-toi avec le mot de passe habituel de l’administration MecaPrint3D.</p><form onSubmit={login}><label>Mot de passe administrateur<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required /></label><button className="mc-primary" disabled={loginBusy}>{loginBusy ? 'Connexion…' : 'Ouvrir mes conversations'}</button></form>{error && <p className="mc-error" role="alert">{error}</p>}<a href="/admin">Administration complète ↗</a></main> : <main className={`mc-workspace ${selected ? 'mc-has-selection' : ''}`}>
      <section className="mc-list" aria-label="Conversations clients"><div className="mc-list-heading"><h1>Conversations <span>{unreadTotal ? `${unreadTotal} non lu${unreadTotal>1 ? 's' : ''}` : conversations.length}</span></h1><p>{loading ? 'Actualisation…' : refreshed ? `Actualisé à ${refreshed.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}` : 'Chargement…'}</p></div>
        {error && !selected && <p className="mc-error" role="alert">{error}</p>}
        {!loading && !conversations.length && <p className="mc-empty">Aucune conversation pour le moment. Les nouveaux messages apparaîtront ici.</p>}
        {conversations.map(c=>{const last=c.messages?.at(-1);return <button className={`mc-conversation ${selectedId===c._id ? 'is-selected' : ''}`} key={c._id} onClick={()=>choose(c)} aria-pressed={selectedId===c._id}><div className="mc-avatar">{(c.visitorName || 'V').slice(0,1).toUpperCase()}</div><div className="mc-preview"><strong>{c.visitorName || 'Visiteur'}</strong><p>{last?.from==='admin' ? 'Toi : ' : ''}{last?.text || 'Nouvelle discussion'}</p></div><div className="mc-last"><time>{last?.createdAt ? new Date(last.createdAt).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'}) : ''}</time>{unread(c)>0 && <span>{unread(c)}</span>}</div></button>;})}
        <a className="mc-admin-link" href="/admin">Administration complète ↗</a>
      </section>
      <section className="mc-thread" aria-label="Échange avec le client">{!selected ? <div className="mc-empty-thread"><MessageCircle size={42}/><p>Sélectionne une conversation pour répondre.</p></div> : <><header className="mc-thread-heading"><button className="mc-back" onClick={()=>setSelectedId(null)} aria-label="Retour aux conversations"><ArrowLeft size={22}/></button><div><h2>{selected.visitorName || 'Visiteur'}</h2><p>{selected.visitorEmail || 'Conversation sur le site'}</p></div></header><div className="mc-history" role="log" aria-live="polite" aria-label="Messages">{(selected.messages || []).map((m,i)=><div key={m._id || i} className={`mc-bubble ${m.from==='admin' ? 'mc-outgoing' : ''}`}><small>{m.from==='admin' ? 'Toi · MecaPrint3D' : selected.visitorName || 'Visiteur'}</small><p>{m.text}</p>{m.files?.length>0 && <small>Pièce jointe : {m.files.map(f=>f.originalName || 'Fichier').join(', ')} — ouvrir dans l’administration complète.</small>}<time>{m.createdAt ? new Date(m.createdAt).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) : ''}</time></div>)}<div ref={end}/></div>{error && <p className="mc-error" role="alert">{error}</p>}<form className="mc-reply" onSubmit={send}><label htmlFor="mobile-reply" className="mc-sr-only">Réponse au client</label><textarea id="mobile-reply" value={drafts[selectedId] || ''} onChange={e=>setDrafts(d=>({...d,[selectedId]:e.target.value}))} maxLength={5000} rows={2} placeholder="Ta réponse…" disabled={sending}/><button className="mc-primary" type="submit" disabled={sending || !drafts[selectedId]?.trim()} aria-label="Envoyer la réponse">{sending ? '…' : <Send size={21}/>}</button></form></> }</section>
    </main>}
  </div>;
}
