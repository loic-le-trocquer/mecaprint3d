export default function Hero({ content = {} }) {
  const hero = content.hero || {};
  return <><section className="atelier-hero" aria-labelledby="atelier-title">
    <div className="atelier-intro">
      <p className="atelier-eyebrow"><span />{hero.badge || "De l’idée à l’objet · Normandie"}</p>
      <h1 id="atelier-title">{hero.title || "Vos idées. Notre atelier."}<br /><em>{hero.highlight || "Du concret."}</em></h1>
      <p className="atelier-description">{hero.description || "Une pièce à créer, un objet à personnaliser, une idée à faire vivre. Donnons forme à votre projet."}</p>
      <div className="atelier-actions"><a className="atelier-button" href="#devis">{hero.primaryButton || "Créer mon projet"}<span aria-hidden="true">↗</span></a><a className="atelier-textlink" href="#univers">{hero.secondaryButton || "Explorer les savoir-faire"} ↓</a></div>
      <p className="atelier-note">Pour les professionnels & les particuliers</p>
    </div>
    <div className="atelier-visual">
      <div className="atelier-drawing-label">MCP / ÉTUDE DE FORME<br />FABRICATION ADDITIVE<br />ILLUSTRATION D’ATELIER — 001</div>
      {hero.videoUrl ? <video className="atelier-media" src={hero.videoUrl} autoPlay muted loop playsInline aria-label="L’atelier MecaPrint3D" /> : hero.imageUrl ? <img className="atelier-media" src={hero.imageUrl} alt="L’atelier MecaPrint3D" /> : <img src="/atelier-piece.svg" alt="Illustration technique d’une pièce mécanique imprimée en 3D" className="atelier-piece" />}
      <div className="atelier-caption"><span />Pensé pour votre projet.</div>
      <div className="atelier-drawing-footer"><span>CONCEPTION → FABRICATION</span><span>NORMANDIE, FRANCE</span></div>
    </div>
  </section><div className="atelier-ticker"><span>CONCEPTION & IMPRESSION 3D</span><span aria-hidden="true">✳</span><span>PERSONNALISATION</span><span aria-hidden="true">✳</span><span>DESIGN & TRANSFORMATION</span><span aria-hidden="true">✳</span><span>PIÈCES UNIQUES & PETITES SÉRIES</span></div></>;
}
