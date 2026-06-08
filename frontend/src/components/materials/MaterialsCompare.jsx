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

export default function MaterialsCompare({
  materials = [],
  onClose,
}) {
  if (!materials.length) return null;

  return (
    <div className="fixed inset-0 z-[220] overflow-auto bg-black/90 p-6 backdrop-blur">
      <button
        type="button"
        onClick={onClose}
        className="fixed right-5 top-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-black text-white transition hover:bg-orange-500"
      >
        Fermer
      </button>

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-400">
            Comparateur
          </p>

          <h2 className="text-5xl font-black text-white">
            Comparaison des matériaux
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-zinc-950">
          <table className="min-w-full border-collapse">
            <thead className="bg-white/5">
              <tr>
                <th className="border-b border-white/10 p-5 text-left text-zinc-400">
                  Critère
                </th>

                {materials.map((material) => (
                  <th
                    key={material._id || material.name}
                    className="border-b border-white/10 p-5 text-center text-xl font-black text-white"
                  >
                    {material.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <CompareRow
                label="Famille"
                materials={materials}
                render={(material) =>
                  material.family || "—"
                }
              />

              <ScoreRow
                label="Résistance mécanique"
                materials={materials}
                field="mechanical"
              />

              <ScoreRow
                label="Tenue température"
                materials={materials}
                field="temperature"
              />

              <ScoreRow
                label="Résistance UV"
                materials={materials}
                field="uv"
              />

              <ScoreRow
                label="Flexibilité"
                materials={materials}
                field="flexibility"
              />

              <ScoreRow
                label="Qualité finition"
                materials={materials}
                field="finish"
              />

              <CompareRow
                label="Usage recommandé"
                materials={materials}
                render={(material) =>
                  material.applications?.length
                    ? material.applications.join(", ")
                    : "—"
                }
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
          <ScoreDots value={material.resistance?.[field]} />
        </td>
      ))}
    </tr>
  );
}