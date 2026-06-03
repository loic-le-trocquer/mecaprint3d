export default function MaterialProductSheet({ material, onClose }) {
  if (!material) return null;

  const sheet = material.productSheet || {};

  return (
    <div className="fixed inset-0 z-[230] overflow-auto bg-black/90 p-6 backdrop-blur">
      {/* ================= CLOSE ================= */}
      <button
        type="button"
        onClick={onClose}
        className="fixed right-5 top-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-black text-white transition hover:bg-orange-500"
      >
        Fermer
      </button>

      {/* ================= CONTAINER ================= */}
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-orange-500/5">
          {/* ================= HEADER ================= */}
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-400">
            Fiche matériau
          </p>

          <h2 className="text-4xl font-black text-white">
            {sheet.title || material.name}
          </h2>

          <p className="mt-2 text-zinc-400">
            {material.brand} · {sheet.type || material.category}
          </p>

          {/* ================= BADGES ================= */}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
              {material.category}
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
              Difficulté : {sheet.printDifficulty}
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
              Prix : {sheet.priceLevel}
            </span>
          </div>

          {/* ================= DESCRIPTION ================= */}
          <p className="mt-8 text-lg leading-relaxed text-zinc-300">
            {material.description}
          </p>

          {/* ================= GRID INFOS ================= */}
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <InfoCard title="Usage idéal" text={sheet.idealFor} />
            <InfoCard title="Point fort commercial" text={sheet.sellingPoint} />
            <InfoCard title="Limites" text={sheet.limits} />
            <InfoCard title="Texte devis" text={sheet.quoteText} />
          </div>

          {/* ================= PRINT SETTINGS ================= */}
          <div className="mt-10 rounded-3xl border border-white/10 bg-black/40 p-6">
            <h3 className="mb-5 text-2xl font-black text-white">
              Préconisations d’impression
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <Spec label="Buse" value={sheet.nozzle} />
              <Spec label="Diamètre conseillé" value={sheet.recommendedNozzle} />
              <Spec label="Plateau" value={sheet.bed} />
              <Spec label="Séchage" value={sheet.drying} />
            </div>
          </div>

          {/* ================= COLORS ================= */}
          <div className="mt-10">
            <h3 className="mb-4 text-xl font-black text-white">
              Coloris disponibles
            </h3>

            <div className="flex flex-wrap gap-2">
              {material.colors?.map((color) => (
                <span
                  key={color}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* ================= CTA ================= */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#devis"
              onClick={onClose}
              className="rounded-full bg-orange-500 px-6 py-3 font-black text-black transition hover:bg-orange-400"
            >
              Demander un devis
            </a>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 px-6 py-3 font-black text-white transition hover:border-orange-500 hover:text-orange-400"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function InfoCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h4 className="mb-2 text-sm font-black uppercase tracking-widest text-orange-400">
        {title}
      </h4>

      <p className="leading-relaxed text-zinc-300">
        {text}
      </p>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
      <div className="text-xs font-black uppercase tracking-widest text-zinc-500">
        {label}
      </div>

      <div className="mt-1 font-semibold text-white">
        {value}
      </div>
    </div>
  );
}