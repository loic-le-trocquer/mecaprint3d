// ================= IMPORTS =================
import { useEffect, useState } from "react";

import FadeInSection from "./ui/FadeInSection";
import TechnologyCard from "./technologies/TechnologyCard";
import TechnologiesIntro from "./technologies/TechnologiesIntro";

import MaterialModal from "./materials/MaterialModal";
import MaterialsCompare from "./materials/MaterialsCompare";

// ================= API =================
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mecaprint3d-backend.onrender.com";

// ================= COMPONENT =================
export default function Technologies({ content }) {
  // ================= CONTENT DATA =================
  const intro = content?.technologiesIntro || {};

  const technologies = Array.isArray(content?.technologies)
    ? content.technologies
    : [];

  // ================= STATES =================
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showCompare, setShowCompare] = useState(false);

  // ================= LOAD MATERIALS FROM MONGO =================
  useEffect(() => {
    async function loadMaterials() {
      try {
        const response = await fetch(`${API_URL}/api/materials`);
        const data = await response.json();
setMaterials(
  Array.isArray(data)
    ? data.filter(
        (material) =>
          material.isActive !== false &&
          material.active !== false
      )
    : (data.materials || []).filter(
        (material) =>
          material.isActive !== false &&
          material.active !== false
      )
);
      } catch (error) {
        console.error("Erreur chargement matériaux :", error);
      }
    }

    loadMaterials();
  }, []);

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
                key={`${item?.title || "tech"}-${index}`}
                item={item}
                index={index}
                materials={materials}
                onSelectMaterial={setSelectedMaterial}
              />
            ))}
          </div>
        </FadeInSection>
      </div>

      {/* ================= MATERIAL MODAL ================= */}
      <MaterialModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
      />

      {/* ================= MATERIAL COMPARE ================= */}
      {showCompare && (
        <MaterialsCompare
          materials={materials}
          onClose={() => setShowCompare(false)}
        />
      )}
    </section>
  );
}