export default function Hero({ content }) {
  const videoUrl =
    content?.bannerVideoUrl || content?.heroVideoUrl;

  const imageUrl =
    content?.bannerImageUrl || content?.heroImageUrl;

  const logoUrl =
    content?.logoUrl || content?.logo;

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">

      {/* VIDEO / IMAGE BACKGROUND */}
      {videoUrl ? (
        <video
          key={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        imageUrl && (
          <img
            src={imageUrl}
            alt="Mecaprint3D"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      )}

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/75"></div>

      {/* ORANGE GLOW */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-black"></div>

      {/* LIGHT EFFECT */}
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"></div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">

        {/* LOGO */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Mecaprint3D"
            className="mb-8 w-40 drop-shadow-2xl md:w-52"
          />
        ) : (
          <div className="mb-8 text-4xl font-black tracking-tight text-white md:text-5xl">
            Meca<span className="text-orange-400">Print3D</span>
          </div>
        )}

        {/* BADGE */}
        <div className="mb-6 rounded-full border border-orange-500/40 bg-orange-500/10 px-5 py-2 text-sm text-orange-300 backdrop-blur-sm">
          Atelier de fabrication • Réparation • Prototypage
        </div>

        {/* TITLE */}
        <h1 className="max-w-6xl text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">

          {content?.heroTitle ||
            "L’impression 3D est devenue accessible."}

          <span className="mt-4 block text-orange-400">
            {content?.heroSubtitle ||
              "La conception reste la clé d’une pièce performante."}
          </span>
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          {content?.description ||
            "MECAPRINT3D accompagne particuliers et professionnels dans la conception, la réparation et la fabrication de pièces techniques sur mesure."}
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">

          <a
            href="#devis"
            className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:bg-orange-400"
          >
            {content?.primaryButton || "Demander un devis"}
          </a>

          <a
            href="#services"
            className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10"
          >
            {content?.secondaryButton || "Voir les services"}
          </a>

        </div>

        {/* STATS */}
        <div className="mt-20 grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">

          {[
            ["+250", "Pièces réalisées"],
            ["3D", "Conception sur mesure"],
            ["PRO", "Réparation & prototypage"],
            ["B2B", "Partenaires industriels"],
          ].map(([value, label]) => (

            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
            >

              <div className="text-3xl font-black text-orange-400">
                {value}
              </div>

              <div className="mt-2 text-zinc-300">
                {label}
              </div>

            </div>

          ))}

        </div>

        {/* TECHNO BADGES */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">

          {[
            "FDM",
            "Résine",
            "SLS",
            "Métal",
            "Découpe laser",
            "Conception CAO",
          ].map((item) => (

            <div
              key={item}
              className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-300 backdrop-blur-md"
            >
              {item}
            </div>

          ))}

        </div>

      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-2xl text-white/60">
        ↓
      </div>

    </section>
  );
}