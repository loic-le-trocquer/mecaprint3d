export default function Header({ content }) {
  const brand = content?.brand || {};
  const name = brand.name || "MecaPrint3D";

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* LOGO */}
        <a href="#" className="flex items-center gap-3">
          {brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt={name}
              className="h-12 w-auto object-contain"
            />
          ) : (
            <div className="text-2xl font-black tracking-tight text-white">
              Meca<span className="text-orange-500">Print3D</span>
            </div>
          )}
        </a>

        {/* NAV */}
        <nav className="hidden items-center gap-7 text-sm font-semibold uppercase tracking-wider text-zinc-300 lg:flex">
          <a href="#univers" className="transition hover:text-orange-400">
            Univers
          </a>

          <a href="#services" className="transition hover:text-orange-400">
            Services
          </a>

          <a href="#technologies" className="transition hover:text-orange-400">
            Technologies
          </a>

          <a href="#realisations" className="transition hover:text-orange-400">
            Réalisations
          </a>

          <a href="#devis" className="transition hover:text-orange-400">
            Devis
          </a>
        </nav>

        {/* CTA */}
        <a
          href="#devis"
          className="hidden rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400 lg:inline-flex"
        >
          Demander un devis
        </a>
      </div>
    </header>
  );
}