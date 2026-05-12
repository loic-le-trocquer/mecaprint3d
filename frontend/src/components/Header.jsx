export default function Header({ content }) {
  const brand = content?.brand || {};
  const name = brand.name || "MecaPrint3D";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-3 text-2xl font-black tracking-tight">
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={name} className="h-11 w-auto object-contain" />
          ) : (
            <span>
              Meca<span className="text-orange-500">Print3D</span>
            </span>
          )}
        </a>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-zinc-300 md:flex">
          <a href="#services" className="transition hover:text-orange-400">Services</a>
          <a href="#realisations" className="transition hover:text-orange-400">Réalisations</a>
          <a href="#devis" className="transition hover:text-orange-400">Devis</a>
          <a href="#contact" className="transition hover:text-orange-400">Contact</a>
        </nav>

        <a href="#devis" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold transition hover:bg-orange-400">
          Devis gratuit
        </a>
      </div>
    </header>
  );
}
