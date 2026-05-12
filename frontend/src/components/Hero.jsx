export default function Hero({ content }) {
  const hero = content?.hero || {};
  const steps = content?.steps?.length ? content.steps : [];

  return (
    <section className="relative overflow-hidden px-6 py-28 md:py-36">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {hero.imageUrl && (
        <>
          <img src={hero.imageUrl} alt="MecaPrint3D" className="absolute inset-0 -z-30 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-950/80 via-zinc-950/70 to-zinc-950" />
        </>
      )}

      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-6 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 text-sm font-semibold text-orange-300">
          {hero.badge}
        </div>

        <h1 className="mx-auto mb-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          {hero.title} <span className="text-orange-500">{hero.highlight}</span>
        </h1>

        <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          {hero.description}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#devis" className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-400">
            {hero.primaryButton || "Demander un devis"}
          </a>
          <a href="#services" className="rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:border-orange-500">
            {hero.secondaryButton || "Voir les services"}
          </a>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={`${step}-${index}`} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-3xl font-black text-orange-500">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
