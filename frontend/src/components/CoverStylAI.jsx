// ================= IMPORTS =================
import { Sparkles, ArrowUpRight } from "lucide-react";

import FadeInSection from "./ui/FadeInSection";

// ================= COMPONENT =================
export default function CoverStylAI() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black px-6 py-28">

      {/* BACKGROUND */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">

        <FadeInSection>

          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* CONTENT */}
            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-black uppercase tracking-[0.25em] text-orange-300 backdrop-blur-xl">

                <Sparkles size={16} />

                Simulation IA

              </div>

              <h2 className="mt-8 text-5xl font-black leading-none tracking-tight text-white md:text-7xl">

                Visualisez votre projet avant travaux

              </h2>

              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400">

                Grâce à l’outil de simulation COVER STYL, projetez instantanément vos futurs espaces rénovés avant travaux.

              </p>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">

                Cuisine, mobilier, van, camping-car, commerce ou rénovation intérieure : découvrez différents styles et finitions avant de lancer votre projet.

              </p>

              {/* BUTTONS */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                {/* IA */}
                <a
                  href="https://before-after-ai.coverstyl.com/?lang=fr&source=website"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-orange-500 px-8 py-5 text-base font-black text-white shadow-[0_0_35px_rgba(249,115,22,0.35)] transition duration-300 hover:scale-[1.02] hover:bg-orange-400"
                >

                  Tester la simulation IA

                  <ArrowUpRight size={20} />

                </a>

                {/* DEVIS */}
                <a
                  href="#devis"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-5 text-base font-black text-white backdrop-blur-xl transition duration-300 hover:border-orange-500/40 hover:bg-white/10"
                >

                  Demander une étude personnalisée

                </a>

              </div>

            </div>

            {/* VISUAL */}
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-zinc-900/70 shadow-[0_0_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">

              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"
                alt="Simulation IA Cover Styl"
                className="h-full w-full object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* LABEL */}
              <div className="absolute left-6 top-6 rounded-full border border-orange-500/20 bg-black/60 px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-orange-300 backdrop-blur-xl">

                COVER STYL AI

              </div>

              {/* BOTTOM */}
              <div className="absolute inset-x-0 bottom-0 p-8">

                <h3 className="text-3xl font-black text-white">

                  Simulation avant / après immersive

                </h3>

                <p className="mt-4 max-w-xl leading-relaxed text-zinc-300">

                  Testez rapidement différentes ambiances, matières et finitions avant votre rénovation.

                </p>

              </div>

            </div>

          </div>

        </FadeInSection>

      </div>

    </section>
  );
}