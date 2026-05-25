import { ArrowRight, Wrench, Palette, Caravan } from "lucide-react";

const icons = {
  TECH: Wrench,
  DESIGN: Palette,
  CAMPER: Caravan,
};

export default function Univers({ content = {} }) {
  const univers = content.univers || {};

  const items = univers.items || [];

  return (
    <section
      id="univers"
      className="bg-slate-950 px-6 py-24 text-white lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
            {univers.badge || "Nos univers"}
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {univers.title ||
              "Un atelier, trois expertises complémentaires"}
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            {univers.description ||
              "MecaPrint3D accompagne particuliers et professionnels de la conception technique à la transformation visuelle premium."}
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[item.title] || Wrench;

            return (
              <a
                key={index}
                href={item.link || "#"}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                {/* Background image */}
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-20 transition duration-300 group-hover:opacity-30"
                  />
                )}

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
                    <Icon size={28} />
                  </div>

                  {/* Title */}
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                    {item.title}
                  </p>

                  <h3 className="mt-3 text-2xl font-bold">
                    {item.subtitle}
                  </h3>

                  {/* Description */}
                  <p className="mt-5 text-slate-300">
                    {item.description}
                  </p>

                  {/* CTA */}
                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
                    Découvrir
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}