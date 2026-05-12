export default function Services({ content }) {
  const intro = content?.servicesIntro || {};
  const services = content?.services || [];

  return (
    <section id="services" className="border-t border-white/10 bg-black/40 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">{intro.eyebrow}</p>
          <h2 className="text-4xl font-black leading-tight md:text-6xl">{intro.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300">{intro.description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <article key={`${service.title}-${index}`} className="group rounded-3xl border border-white/10 bg-zinc-900/80 p-8 transition duration-300 hover:-translate-y-1 hover:border-orange-500/70 hover:bg-zinc-900">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-5xl font-black text-orange-500/30 transition group-hover:text-orange-500">
                  {service.number || String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400">
                  {service.badge || "Sur devis"}
                </span>
              </div>
              <h3 className="mb-4 text-2xl font-black text-white">{service.title}</h3>
              <p className="leading-relaxed text-zinc-300">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
