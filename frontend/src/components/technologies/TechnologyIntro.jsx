// ================= IMPORTS =================
import MaterialBadge from "../materials/MaterialBadge";
import { materialsData } from "../materials/materialsData";

import Media from "./Media";
import normalizeList from "./normalizeList";


// ======================================================
// CARD TECHNOLOGIE
// ======================================================
export default function TechnologyCard({
  item,
  index,
  onSelectMaterial,
}) {

  // ================= NORMALISATION =================
  const materials = normalizeList(item.materials);
  const applications = normalizeList(item.applications);
  const benefits = normalizeList(item.benefits);

  // ================= RECHERCHE MATERIAU =================
  const getMaterial = (name) =>
    materialsData.find(
      (material) =>
        material.name.toLowerCase() === name.toLowerCase()
    );

  return (
    <article
      className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 p-5 shadow-2xl shadow-black/30 transition duration-500 hover:-translate-y-1 hover:border-orange-500/40"
    >

      {/* ================= MEDIA ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-black">

        <Media item={item} />

        {/* PLACEHOLDER SI PAS DE MEDIA */}
        {!item?.mediaUrl && (
          <div className="flex h-56 items-center justify-center rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(249,115,22,0.16),rgba(255,255,255,0.04))]">

            <span className="text-6xl font-black text-orange-500/70">
              {String(index + 1).padStart(2, "0")}
            </span>

          </div>
        )}

        {/* BADGE */}
        <div className="absolute left-4 top-4 rounded-full bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-orange-300 backdrop-blur">

          {item.badge || "Technologie"}

        </div>

      </div>

      {/* ================= CONTENU ================= */}
      <div className="pt-6">

        {/* PROCESS */}
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
          {item.process}
        </p>

        {/* TITRE */}
        <h3 className="mt-2 text-2xl font-black text-white">
          {item.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-3 leading-relaxed text-zinc-300">
          {item.description}
        </p>

        {/* ================= MATERIAUX ================= */}
        {!!materials.length && (
          <div className="mt-5">

            <p className="mb-2 text-sm font-black uppercase tracking-widest text-zinc-400">
              Matériaux
            </p>

            <div className="flex flex-wrap gap-2">

              {materials.map((materialName) => {

                const material = getMaterial(materialName);

                // ================= BADGE CLIQUABLE =================
                if (material) {
                  return (
                    <MaterialBadge
                      key={material.id}
                      material={material}
                      onClick={onSelectMaterial}
                    />
                  );
                }

                // ================= FALLBACK =================
                return (
                  <span
                    key={materialName}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-200"
                  >
                    {materialName}
                  </span>
                );

              })}

            </div>

          </div>
        )}

        {/* ================= APPLICATIONS ================= */}
        {!!applications.length && (
          <div className="mt-5">

            <p className="mb-2 text-sm font-black uppercase tracking-widest text-zinc-400">
              Applications
            </p>

            <ul className="space-y-2 text-sm text-zinc-300">

              {applications.map((application) => (

                <li key={application} className="flex gap-2">

                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />

                  {application}

                </li>

              ))}

            </ul>

          </div>
        )}

        {/* ================= AVANTAGES ================= */}
        {!!benefits.length && (
          <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">

            <p className="mb-2 text-sm font-black uppercase tracking-widest text-orange-300">
              Avantages
            </p>

            <p className="text-sm leading-relaxed text-orange-50">
              {benefits.join(" • ")}
            </p>

          </div>
        )}

      </div>

    </article>
  );
}