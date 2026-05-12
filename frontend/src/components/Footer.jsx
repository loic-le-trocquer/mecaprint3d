export default function Footer({ content }) {
  const brand = content?.brand || {};
  const footer = content?.footer || {};

  return (
    <footer id="contact" className="border-t border-white/10 bg-black px-6 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.name || "MecaPrint3D"} className="h-14 w-auto object-contain" />
          ) : (
            <h3 className="text-3xl font-black">
              Meca<span className="text-orange-500">Print3D</span>
            </h3>
          )}
          <p className="mt-4 text-zinc-400">{footer.description}</p>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">Navigation</h4>
          <div className="space-y-2 text-zinc-400">
            <p><a href="#services" className="hover:text-orange-400">Services</a></p>
            <p><a href="#realisations" className="hover:text-orange-400">Réalisations</a></p>
            <p><a href="#devis" className="hover:text-orange-400">Demande de devis</a></p>
            <p><a href="#contact" className="hover:text-orange-400">Contact</a></p>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">Contact</h4>
          <div className="space-y-2 text-zinc-400">
            <p>{brand.email || "contact@mecaprint3d.fr"}</p>
            <p>{brand.location || "France"}</p>
            <p>Devis personnalisé avant fabrication</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-500">
        {footer.legal || "© 2026 MecaPrint3D — Tous droits réservés."}
      </div>
    </footer>
  );
}
