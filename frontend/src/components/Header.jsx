export default function Header({ content }) {
  const brand = content?.brand || {};
  const name = brand.name || "MecaPrint3D";

  return (
    <header className="sticky top-0 z-50 overflow-hidden border-b border-orange-500/20 bg-black/80 backdrop-blur-xl">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black"></div>

      {/* Glow orange */}
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-5">

        <div className="flex flex-col items-center justify-center text-center">

          {/* LOGO */}
          <a href="#" className="transition duration-500 hover:scale-105">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={name}
                className="w-[260px] md:w-[420px] object-contain drop-shadow-[0_0_25px_rgba(249,115,22,0.35)]"
              />
            ) : (
              <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">
                Meca<span className="text-orange-500">Print3D</span>
              </h1>
            )}
          </a>

          {/* SLOGAN */}
          <p className="mt-4 text-xs uppercase tracking-[0.35em] text-zinc-300 md:text-sm">
            Réparation • Conception • Impression 3D • Personnalisation
          </p>

          {/* NAVBAR */}
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-zinc-800 pt-6 text-sm font-semibold uppercase tracking-wider text-zinc-300 md:gap-8 md:text-base">
            
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

            <a href="#contact" className="transition hover:text-orange-400">
              Contact
            </a>

            <a
              href="#devis"
              className="rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:scale-105 hover:bg-orange-400"
            >
              Demander un devis
            </a>

          </nav>
        </div>
      </div>
    </header>
  );
}