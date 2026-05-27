// ================= IMPORTS =================
import { useMemo, useState } from "react";
import ProjectModal from "./realisations/ProjectModal";

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
  const [selectedProject, setSelectedProject] = useState(null);
  
  // ================= FILTRE =================
  const [selectedCategory, setSelectedCategory] =
    useState("TOUT");

  // ================= CATEGORIES =================
  const categories = useMemo(() => {

    const allCategories =
      realisations
        .map((item) => item.category)
        .filter(Boolean);

    return ["TOUT", ...new Set(allCategories)];

  }, [realisations]);

  // ================= FILTERED REALISATIONS =================
  const filteredRealisations =
    selectedCategory === "TOUT"
      ? realisations
      : realisations.filter(
          (item) => item.category === selectedCategory
        );

  // ================= EMPTY =================
  const hasRealisations =
    filteredRealisations.length > 0;

  // ================= RENDER =================
return (
  <>
    {/* ================= PROJECT MODAL ================= */}
    <ProjectModal
      project={selectedProject}
      onClose={() => setSelectedProject(null)}
    />

    {/* ================= LIGHTBOX ================= */}
    <RealisationsLightbox
      lightbox={lightbox}
      onClose={() => setLightbox(null)}
    />

    {/* ================= SECTION ================= */}
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

          {/* ================= FILTERS ================= */}
          {categories.length > 1 && (

            <div className="mb-12 flex flex-wrap gap-3">

              {categories.map((category) => (

                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-5 py-3 text-sm font-black uppercase tracking-[0.2em] transition duration-300 ${
                    selectedCategory === category
                      ? "border-orange-500 bg-orange-500 text-white shadow-[0_0_25px_rgba(249,115,22,0.25)]"
                      : "border-white/10 bg-white/5 text-zinc-300 hover:border-orange-500/40 hover:text-white"
                  }`}
                >
                  {category}
                </button>

              ))}

            </div>

          )}

          {/* ================= GRID ================= */}
          <div className="columns-1 gap-8 space-y-8 md:columns-2 xl:columns-3">

            {hasRealisations ? (

            filteredRealisations.map((item, index) => (

  <div
    key={`${item.title}-${index}`}
    className="animate-[cardReveal_700ms_ease-out_both]"
    style={{
      animationDelay: `${index * 120}ms`,
    }}
  >
    <RealisationCard
      item={item}
      onOpen={(selectedItem) =>
        setSelectedProject(selectedItem)
      }
    />
  </div>

))

            ) : (

              <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-10 text-center text-zinc-400">
                Aucun projet disponible dans cette catégorie.
              </div>

            )}

          </div>

        </FadeInSection>

      </div>

    </section>
  
    <style>{`
  @keyframes cardReveal {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.96);
      filter: blur(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }
`}</style>       
  
  </>
);
}