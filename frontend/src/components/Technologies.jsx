// ================= IMPORTS =================
import { useState } from "react";

import FadeInSection from "./ui/FadeInSection";
import TechnologyCard from "./technologies/TechnologyCard";
import TechnologiesIntro from "./technologies/TechnologiesIntro";

import materialsData from "./materials/materialsData";
import MaterialModal from "./materials/MaterialModal";
import MaterialsCompare from "./materials/MaterialsCompare";

// ================= COMPONENT =================
export default function Technologies({ content }) {
  const intro = content?.technologiesIntro || {};
  const technologies = Array.isArray(content?.technologies)
    ? content.technologies
    : [];

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showCompare, setShowCompare] = useState(false);

  if (!technologies.length) return null;

  return (
    <section
      id="technologies"
      className="relative overflow-hidden border-t border-white/10 bg-zinc-950 px-6 py-24"
    >
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <FadeInSection>
          <TechnologiesIntro
            intro={intro}
            onCompare={() => setShowCompare(true)}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {technologies.map((item, index) => (
              <TechnologyCard
                key={`${item?.title || "tech"}-${index}`}
                item={item}
                index={index}
                onSelectMaterial={setSelectedMaterial}
              />
            ))}
          </div>
        </FadeInSection>
      </div>

      <MaterialModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
      />

      {showCompare && (
        <MaterialsCompare
          materials={materialsData}
          onClose={() => setShowCompare(false)}
        />
      )}
    </section>
  );
}