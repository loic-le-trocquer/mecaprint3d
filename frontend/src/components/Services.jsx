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
 // ================= DATA =================
const intro = content?.servicesIntro || {};

const defaultServices = [
  {
    number: "01",
    badge: "SCAN & CAO",
    title: "Concevoir une pièce sur mesure",
    description:
      "Création CAO, optimisation ou amélioration d'une pièce selon son usage réel, ses contraintes mécaniques et son environnement.",
  },
  {
    number: "02",
    badge: "SCAN & CAO",
    title: "Reproduire une pièce introuvable",
    description:
      "Scan 3D, prise de mesures, rétroconception et fabrication d'une nouvelle pièce lorsque l'original n'est plus disponible.",
  },
  {
    number: "03",
    badge: "TECH",
    title: "Fabriquer un prototype fonctionnel",
    description:
      "Validation rapide d'une forme, d'un assemblage ou d'un concept grâce aux technologies de fabrication additive.",
  },
  {
    number: "04",
    badge: "TECH",
    title: "Produire une petite série technique",
    description:
      "Production de pièces en matériaux adaptés : PETG, ASA, TPU, PC, composites carbone, matériaux haute performance ou solutions industrielles.",
  },
  {
    number: "05",
    badge: "DESIGN",
    title: "Personnaliser et transformer",
    description:
      "Découpe laser, gravure, finitions, peinture, Cover Styl et solutions esthétiques pour des projets uniques.",
  },
  {
    number: "06",
    badge: "CAMPER",
    title: "Aménager et réparer le quotidien",
    description:
      "Solutions sur mesure pour l'habitat, l'atelier, les véhicules de loisirs et tous les objets qui méritent une seconde vie.",
  },
];

const services =
  content?.services?.length > 0
    ? content.services
    : defaultServices;
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

            {intro.eyebrow || "Solutions"}
            </p>

            {/* TITLE */}
            <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">

              {intro.title || "De l'idée à la pièce finie"}

            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 text-lg leading-relaxed text-zinc-300">

              {intro.description ||
"De la réparation d'une pièce introuvable au développement d'un nouveau produit, MecaPrint3D vous accompagne grâce à la conception CAO, au scan 3D et à la fabrication adaptée à votre besoin."}

            </p>

          </div>

          {/* ================= CARDS ================= */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

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