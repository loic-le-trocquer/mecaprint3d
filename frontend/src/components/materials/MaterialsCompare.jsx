import { useState } from "react";

const SORT_OPTIONS = [
  {
    key: "strength",
    label: "Solidité",
    icon: "💪",
  },
  {
    key: "heatResistance",
    label: "Tenue température",
    icon: "🔥",
  },
  {
    key: "chemicalResistance",
    label: "Résistance chimique",
    icon: "🧪",
  },
  {
    key: "flexibility",
    label: "Flexibilité",
    icon: "🧵",
  },
  {
    key: "easeOfPrint",
    label: "Facilité d'impression",
    icon: "⚙️",
  },
  {
    key: "surfaceQuality",
    label: "Qualité finition",
    icon: "✨",
  },
];

function ScoreDots({ value = 0 }) {
  const safeValue = Number(value || 0);

  return (
    <div className="flex justify-center gap-1">
      {[1, 2, 3, 4, 5].map((level) => (
        <div
          key={level}
          className={`h-2.5 w-2.5 rounded-full transition-all ${
            level <= safeValue
              ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]"
              : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

function shortName(name = "") {
  return name
    .replace("– Polymaker", "")
    .replace("- Polymaker", "")
    .replace("™", "")
    .trim();
}
export default function MaterialsCompare({ materials = [], onClose }) {
  const [sortKey, setSortKey] = useState("strength");

  if (!materials.length) return null;

const selectedOption = SORT_OPTIONS.find(
  (option) => option.key === sortKey
);

const orderedMaterials = [...materials].sort((a, b) => {
  const scoreA = Number(a.performance?.[sortKey] || 0);
  const scoreB = Number(b.performance?.[sortKey] || 0);

  return scoreB - scoreA;
});

  return (
    <div className="fixed inset-0 z-[220] overflow-auto bg-black/90 p-6 backdrop-blur">
      <button
        type="button"
        onClick={onClose}
        className="fixed right-5 top-5 z-[9999] rounded-full border border-orange-500/50 bg-black/80 px-5 py-3 font-black text-white shadow-lg backdrop-blur-md transition hover:bg-orange-500 hover:text-black"
      >
        ✕ Fermer
      </button>

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-400">
            Guide de choix
          </p>

          <h2 className="text-5xl font-black text-white">
            Quel matériau choisir ?
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
  {SORT_OPTIONS.map((option) => (
    <button
      key={option.key}
      type="button"
      onClick={() => setSortKey(option.key)}
      className={`rounded-full border px-5 py-3 font-black transition ${
        sortKey === option.key
          ? "border-orange-500 bg-orange-500 text-black"
          : "border-white/10 bg-white/5 text-white hover:border-orange-500 hover:text-orange-400"
      }`}
    >
      {option.icon} {option.label}
    </button>
  ))}
</div>

{selectedOption && (
  <p className="mt-4 text-sm text-zinc-400">
    Classement automatique du plus performant au moins performant selon :{" "}
    <span className="font-bold text-orange-400">
      {selectedOption.label}
    </span>
  </p>
)}
        </div>

<div className="overflow-x-auto rounded-3xl border border-white/10 bg-zinc-950 pb-3">    
     <table className="min-w-[1400px] border-collapse">
            <thead className="bg-white/5">
              <tr>
                <th className="border-b border-white/10 p-5 text-left text-zinc-400">
                  Critère
                </th>

                {orderedMaterials.map((material) => (
                  <th
                    key={material._id || material.name}
                    className="border-b border-white/10 p-5 text-center text-xl font-black text-white"
                  >
                    {shortName(material.name)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <CompareRow
                label="Famille"
                materials={orderedMaterials}
                render={(material) => material.family || "—"}
              />

              <ScoreRow
                label="Solidité"
                materials={orderedMaterials}
                field="strength"
              />

              <ScoreRow
                label="Tenue température"
                materials={orderedMaterials}
                field="heatResistance"
              />

              <ScoreRow
                label="Résistance chimique"
                materials={orderedMaterials}
                field="chemicalResistance"
              />

              <ScoreRow
                label="Flexibilité"
                materials={orderedMaterials}
                field="flexibility"
              />

              <ScoreRow
                label="Facilité d'impression"
                materials={orderedMaterials}
                field="easeOfPrint"
              />

              <ScoreRow
                label="Qualité finition"
                materials={orderedMaterials}
                field="surfaceQuality"
              />

              <CompareRow
                label="Usages recommandés"
                materials={orderedMaterials}
                render={(material) => (
                  <TagList items={material.applications || []} />
                )}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CompareRow({ label, materials, render }) {
  return (
    <tr className="border-b border-white/10">
      <td className="p-5 font-semibold text-zinc-300">
        {label}
      </td>

      {materials.map((material) => (
        <td
          key={material._id || material.name}
          className="p-5 text-center text-sm leading-relaxed text-zinc-200"
        >
          {render(material)}
        </td>
      ))}
    </tr>
  );
}

function ScoreRow({ label, materials, field }) {
  return (
    <tr className="border-b border-white/10">
      <td className="p-5 font-semibold text-zinc-300">
        {label}
      </td>

      {materials.map((material) => (
        <td
          key={material._id || material.name}
          className="p-5"
        >
          <ScoreDots value={material.performance?.[field]} />
        </td>
      ))}
    </tr>
  );
}

function TagList({ items = [] }) {
  if (!items.length) return "—";

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.slice(0, 4).map((item) => (
        <span
          key={item}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
}