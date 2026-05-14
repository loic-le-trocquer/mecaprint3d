function isVideoUrl(url = "") {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
}

export default function Hero({ content }) {
  const hero = content?.hero || {};
  const steps = content?.steps?.length ? content.steps : [];

  // ================= MEDIA =================
  const backgroundVideo = isVideoUrl(hero.videoUrl)
    ? hero.videoUrl
    : null;

  const backgroundImage =
    hero.imageUrl ||
    (!isVideoUrl(hero.videoUrl) ? hero.videoUrl : null);

  // ================= TEXT =================
  const slogan =
    hero.slogan ||
    "L’impression 3D est devenue accessible. La conception reste la clé d’une pièce performante.";

  return (
    <section
      id="accueil"
      className="relative overflow-hidden px-6 py-28 md:py-40"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-30 bg-zinc-950" />

      {/* IMAGE */}
{backgroundImage && (
  <img
    src={backgroundImage}
    alt="MecaPrint3D"
    className="absolute inset-0 -z-30 h-full w-full object-cover opacity-40"
  />
)}

{/* VIDEO */}
{backgroundVideo && (
  <video
    key={backgroundVideo}
    src={backgroundVideo}
    className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
  />
)}

      {/* GRID EFFECT */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-zinc-950/80 to-zinc-950" />

      {/* ORANGE GLOW */}
      <div className="absolute left-1/2 top-20 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/15 blur-3xl" />

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl text-center">

        {/* BADGE */}
        {hero.badge && (
          <div className="mb-6 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 text-sm font-semibold text-orange-300 backdrop-blur">
            {hero.badge}
          </div>
        )}

        {/* TITLE */}
        <h1 className="mx-auto mb-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          {hero.title}

          {hero.highlight && (
            <span className="text-orange-500">
              {" "}
              {hero.highlight}
            </span>
          )}
        </h1>

        {/* DESCRIPTION */}
        <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          {hero.description}
        </p>

        {/* SLOGAN */}
        <div className="mx-auto mb-10 max-w-4xl rounded-3xl border border-orange-500/25 bg-black/40 p-6 text-xl font-black leading-snug text-white shadow-2xl shadow-orange-500/10 backdrop-blur md:text-3xl">

          {slogan.split(". ").map((line, index) => (
            <span key={line} className="block">
              {line}
              {index === 0 && slogan.includes(". ") ? "." : ""}
            </span>
          ))}

        </div>

        {/* CTA */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">

          <a
            href="#devis"
            className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-400"
          >
            {hero.primaryButton || "Demander un devis"}
          </a>

          <a
            href="#technologies"
            className="rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:border-orange-500"
          >
            {hero.secondaryButton || "Voir les technologies"}
          </a>

        </div>

        {/* TECHNO SHORTCUTS */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">

          {[
            ["FDM", "#fdm"],
            ["Résine", "#resine"],
            ["SLS", "#sls"],
            ["Métal", "#metal"],
            ["Découpe laser", "#laser"],
            ["Conception CAO", "#cao"],
          ].map(([label, link]) => (

            <a
              key={label}
              href={link}
              className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-300 backdrop-blur transition hover:border-orange-500/50 hover:text-orange-300"
            >
              {label}
            </a>

          ))}

        </div>

        {/* STEPS */}
        {steps.length > 0 && (
          <div className="mt-16 grid gap-4 md:grid-cols-3">

            {steps.map((step, index) => (

              <div
                key={`${step}-${index}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >

                <p className="text-3xl font-black text-orange-500">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <p className="mt-2 font-semibold">
                  {step}
                </p>

              </div>

            ))}

          </div>
        )}

      </div>
    </section>
  );
}