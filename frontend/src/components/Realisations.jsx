// ================= IMPORTS =================
import { useState } from "react";

// ================= ANIMATION =================
import FadeInSection from "./ui/FadeInSection";

// ================= REALISATIONS =================
import RealisationCard from "./realisations/RealisationCard";
import RealisationsLightbox from "./realisations/RealisationsLightbox";

// ================= REALISATIONS COMPONENT =================
export default function Realisations({ content }) {
  // ================= DATA =================
  const intro = content?.realisationsIntro || {};
  const realisations = content?.realisations || [];

  // ================= STATES =================
  const [lightbox, setLightbox] = useState(null);
  const hasRealisations = realisations.length > 0;

  // ================= RENDER =================
  return (
    <section
      id="realisations"
      className="relative overflow-hidden border-t border-white/10 bg-black px-6 py-24"
    >
      {/* ================= BACKGROUND GLOW ================= */}
      <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-3xl" />

      {/* ================= CONTAINER ================= */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <FadeInSection>
          {/* ================= INTRO ================= */}
          <div className="mb-16 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              {intro.eyebrow || "Réalisations"}
            </p>

            <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">
              {intro.title || "Des projets concrets, utiles et sur mesure"}
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-zinc-300">
              {intro.description ||
                "Découvrez quelques exemples de réalisations MecaPrint3D : fabrication, rénovation, covering et personnalisation."}
            </p>
          </div>

          {/* ================= GRID ================= */}
          <div className="grid gap-6 md:grid-cols-3">
            {hasRealisations ? (
              realisations.map((item, index) => (
                <RealisationCard
                  key={`${item.title}-${index}`}
                  item={item}
                  onOpen={(selectedItem, selectedIndex) =>
                    setLightbox({
                      item: selectedItem,
                      index: selectedIndex,
                    })
                  }
                />
              ))
            ) : (
              <>
                {/* ================= PLACEHOLDER DESIGN ================= */}
                <div className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 transition duration-500 hover:-translate-y-2 hover:border-orange-500/40">
                  <img
                    src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                    alt="Projet design"
                    className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="p-6">
                    <p className="text-sm uppercase tracking-[0.25em] text-orange-400">
                      DESIGN
                    </p>

                    <h3 className="mt-3 text-2xl font-black text-white">
                      Covering & rénovation premium
                    </h3>

                    <p className="mt-4 text-zinc-300">
                      Modernisation de mobilier, cuisines et espaces professionnels.
                    </p>
                  </div>
                </div>

                {/* ================= PLACEHOLDER TECH ================= */}
                <div className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 transition duration-500 hover:-translate-y-2 hover:border-orange-500/40">
                  <img
                    src="https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1200&q=80"
                    alt="Projet technique"
                    className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="p-6">
                    <p className="text-sm uppercase tracking-[0.25em] text-orange-400">
                      TECH
                    </p>

                    <h3 className="mt-3 text-2xl font-black text-white">
                      Fabrication & pièces techniques
                    </h3>

                    <p className="mt-4 text-zinc-300">
                      Impression 3D, scan et conception de pièces sur mesure.
                    </p>
                  </div>
                </div>

                {/* ================= PLACEHOLDER CAMPER ================= */}
                <div className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 transition duration-500 hover:-translate-y-2 hover:border-orange-500/40">
                  <img
                    src="https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1200&q=80"
                    alt="Projet camper"
                    className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="p-6">
                    <p className="text-sm uppercase tracking-[0.25em] text-orange-400">
                      CAMPER
                    </p>

                    <h3 className="mt-3 text-2xl font-black text-white">
                      Rénovation van & camping-car
                    </h3>

                    <p className="mt-4 text-zinc-300">
                      Transformation intérieure et personnalisation premium.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </FadeInSection>
      </div>

      {/* ================= LIGHTBOX ================= */}
      <RealisationsLightbox
        lightbox={lightbox}
        onClose={() => setLightbox(null)}
      />
    </section>
  );
}