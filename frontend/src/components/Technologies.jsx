// ================= IMPORTS =================
import { useState } from "react";

// ================= ANIMATION =================
import FadeInSection from "./ui/FadeInSection";

// ================= TECHNOLOGIES =================
import TechnologyCard from "./technologies/TechnologyCard";
import TechnologiesIntro from "./technologies/TechnologiesIntro";

// ================= MATERIAUX =================
import { materialsData } from "./materials/materialsData";
import MaterialModal from "./materials/MaterialModal";
import MaterialsCompare from "./materials/MaterialsCompare";

// ================= TECHNOLOGIES COMPONENT =================
export default function Technologies({ content }) {
  // ================= DATA =================
  const intro = content?.technologiesIntro || {};
  const technologies = content?.technologies || [];

  // ================= STATES =================
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showCompare, setShowCompare] = useState(false);

  // ================= EMPTY STATE =================
  if (!technologies.length) return null;

  // ================= RENDER =================
  return (
    <section
      id="technologies"
      className="relative overflow-hidden border-t border-white/10 bg-zinc-950 px-6 py-24"
    >
      {/* ================= BACKGROUND GLOW ================= */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-3xl" />

      {/* ================= CONTAINER ================= */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <FadeInSection>
          {/* ================= INTRO ================= */}
          <TechnologiesIntro
            intro={intro}
            onCompare={() => setShowCompare(true)}
          />

          {/* ================= GRID ================= */}
          <div className="grid gap-6 lg:grid-cols-2">
            {technologies.map((item, index) => (
              <TechnologyCard
                key={`${item.title}-${index}`}
                item={item}
                index={index}
                onSelectMaterial={setSelectedMaterial}
              />
            ))}
          </div>
        </FadeInSection>
      </div>

      {/* ================= MODAL MATERIAU ================= */}
      <MaterialModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
      />

      {/* ================= COMPARATEUR ================= */}
      {showCompare && (
        <MaterialsCompare
          materials={materialsData}
          onClose={() => setShowCompare(false)}
        />
      )}
    </section>
  );
}