// ================= IMPORTS =================
import {
  Wrench,
  ScanLine,
  Palette,
  Caravan,
  ArrowUpRight,
} from "lucide-react";

import FadeInSection from "./ui/FadeInSection";

// ================= ICONS =================
const icons = {
  TECH: Wrench,
  "SCAN & CAO": ScanLine,
  DESIGN: Palette,
  CAMPER: Caravan,
};

// ================= SERVICES COMPONENT =================
export default function Services({ content }) {

  // ================= DATA =================
  const intro = content?.servicesIntro || {};
  const services = content?.services || [];

  // ================= RENDER =================
  return (

    <section
      id="services"
      className="relative overflow-hidden border-t border-white/10 bg-black px-6 py-20"
    >

      {/* ================= BACKGROUND GLOW ================= */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />

      {/* ================= CONTAINER ================= */}
      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ================= FADE SECTION ================= */}
        <FadeInSection>

          {/* ================= INTRO ================= */}
          <div className="mb-16 max-w-3xl">

            {/* EYEBROW */}
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">

              {intro.eyebrow}

            </p>

            {/* TITLE */}
            <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">

              {intro.title}

            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 text-lg leading-relaxed text-zinc-300">

              {intro.description}

            </p>

          </div>

          {/* ================= CARDS ================= */}
          <div className="grid gap-6 md:grid-cols-2">

            {services.map((service, index) => {

              // ================= ICON =================
              const Icon = icons[service.badge] || Wrench;

              return (

                <article
                  key={`${service.title}-${index}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-orange-500/50 hover:bg-zinc-900 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]"
                >

                  {/* ================= HOVER GLOW ================= */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 transition duration-500 group-hover:opacity-100" />

                  {/* ================= CONTENT ================= */}
                  <div className="relative z-10">

                    {/* ================= TOP ================= */}
                    <div className="mb-8 flex items-start justify-between">

                      {/* ICON */}
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">

                        <Icon size={30} />

                      </div>

                      {/* BADGE */}
                      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-orange-300">

                        {service.badge || "SERVICE"}

                      </span>

                    </div>

                    {/* NUMBER */}
                    <span className="text-5xl font-black text-orange-500/20 transition duration-300 group-hover:text-orange-500/40">

                      {service.number || String(index + 1).padStart(2, "0")}

                    </span>

                    {/* TITLE */}
                    <h3 className="mt-5 text-2xl font-black text-white">

                      {service.title}

                    </h3>

                    {/* DESCRIPTION */}
                    <p className="mt-5 leading-relaxed text-zinc-300">

                      {service.description}

                    </p>

                    {/* CTA */}
                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 transition duration-300 group-hover:translate-x-1">

                      Découvrir

                      <ArrowUpRight size={16} />

                    </div>

                  </div>

                </article>

              );

            })}

          </div>

        </FadeInSection>

      </div>

    </section>

  );
}