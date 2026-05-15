import { useState } from "react";

import RealisationCard from "./realisations/RealisationCard";
import RealisationsLightbox from "./realisations/RealisationsLightbox";

export default function Realisations({ content }) {
  const intro = content?.realisationsIntro || {};
  const realisations = content?.realisations || [];

  const [lightbox, setLightbox] = useState(null);

  if (!realisations.length) return null;

  return (
    <section
      id="realisations"
      className="border-t border-white/10 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* INTRO */}
        <div className="mb-16 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            {intro.eyebrow || "Réalisations"}
          </p>

          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            {intro.title || "Des projets concrets, utiles et sur mesure"}
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-zinc-300">
            {intro.description ||
              "Découvrez quelques exemples de pièces réalisées, réparées ou reproduites par MECAPRINT3D."}
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-3">
          {realisations.map((item, index) => (
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
          ))}
        </div>

      </div>

      {/* LIGHTBOX */}
      <RealisationsLightbox
        lightbox={lightbox}
        onClose={() => setLightbox(null)}
      />
    </section>
  );
}