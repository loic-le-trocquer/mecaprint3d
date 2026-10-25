import { useState } from "react";
const links = [["#univers", "Nos univers"], ["#technologies", "Tech"], ["#showroom", "Design"], ["#corten", "Home & Outdoor"], ["#realisations", "Réalisations"], ["#actualites", "Actualités"], ["#contact", "Contact"]];
export default function Header({ content }) {
 const [open, setOpen] = useState(false);
 const brand = content?.brand || {};
 return <header className="atelier-header"><a href="#" className="atelier-brand" onClick={() => setOpen(false)}>{brand.logoUrl ? <img src={brand.logoUrl} alt={brand.name || "MecaPrint3D"} /> : <><span>MecaPrint<b>3D.</b></span><small>ATELIER DE FABRICATION & DESIGN</small></>}</a>
 <button type="button" className="atelier-menu" aria-expanded={open} aria-controls="atelier-navigation" onClick={() => setOpen(!open)}>{open ? "Fermer ×" : "Menu +"}</button>
 <nav id="atelier-navigation" aria-label="Navigation principale" className={open ? "is-open" : ""}>{links.map(([href,label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}<a href="#devis" className="atelier-button" onClick={() => setOpen(false)}>Demander un devis ↗</a></nav></header>;
}
