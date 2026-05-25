import { ArrowRight, Wrench, Palette, Truck } from "lucide-react";

// ================= ICONS =================
const icons = {
  TECH: Wrench,
  DESIGN: Palette,
  CAMPER: Truck,
};

// ================= UNIVERS COMPONENT =================
export default function Univers({ content = {} }) {

  const univers = content.univers || {};
  const items = univers.items || [];

  return (

    <section
      id="univers"
      className="relative overflow-hidden border-t border-white/10 bg-black px-6 py-20 text-white lg:px-8"
    >

      {/* GLOW */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <div className="max-w-4xl">

          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-orange-400">
            {univers.badge || "Nos univers"}
          </p>

          <h2 className="max-w-5xl text-4xl font-black leading-[0.95] tracking-tight text-white md:text-6xl">

            {univers.title ||
              "Un atelier, trois expertises complémentaires"}

          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300">

            {univers.description ||
              "MecaPrint3D accompagne particuliers et professionnels de la conception technique à la transformation visuelle premium."}

          </p>

        </div>

        {/* ================= GRID ================= */}
        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {items.map((item, index) => {

            const Icon = icons[item.title] || Wrench;

            return (

              <a
                key={index}
                href={item.link || "#"}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/40 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-orange-500/40"
              >

                {/* IMAGE */}
                {item.imageUrl ? (

                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-30 transition duration-700 group-hover:scale-105 group-hover:opacity-40"
                  />

                ) : (

                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(255,255,255,0.03))]" />

                )}

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                {/* CONTENT */}
                <div className="relative z-10 flex min-h-[520px] flex-col justify-end p-8">

                  {/* ICON */}
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400 backdrop-blur-xl">

                    <Icon size={30} />

                  </div>

                  {/* TITLE */}
                  <p className="text-sm font-black uppercase tracking-[0.35em] text-orange-400">

                    {item.title}

                  </p>

                  {/* SUBTITLE */}
                  <h3 className="mt-4 text-3xl font-black leading-tight text-white">

                    {item.subtitle}

                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-5 leading-relaxed text-zinc-300">

                    {item.description}

                  </p>

                  {/* CTA */}
                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-300">

                    Découvrir

                    <ArrowRight
                      size={18}
                      className="transition duration-300 group-hover:translate-x-1"
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