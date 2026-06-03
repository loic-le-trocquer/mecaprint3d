// ================= IMPORTS =================
import materialsData from "./materials/materialsData";

// ================= COMPONENT =================
export default function TechnologyCard({
  item,
  index,
  onSelectMaterial,
}) {
  // ================= MATERIALS =================
  const compatibleMaterials =
    item.materials
      ?.map((materialName) =>
        materialsData.find(
          (m) =>
            m.name
              ?.toLowerCase()
              .includes(
                materialName.toLowerCase()
              ) ||
            m.category
              ?.toLowerCase()
              .includes(
                materialName.toLowerCase()
              )
        )
      )
      .filter(Boolean) || [];

  return (
    <div
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all duration-500 hover:border-orange-500/40 hover:bg-white/[0.05]"
    >
      {/* ================= IMAGE ================= */}
      {item.mediaUrl && (
        <div className="relative h-64 overflow-hidden">
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="p-8">

        {/* ================= TITLE ================= */}
        <h3 className="text-3xl font-black text-white">
          {item.title}
        </h3>

        {/* ================= DESCRIPTION ================= */}
        <p className="mt-4 leading-relaxed text-zinc-300">
          {item.description}
        </p>

        {/* ================= MATERIALS ================= */}
        {!!compatibleMaterials.length && (
          <div className="mt-8">

            <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-zinc-500">
              Matériaux
            </h4>

            <div className="flex flex-wrap gap-3">

              {compatibleMaterials.map((material) => (
                <button
                  key={material.id}
                  type="button"
                  onClick={() =>
                    onSelectMaterial(material)
                  }
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-orange-500 hover:bg-orange-500 hover:text-black"
                >
                  {material.name}
                </button>
              ))}

            </div>

          </div>
        )}

        {/* ================= APPLICATIONS ================= */}
        {!!item.applications?.length && (
          <div className="mt-8">

            <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-zinc-500">
              Applications
            </h4>

            <ul className="space-y-2">

              {item.applications.map((application) => (
                <li
                  key={application}
                  className="flex items-start gap-3 text-zinc-300"
                >
                  <span className="mt-2 h-2 w-2 rounded-full bg-orange-500" />

                  <span>
                    {application}
                  </span>
                </li>
              ))}

            </ul>

          </div>
        )}

      </div>
    </div>
  );
}