import MaterialBadge from "../materials/MaterialBadge";

import Media from "./Media";
import normalizeList from "./normalizeList";

export default function TechnologyCard({
  item,
  index,
  materials = [],
  onSelectMaterial,
}) {
  // ================= DATA =================
  const technologyMaterials = normalizeList(item.materials);
  const applications = normalizeList(item.applications);
  const benefits = normalizeList(item.benefits);

  // ================= MATERIAL MATCHING =================
  const getMaterial = (name) => {
    const cleanName = String(name || "")
      .toLowerCase()
      .trim();

    if (!cleanName) return null;

    const aliases = {
      pla: ["pla", "polylite pla", "polymaker pla"],
      "pla pro": ["pla pro", "polylite pla pro", "polymaker pla pro"],
      petg: ["petg", "polylite petg", "polymaker petg"],
      asa: ["asa", "polylite asa"],
      tpu: ["tpu", "tpu95", "tpu95a", "polyflex"],
      abs: ["abs", "polylite abs"],
      pc: ["pc", "polycarbonate", "polylite pc"],
      polycarbonate: ["pc", "polycarbonate", "polylite pc"],
      nylon: ["nylon", "pa", "pa6", "pa12", "pa612"],
      carbone: ["carbone", "carbon", "cf", "petg-cf", "pa-cf"],
      carbon: ["carbone", "carbon", "cf", "petg-cf", "pa-cf"],
    };

    const searchTerms = aliases[cleanName] || [cleanName];

    return materials.find((material) => {
      const materialName =
        material.name?.toLowerCase() || "";

      const materialFamily =
        material.family?.toLowerCase() || "";

      const materialCategory =
        material.category?.toLowerCase() || "";

      const materialText = [
        materialName,
        materialFamily,
        materialCategory,
      ].join(" ");

      return searchTerms.some((term) =>
        materialText.includes(term)
      );
    });
  };

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-orange-500/50 hover:bg-zinc-900">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-black">
        <Media item={item} />

        {!item?.mediaUrl && (
          <div className="relative flex h-40 items-center justify-center rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(255,255,255,0.03))]">
            <span className="pointer-events-none absolute left-6 top-3 z-0 text-7xl font-black text-orange-500/10">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full border border-orange-500/20 bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-orange-300 backdrop-blur-xl">
          {item.badge || "Technologie"}
        </div>
      </div>

      <div className="relative z-10 pt-6">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
          {item.process}
        </p>

        <h3 className="mt-2 text-2xl font-black text-white">
          {item.title}
        </h3>

        <p className="mt-3 leading-relaxed text-zinc-300">
          {item.description}
        </p>

        {/* ================= MATERIALS ================= */}
        {!!technologyMaterials.length && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-black uppercase tracking-widest text-zinc-400">
              Matériaux
            </p>

            <div className="flex flex-wrap gap-2">
              {technologyMaterials.map((materialName) => {
                const material = getMaterial(materialName);

                if (material) {
                  return (
                    <MaterialBadge
                      key={material._id || material.name}
                      material={material}
                      onClick={onSelectMaterial}
                    />
                  );
                }

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

        {/* ================= BENEFITS ================= */}
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