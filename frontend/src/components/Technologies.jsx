import { useState } from "react";

import TechnologyCard from "./technologies/TechnologyCard";
import TechnologiesIntro from "./technologies/TechnologiesIntro";

import { materialsData } from "./materials/materialsData";
import MaterialModal from "./materials/MaterialModal";
import MaterialsCompare from "./materials/MaterialsCompare";

export default function Technologies({ content }) {
  const intro = content?.technologiesIntro || {};
  const technologies = content?.technologies || [];

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showCompare, setShowCompare] = useState(false);

  if (!technologies.length) return null;

  return (
    <section id="technologies" className="border-t border-white/10 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <TechnologiesIntro
          intro={intro}
          onCompare={() => setShowCompare(true)}
        />

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