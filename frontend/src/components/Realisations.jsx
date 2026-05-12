export default function Realisations({ content }) {
  const intro = content?.realisationsIntro || {};
  const realisations = content?.realisations || [];

  if (!realisations.length) return null;

  return (
    <section id="realisations" className="border-t border-white/10 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">{intro.eyebrow}</p>
          <h2 className="text-4xl font-black leading-tight md:text-6xl">{intro.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300">{intro.description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {realisations.map((item, index) => (
            <article key={`${item.title}-${index}`} className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className="h-64 w-full object-cover" />
              )}
              <div className="p-6">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-400">{item.category}</p>
                <h3 className="text-2xl font-black">{item.title}</h3>
                <p className="mt-3 text-zinc-300">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
