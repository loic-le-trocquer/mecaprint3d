export default function Hero({ content }) {
  const videoUrl =
    content?.bannerVideoUrl ||
    content?.heroVideoUrl ||
    content?.videoUrl ||
    content?.heroVideo ||
    content?.bannerVideo ||
    content?.banner?.videoUrl ||
    content?.hero?.videoUrl;

  const imageUrl =
    content?.bannerImageUrl ||
    content?.heroImageUrl ||
    content?.imageUrl ||
    content?.heroImage ||
    content?.bannerImage ||
    content?.banner?.imageUrl ||
    content?.hero?.imageUrl;

  const logoUrl =
    content?.logoUrl ||
    content?.logo ||
    content?.siteLogo ||
    content?.logoImageUrl;

  const title =
    content?.heroTitle ||
    content?.title ||
    "L’impression 3D est devenue accessible.";

  const subtitle =
    content?.heroSubtitle ||
    content?.slogan ||
    content?.signature ||
    "La conception reste la clé d’une pièce performante.";

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* IMAGE FALLBACK */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Mecaprint3D"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* VIDEO BACKGROUND */}
      {videoUrl && (
        <video
          key={videoUrl}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/25 via-black/30 to-black/80" />
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
      {logoUrl && (
  <img
    src={logoUrl}
    alt="Logo"
    className="mb-8 w-40 drop-shadow-2xl md:w-52"
  />
)}

        <div className="mb-6 rounded-full border border-orange-500/40 bg-orange-500/10 px-5 py-2 text-sm text-orange-300 backdrop-blur-sm">
          Atelier de fabrication • Réparation • Prototypage
        </div>

        <h1 className="max-w-6xl text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
          {title}
          <span className="mt-4 block text-orange-400">
            {subtitle}
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          {content?.description ||
            "MECAPRINT3D accompagne particuliers et professionnels dans la conception, la réparation et la fabrication de pièces techniques sur mesure."}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#devis"
            className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-orange-500/30 transition hover:scale-105 hover:bg-orange-400"
          >
            {content?.primaryButton || "Demander un devis"}
          </a>

          <a
            href="#services"
            className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
          >
            {content?.secondaryButton || "Voir les services"}
          </a>
        </div>

        <div className="mt-20 grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            ["+250", "Pièces réalisées"],
            ["3D", "Conception sur mesure"],
            ["PRO", "Réparation & prototypage"],
            ["B2B", "Partenaires industriels"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="text-3xl font-black text-orange-400">
                {value}
              </div>
              <div className="mt-2 text-zinc-300">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {[
            [
                 ["FDM", "#fdm"],
                 ["Résine", "#resine"],
                 ["SLS", "#sls"],
                 ["Métal", "#metal"],
                 ["Découpe laser", "#laser"],
                 ["Conception CAO", "#cao"],
]
          ].map(([item, link]) => (
            <a
              key={item}
              href={link}
              className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-300 backdrop-blur-md transition hover:border-orange-500/50 hover:text-orange-300"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-2xl text-white/60">
        ↓
      </div>
    </section>
  );
}