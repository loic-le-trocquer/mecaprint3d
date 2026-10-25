import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Phone } from 'lucide-react';
import QuoteAssistant from './FloatingChat';
import { API_URL } from '../lib/api';
import { projectReply, welcome } from '../lib/projectAssistant.mjs';
import './ContactWidget.css';
const whatsapp = 'https://wa.me/33627497055';
const sessionKey = 'mecaprint3d_chat_session_v2';
function readSession() {
  try { const s = JSON.parse(localStorage.getItem(sessionKey)); return /^[a-f0-9]{24}$/i.test(s?.id) && /^[a-f0-9]{64}$/.test(s?.token) ? s : null; } catch { return null; }
}
async function chatRequest(path, options = {}) {
  const response = await fetch(`${API_URL}/api/chat${path}`, { ...options, signal: options.signal || AbortSignal.timeout(15000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) { const error = new Error(data.error || 'La messagerie est momentanément indisponible. Votre texte est conservé.'); error.status = response.status; throw error; }
  return data;
}
function HumanChat({ active }) {
  const [session, setSession] = useState(readSession);
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const sendingRef = useRef(false);
  const revision = useRef(0);
  const end = useRef(null);
  useEffect(() => {
    if (!session || !active) return;
    const controller = new AbortController();
    let busy = false;
    async function refresh() {
      if (busy || sendingRef.current || document.hidden) return;
      busy = true;
      const currentRevision = revision.current;
      try {
        const data = await chatRequest(`/${session.id}`, { headers: { Authorization: `Bearer ${session.token}` }, signal: controller.signal });
        if (!controller.signal.aborted && !sendingRef.current && currentRevision === revision.current) { setMessages(data.conversation.messages || []); setNotice(''); }
      } catch (err) {
        if (!controller.signal.aborted) {
          if ([403, 404].includes(err.status)) { setError('Cette conversation ne peut plus être récupérée. Démarrez une nouvelle discussion ci-dessous.'); setNotice('session-expired'); }
          else setNotice('Reconnexion en cours… Les messages déjà envoyés sont conservés.');
        }
      } finally { busy = false; }
    }
    refresh();
    const timer = setInterval(refresh, 5000);
    document.addEventListener('visibilitychange', refresh);
    return () => { controller.abort(); clearInterval(timer); document.removeEventListener('visibilitychange', refresh); };
  }, [session, active]);
  useEffect(() => { if (active) end.current?.scrollIntoView({ block: 'nearest' }); }, [messages, active]);
  async function send(event) {
    event.preventDefault();
    if (!draft.trim() || sendingRef.current) return;
    sendingRef.current = true; revision.current++; setSending(true); setError('');
    try {
      if (!session) {
        const capabilities = await chatRequest('/capabilities');
        if (!capabilities.visitorSession) throw new Error('La messagerie est en cours de mise à jour. Réessayez dans quelques instants.');
      }
      const form = new FormData(); form.append('message', draft.trim());
      if (session) form.append('conversationId', session.id);
      else { form.append('name', name.trim()); form.append('email', email.trim()); }
      const data = await chatRequest('', { method: 'POST', body: form, headers: session ? { Authorization: `Bearer ${session.token}` } : {} });
      if (!session) {
        if (!data.visitorToken) throw new Error('La nouvelle messagerie est en cours de mise à jour. Réessayez dans quelques instants.');
        const next = { id: data.conversationId, token: data.visitorToken };
        setSession(next); try { localStorage.setItem(sessionKey, JSON.stringify(next)); } catch { setNotice('Gardez cet onglet ouvert pour conserver la discussion.'); }
      }
      setMessages(data.conversation.messages || []); setDraft('');
    } catch (err) { setError(err.message || 'Envoi impossible. Votre message est conservé.'); }
    finally { sendingRef.current = false; setSending(false); revision.current++; }
  }
  return <div className="cw-human">
    <p className="cw-info">Écrivez à l’équipe MecaPrint3D. Nous vous répondons ici dès que nous sommes disponibles. Il ne s’agit pas d’une réponse automatique.</p>
    <div className="cw-messages" role="log" aria-label="Conversation avec l’équipe" aria-live="polite">
      {!messages.length && <p className="cw-empty">Bonjour ! Quel projet souhaitez-vous nous confier ?</p>}
      {messages.map((m, i) => <div key={m._id || i} className={`cw-message ${m.from === 'client' ? 'cw-client' : 'cw-team'}`}><small>{m.from === 'client' ? 'Vous' : 'MecaPrint3D'}</small><p>{m.text}</p>{m.files?.length > 0 && <p>Pièce jointe : {m.files.map(f => f.originalName).join(', ')}. L’équipe peut vous la transmettre par e-mail.</p>}<time>{m.createdAt ? new Date(m.createdAt).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}) : ''}</time></div>)}
      <div ref={end} />
    </div>
    {notice && notice !== 'session-expired' && <p className="cw-info" role="status">{notice}</p>}
    {error && <p className="cw-error" role="alert">{error}</p>}
    {notice === 'session-expired' ? <button className="cw-primary" onClick={() => { setSession(null); setMessages([]); setError(''); setNotice(''); try { localStorage.removeItem(sessionKey); } catch {} }}>Nouvelle discussion</button> : <form className="cw-compose" onSubmit={send}>
      {!session && <div className="cw-details"><label>Votre prénom<input value={name} onChange={e=>setName(e.target.value)} required maxLength={120} autoComplete="given-name" /></label><label>E-mail (facultatif)<input type="email" value={email} onChange={e=>setEmail(e.target.value)} maxLength={254} autoComplete="email" /></label></div>}
      <label>Votre message<textarea value={draft} onChange={e=>setDraft(e.target.value)} required maxLength={5000} rows={3} placeholder="Décrivez votre besoin…" /></label>
      <button className="cw-primary" disabled={sending || !draft.trim()} type="submit">{sending ? 'Envoi…' : 'Envoyer à l’équipe'} <Send size={16} /></button>
      <p className="cw-privacy">Les informations saisies servent au suivi de votre demande. Conservez ce navigateur pour retrouver la discussion.</p>
    </form>}
  </div>;
}
export default function ContactWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('assistant');
  const [guide, setGuide] = useState(false);
  const [messages, setMessages] = useState([{ text: welcome, from: 'assistant' }]);
  const [draft, setDraft] = useState('');
  const launcher = useRef(null);
  const dialog = useRef(null);
  const end = useRef(null);
  useEffect(() => { if (!open) return; dialog.current?.querySelector('button')?.focus(); function key(e) { if (e.key === 'Escape') { setOpen(false); launcher.current?.focus(); } } document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key); }, [open]);
  useEffect(() => { if (open && tab === 'assistant') end.current?.scrollIntoView({ block: 'nearest' }); }, [messages, open, tab]);
  function ask(text) { if (!text.trim()) return; const answer = projectReply(text); setMessages(m => [...m, { text, from: 'client' }, { ...answer, from: 'assistant' }]); setDraft(''); }
  return <div className="contact-widget">
    <a className="cw-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Contacter MecaPrint3D sur WhatsApp" title="WhatsApp"><Phone size={21} /></a>
    <button ref={launcher} className="cw-launcher" aria-label={open ? 'Fermer la fenêtre de discussion' : 'Ouvrir la fenêtre de discussion'} aria-expanded={open} aria-controls="mecaprint-conversation" onClick={()=>setOpen(!open)}>{open ? <X size={27}/> : <MessageCircle size={27}/>}</button>
    {open && <section id="mecaprint-conversation" ref={dialog} className="cw-panel" role="dialog" aria-modal="false" aria-label="Discussion MecaPrint3D">
      <header className="cw-header"><div><strong>MecaPrint3D</strong><p>Un projet ? Parlons-en.</p></div><button aria-label="Fermer la discussion" onClick={()=>{setOpen(false);launcher.current?.focus();}}><X size={21}/></button></header>
      <div className="cw-tabs" role="tablist" aria-label="Choisir un interlocuteur"><button role="tab" id="cw-assistant-tab" aria-controls="cw-assistant-panel" aria-selected={tab==='assistant'} onClick={()=>setTab('assistant')}>Assistant automatique</button><button role="tab" id="cw-team-tab" aria-controls="cw-team-panel" aria-selected={tab==='human'} onClick={()=>setTab('human')}>L’équipe</button></div>
      <div id="cw-assistant-panel" className="cw-body" role="tabpanel" aria-labelledby="cw-assistant-tab" hidden={tab!=='assistant'}>
        {guide ? <QuoteAssistant embedded onClose={()=>setGuide(false)} /> : <><div className="cw-messages" role="log" aria-label="Discussion avec l’assistant automatique" aria-live="polite">{messages.map((m,i)=><div className={`cw-message ${m.from==='client' ? 'cw-client' : 'cw-team'}`} key={i}><small>{m.from==='client' ? 'Vous' : 'Assistant automatique'}</small><p>{m.text}</p>{m.action && <button className="cw-action" onClick={()=>m.action==='human' ? setTab('human') : setGuide(true)}>{m.action==='human' ? 'Écrire à l’équipe →' : 'Préparer mon devis →'}</button>}</div>)}<div ref={end}/></div><div className="cw-suggestions">{['Quel prix pour ma pièce ?', 'Ma pièce est cassée', 'Quels fichiers envoyer ?'].map(q=><button key={q} onClick={()=>ask(q)}>{q}</button>)}</div><button className="cw-primary cw-quote" onClick={()=>setGuide(true)}>Préparer une demande de devis →</button><form className="cw-compose" onSubmit={e=>{e.preventDefault();ask(draft);}}><label>Question à l’assistant<div className="cw-input-row"><input value={draft} onChange={e=>setDraft(e.target.value)} maxLength={1000} placeholder="Posez votre question…" required/><button type="submit" aria-label="Envoyer à l’assistant" disabled={!draft.trim()}><Send size={18}/></button></div></label><p className="cw-privacy">Réponses automatiques aux questions courantes. Prix, faisabilité et délais confirmés par l’atelier.</p></form></>}
      </div>
      <div id="cw-team-panel" className="cw-body" role="tabpanel" aria-labelledby="cw-team-tab" hidden={tab!=='human'}><HumanChat active={open && tab==='human'} /></div>
      <footer className="cw-footer">Vous préférez WhatsApp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer">Nous écrire ↗</a></footer>
    </section>}
  </div>;
}
