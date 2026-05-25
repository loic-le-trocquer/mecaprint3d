export default function TechnologiesIntro({
  intro,
  onCompare,
}) {
  return (
    <div className="relative z-10 mb-16 max-w-5xl">

      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
        {intro.eyebrow || "Technologies"}
      </p>

      <h2 className="text-4xl font-black leading-[0.95] tracking-tight text-white md:text-6xl">
        {intro.title || "Le bon procédé pour la bonne pièce"}
      </h2>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300">
        {intro.description ||
          "Nous orientons chaque projet selon l’usage réel de la pièce, les contraintes mécaniques, le rendu attendu et le budget."}
      </p>

      <button
  type="button"
  onClick={onCompare}
  className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-6 py-3 font-bold text-orange-300 backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:border-orange-400 hover:bg-orange-500 hover:text-white"
>
  Comparer les matériaux
</button>

    </div>
  );
}