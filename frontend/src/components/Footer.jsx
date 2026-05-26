export default function Footer({ content }) {
  const brand = content?.brand || {};
  const footer = content?.footer || {};
  const partners = content?.partners || [];

  return (
    <footer id="contact" className="border-t border-white/10 bg-black px-6 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        {/* MARQUE */}
        <div>
          {brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt={brand.name || "MecaPrint3D"}
              className="h-14 w-auto object-contain"
            />
          ) : (
            <h3 className="text-3xl font-black">
              Meca<span className="text-orange-500">Print3D</span>
            </h3>
          )}

          <p className="mt-4 text-zinc-400">
            {footer.description}
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h4 className="mb-4 font-bold text-white">
            Navigation
          </h4>

          <div className="space-y-2 text-zinc-400">
            <p><a href="#services" className="hover:text-orange-400">Services</a></p>
            <p><a href="#univers" className="hover:text-orange-400">Univers</a></p>
            <p><a href="#technologies" className="hover:text-orange-400">Technologies</a></p>
            <p><a href="#realisations" className="hover:text-orange-400">Réalisations</a></p>
            <p><a href="#devis" className="hover:text-orange-400">Demande de devis</a></p>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="mb-4 font-bold text-white">
            Contact
          </h4>

          <div className="space-y-2 text-zinc-400">
            <p className="whitespace-pre-line leading-8">
              {brand.location || `Tel +33 06 27 49 70 55

contact@mecaprint3d.fr

19 rue de la cote des monts
76570 GOUPILLIERES, France`}
            </p>

            <p>
              Devis personnalisé avant fabrication
            </p>
          </div>
        </div>
      </div>

      {/* PARTENAIRES */}
      {partners.length > 0 && (
        <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-10">
          <p className="mb-6 text-center text-xs font-black uppercase tracking-[0.35em] text-zinc-500">
            Partenaires & solutions utilisées
          </p>

          <div className="flex flex-wrap items-center justify-center gap-16">
            {partners.map((partner, index) => (
              <a
                key={`${partner.name}-${index}`}
                href={partner.url || "#"}
                target="_blank"
                rel="noreferrer"
                className="opacity-60 transition duration-300 hover:opacity-100"
              >
                {partner.logoUrl ? (
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="h-16 w-auto object-contain opacity-80 brightness-110 transition duration-300 hover:scale-105 hover:opacity-100"
                  />
                ) : (
                  <span className="text-sm font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-orange-400">
                    {partner.name}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* COPYRIGHT */}
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-500">
        {footer.legal || "© 2026 MecaPrint3D — Tous droits réservés."}
      </div>
    </footer>
  );
}