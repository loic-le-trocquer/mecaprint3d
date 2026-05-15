export default function TechnologiesIntro({
  intro,
  onCompare,
}) {
  return (
    <div className="mb-16 max-w-4xl">

      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
        {intro.eyebrow || "Technologies"}
      </p>

      <h2 className="text-4xl font-black leading-tight md:text-6xl">
        {intro.title || "Le bon procédé pour la bonne pièce"}
      </h2>

      <p className="mt-6 text-lg leading-relaxed text-zinc-300">
        {intro.description ||
          "Nous orientons chaque projet selon l’usage réel de la pièce, les contraintes mécaniques, le rendu attendu et le budget."}
      </p>

      <button
        type="button"
        onClick={onCompare}
        className="mt-8 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-6 py-3 font-bold text-orange-300 transition hover:bg-orange-500 hover:text-white"
      >
        Comparer les matériaux
      </button>

    </div>
  );
}