function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function Media({ item }) {
  if (!item?.mediaUrl) return null;

  if (item.mediaType === "video" || /\.(mp4|webm|ogg)(\?|#|$)/i.test(item.mediaUrl)) {
    return (
      <video
        src={item.mediaUrl}
        className="h-56 w-full rounded-3xl object-cover opacity-90 transition duration-700 group-hover:scale-105"
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    <img
      src={item.mediaUrl}
      alt={item.title}
      className="h-56 w-full rounded-3xl object-cover opacity-90 transition duration-700 group-hover:scale-105"
    />
  );
}

function TechnologyCard({ item, index }) {
  const materials = normalizeList(item.materials);
  const applications = normalizeList(item.applications);
  const benefits = normalizeList(item.benefits);

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 p-5 shadow-2xl shadow-black/30 transition duration-500 hover:-translate-y-1 hover:border-orange-500/40">
      <div className="relative overflow-hidden rounded-3xl bg-black">
        <Media item={item} />
        {!item?.mediaUrl && (
          <div className="flex h-56 items-center justify-center rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(249,115,22,0.16),rgba(255,255,255,0.04))]">
            <span className="text-6xl font-black text-orange-500/70">{String(index + 1).padStart(2, "0")}</span>
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-orange-300 backdrop-blur">
          {item.badge || "Technologie"}
        </div>
      </div>

      <div className="pt-6">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">{item.process}</p>
        <h3 className="mt-2 text-2xl font-black text-white">{item.title}</h3>
        <p className="mt-3 leading-relaxed text-zinc-300">{item.description}</p>

        {!!materials.length && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-black uppercase tracking-widest text-zinc-400">Matériaux</p>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <span key={material} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-200">
                  {material}
                </span>
              ))}
            </div>
          </div>
        )}

        {!!applications.length && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-black uppercase tracking-widest text-zinc-400">Applications</p>
            <ul className="space-y-2 text-sm text-zinc-300">
              {applications.map((application) => (
                <li key={application} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                  {application}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!!benefits.length && (
          <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
            <p className="mb-2 text-sm font-black uppercase tracking-widest text-orange-300">Avantages</p>
            <p className="text-sm leading-relaxed text-orange-50">{benefits.join(" • ")}</p>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Technologies({ content }) {
  const intro = content?.technologiesIntro || {};
  const technologies = content?.technologies || [];

  if (!technologies.length) return null;

  return (
    <section id="technologies" className="border-t border-white/10 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            {intro.eyebrow || "Technologies"}
          </p>
          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            {intro.title || "Le bon procédé pour la bonne pièce"}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300">
            {intro.description || "Nous orientons chaque projet selon l’usage réel de la pièce, les contraintes mécaniques, le rendu attendu et le budget."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {technologies.map((item, index) => (
            <TechnologyCard key={`${item.title}-${index}`} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
