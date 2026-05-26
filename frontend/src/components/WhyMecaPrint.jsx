// ================= IMPORTS =================
import {
  BadgeCheck,
  Cuboid,
  ScanLine,
  Palette,
  Wrench,
  Handshake,
} from "lucide-react";

import FadeInSection from "./ui/FadeInSection";

// ================= DATA =================
const reasons = [
  {
    icon: Cuboid,
    title: "Conception technique",
    description:
      "Chaque projet est étudié selon l’usage, les contraintes mécaniques, la matière et le rendu attendu.",
  },
  {
    icon: ScanLine,
    title: "Scan 3D & reproduction",
    description:
      "Reproduction de pièces cassées, introuvables ou anciennes grâce au scan, à la CAO et à la rétroconception.",
  },
  {
    icon: Wrench,
    title: "Réparation & sur-mesure",
    description:
      "Fabrication de pièces utiles, supports, caches, gabarits, prototypes et solutions adaptées à votre besoin réel.",
  },
  {
    icon: Palette,
    title: "Covering premium",
    description:
      "Rénovation visuelle de mobilier, cuisines, vans, commerces et espaces intérieurs avec des films décoratifs haut de gamme.",
  },
  {
    icon: BadgeCheck,
    title: "Finitions soignées",
    description:
      "L’objectif n’est pas seulement de fabriquer, mais d’obtenir une pièce propre, durable et cohérente avec votre projet.",
  },
  {
    icon: Handshake,
    title: "Réseau de partenaires",
    description:
      "Accès à des technologies complémentaires : résine, frittage poudre, métal, découpe laser et solutions spécialisées.",
  },
];

// ================= COMPONENT =================
export default function WhyMecaPrint() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black px-6 py-24">
      {/* BACKGROUND */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <FadeInSection>
          {/* INTRO */}
          <div className="mb-16 max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-orange-500">
              Pourquoi MecaPrint3D
            </p>

            <h2 className="mt-6 text-5xl font-black leading-none tracking-tight text-white md:text-7xl">
              Plus qu’une impression, une solution complète
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-400">
              MecaPrint3D accompagne vos projets de la conception à la finition :
              fabrication additive, scan 3D, réparation, covering premium,
              rénovation et solutions techniques sur mesure.
            </p>
          </div>

          {/* GRID */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reasons.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-[0_0_45px_rgba(249,115,22,0.14)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 transition duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                        <Icon size={28} />
                      </div>

                      <span className="text-4xl font-black text-orange-500/15">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white">
                      {item.title}
                    </h3>

                    <p className="mt-4 leading-relaxed text-zinc-400">
                      {item.description}
                    </p>
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