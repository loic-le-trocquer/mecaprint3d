const statuses = [
  "Tous",
  "Nouveau",
  "En analyse",
  "Devis envoyé",
  "En fabrication",
  "Terminé",
  "Refusé",
];

export default function QuoteFilters({
  statusFilter,
  setStatusFilter,
  showArchived,
  setShowArchived,
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {statuses.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => setStatusFilter(status)}
          className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
            statusFilter === status
              ? "border-orange-500 bg-orange-500 text-white"
              : "border-white/10 bg-black/30 text-zinc-300 hover:border-orange-500"
          }`}
        >
          {status}
        </button>
      ))}

      <button
        type="button"
        onClick={() => setShowArchived((value) => !value)}
        className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
          showArchived
            ? "border-purple-500 bg-purple-500 text-white"
            : "border-white/10 bg-black/30 text-zinc-300 hover:border-purple-500"
        }`}
      >
        {showArchived ? "Archivés visibles" : "Masquer archivés"}
      </button>
    </div>
  );
}