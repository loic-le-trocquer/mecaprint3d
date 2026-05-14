export default function MaterialBadge({ material, onClick }) {
  if (!material) return null;

  return (
    <button
      type="button"
      onClick={() => onClick?.(material)}
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:border-orange-500/60 hover:bg-orange-500/10 hover:text-orange-300"
    >
      {material.name}
    </button>
  );
}