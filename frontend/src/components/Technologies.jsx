import { useState } from "react";

// ================= TECHNOLOGIES =================
import TechnologyCard from "./technologies/TechnologyCard";
import TechnologiesIntro from "./technologies/TechnologiesIntro";

// ================= MATERIAUX =================
import { materialsData } from "./materials/materialsData";
import MaterialModal from "./materials/MaterialModal";
import MaterialsCompare from "./materials/MaterialsCompare";

export default function Technologies({ content }) {

  // ================= INTRO =================
  const intro = content?.technologiesIntro || {};

  // ================= TECHNOLOGIES =================
  const technologies = content?.technologies || [];

  // ================= ETATS =================
  const [selectedMaterial, setSelectedMaterial] =
    useState(null);

  const [showCompare, setShowCompare] =
    useState(false);

  // ================= SI VIDE =================
  if (!technologies.length) return null;

  return (
    <section
      id="technologies"
      className="border-t border-white/10 px-6 py-24"
    >

      <div className="mx-auto max-w-7xl">

        {/* INTRO */}
        <TechnologiesIntro
          intro={intro}
          onCompare={() => setShowCompare(true)}
        />

        {/* GRID */}
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

      </div>

      {/* MODAL MATERIAU */}
      <MaterialModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
      />

      {/* COMPARATEUR */}
      {showCompare && (
        <MaterialsCompare
          materials={materialsData}
          onClose={() => setShowCompare(false)}
        />
      )}

    </section>
  );
}