function ScoreBar({ value }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((level) => (
        <div
          key={level}
          className={`h-2 w-8 rounded-full ${
            level <= value
              ? "bg-orange-500"
              : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}


export default function MaterialModal({
  material,
  onClose,
}) {
  if (!material) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur">

      {/* CLOSE */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-black text-white transition hover:bg-orange-500"
      >
        Fermer
      </button>

      {/* CONTENT */}
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">

        {/* HEADER */}
        <div className="border-b border-white/10 bg-gradient-to-r from-orange-500/20 to-transparent p-8">

          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            {material.family}
          </p>

          <h2 className="mt-2 text-4xl font-black text-white">
            {material.name}
          </h2>

          <p className="mt-4 max-w-2xl text-zinc-300">
            {material.shortDescription}
          </p>

        </div>

        {/* BODY */}
        <div className="grid gap-8 p-8 md:grid-cols-2">

          {/* LEFT */}
          <div>

            <h3 className="mb-4 text-xl font-black text-white">
              Caractéristiques
            </h3>

            <div className="space-y-5">

              <div>
                <div className="mb-1 text-sm text-zinc-400">
                  Résistance mécanique
                </div>
                <ScoreBar value={material.resistance} />
              </div>

              <div>
                <div className="mb-1 text-sm text-zinc-400">
                  Tenue température
                </div>
                <ScoreBar value={material.temperature} />
              </div>

              <div>
                <div className="mb-1 text-sm text-zinc-400">
                  Résistance UV
                </div>
                <ScoreBar value={material.uv} />
              </div>

              <div>
                <div className="mb-1 text-sm text-zinc-400">
                  Flexibilité
                </div>
                <ScoreBar value={material.flexibility} />
              </div>

              <div>
                <div className="mb-1 text-sm text-zinc-400">
                  Qualité finition
                </div>
                <ScoreBar value={material.finish} />
              </div>

            </div>

            <div className="mt-8 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
                Recommandé pour
              </p>

              <p className="mt-2 text-lg font-semibold text-white">
                {material.bestFor}
              </p>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <div>
              <h3 className="mb-3 text-xl font-black text-white">
                Avantages
              </h3>

              <ul className="space-y-2 text-zinc-300">
                {material.advantages?.map((item) => (
                  <li key={item}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-black text-white">
                Limites
              </h3>

              <ul className="space-y-2 text-zinc-300">
                {material.limits?.map((item) => (
                  <li key={item}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-black text-white">
                Applications
              </h3>

              <div className="flex flex-wrap gap-2">
                {material.applications?.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-black text-white">
                Finitions compatibles
              </h3>

              <div className="flex flex-wrap gap-2">
                {material.finishing?.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-sm text-orange-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}