function ScoreDots({ value }) {
  return (
    <div className="flex justify-center gap-1">
      {[1, 2, 3, 4, 5].map((level) => (
        <div
          key={level}
          className={`h-2.5 w-2.5 rounded-full ${
            level <= value
              ? "bg-orange-500"
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

      {/* CLOSE */}
      <button
        type="button"
        onClick={onClose}
        className="fixed right-5 top-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-black text-white transition hover:bg-orange-500"
      >
        Fermer
      </button>

      <div className="mx-auto max-w-7xl">

        {/* TITLE */}
        <div className="mb-10 text-center">

          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-400">
            Comparateur
          </p>

          <h2 className="text-5xl font-black text-white">
            Comparaison des matériaux
          </h2>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-zinc-950">

          <table className="min-w-full border-collapse">

            <thead className="bg-white/5">

              <tr>

                <th className="border-b border-white/10 p-5 text-left text-zinc-400">
                  Critère
                </th>

                {materials.map((material) => (
                  <th
                    key={material.id}
                    className="border-b border-white/10 p-5 text-center text-xl font-black text-white"
                  >
                    {material.name}
                  </th>
                ))}

              </tr>

            </thead>

            <tbody>

              {/* FAMILY */}
              <tr className="border-b border-white/10">
                <td className="p-5 font-semibold text-zinc-300">
                  Famille
                </td>

                {materials.map((material) => (
                  <td
                    key={material.id}
                    className="p-5 text-center text-zinc-200"
                  >
                    {material.family}
                  </td>
                ))}
              </tr>

              {/* RESISTANCE */}
              <tr className="border-b border-white/10">
                <td className="p-5 font-semibold text-zinc-300">
                  Résistance mécanique
                </td>

                {materials.map((material) => (
                  <td key={material.id} className="p-5">
                    <ScoreDots value={material.resistance} />
                  </td>
                ))}
              </tr>

              {/* TEMPERATURE */}
              <tr className="border-b border-white/10">
                <td className="p-5 font-semibold text-zinc-300">
                  Tenue température
                </td>

                {materials.map((material) => (
                  <td key={material.id} className="p-5">
                    <ScoreDots value={material.temperature} />
                  </td>
                ))}
              </tr>

              {/* UV */}
              <tr className="border-b border-white/10">
                <td className="p-5 font-semibold text-zinc-300">
                  Résistance UV
                </td>

                {materials.map((material) => (
                  <td key={material.id} className="p-5">
                    <ScoreDots value={material.uv} />
                  </td>
                ))}
              </tr>

              {/* FLEX */}
              <tr className="border-b border-white/10">
                <td className="p-5 font-semibold text-zinc-300">
                  Flexibilité
                </td>

                {materials.map((material) => (
                  <td key={material.id} className="p-5">
                    <ScoreDots value={material.flexibility} />
                  </td>
                ))}
              </tr>

              {/* FINISH */}
              <tr className="border-b border-white/10">
                <td className="p-5 font-semibold text-zinc-300">
                  Qualité finition
                </td>

                {materials.map((material) => (
                  <td key={material.id} className="p-5">
                    <ScoreDots value={material.finish} />
                  </td>
                ))}
              </tr>

              {/* BEST FOR */}
              <tr>
                <td className="p-5 font-semibold text-zinc-300">
                  Usage recommandé
                </td>

                {materials.map((material) => (
                  <td
                    key={material.id}
                    className="p-5 text-center text-zinc-200"
                  >
                    {material.bestFor}
                  </td>
                ))}
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}