const statuses = [
  "Tous",
  "Nouveau",
  "En analyse",
  "Devis envoyé",
  "En fabrication",
  "Terminé",
  "Refusé",
];

const statusStyles = {
  Tous: "from-zinc-500/20 to-white/5 border-white/10 text-white",
  Nouveau: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-200",
  "En analyse": "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-200",
  "Devis envoyé": "from-green-500/20 to-green-500/5 border-green-500/30 text-green-200",
  "En fabrication": "from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-200",
  Terminé: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-200",
  Refusé: "from-red-500/20 to-red-500/5 border-red-500/30 text-red-200",
};

export default function QuoteFilters({
  statusFilter,
  setStatusFilter,
  showArchived,
  setShowArchived,
  quotes,
}) {
  // =====================================================
  // COUNTERS
  // =====================================================
  const getCount = (status) => {
    if (status === "Tous") {
      return quotes.filter(
        (quote) =>
          showArchived ? true : quote.archived !== true
      ).length;
    }

    return quotes.filter(
      (quote) =>
        quote.status === status &&
        (showArchived ? true : quote.archived !== true)
    ).length;
  };

  return (
    <div className="mb-6 rounded-[28px] border border-white/10 bg-zinc-900/70 p-4 backdrop-blur-xl">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-400">
            Filtres rapides
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            Filtrer les demandes par état commercial.
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => {
          const active = statusFilter === status;

          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`group rounded-2xl border px-4 py-3 transition duration-300 hover:-translate-y-1 ${
                active
                  ? `bg-gradient-to-br ${statusStyles[status]} shadow-lg shadow-black/30`
                  : "border-white/10 bg-black/30 hover:border-orange-500/40"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* LABEL */}
                <span
                  className={`text-sm font-black ${
                    active
                      ? "text-white"
                      : "text-zinc-300 group-hover:text-white"
                  }`}
                >
                  {status}
                </span>

                {/* COUNT */}
                <div
                  className={`min-w-[34px] rounded-full px-2 py-1 text-center text-xs font-black ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-zinc-400 group-hover:bg-orange-500/20 group-hover:text-orange-200"
                  }`}
                >
                  {getCount(status)}
                </div>
              </div>
            </button>
          );
        })}

        {/* ARCHIVES */}
        <button
          type="button"
          onClick={() => setShowArchived((value) => !value)}
          className={`group rounded-2xl border px-4 py-3 transition duration-300 hover:-translate-y-1 ${
            showArchived
              ? "border-purple-500/40 bg-purple-500/20 shadow-lg shadow-black/30"
              : "border-white/10 bg-black/30 hover:border-purple-500/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-black ${
                showArchived
                  ? "text-white"
                  : "text-zinc-300 group-hover:text-white"
              }`}
            >
              {showArchived
                ? "Archivés visibles"
                : "Archivés masqués"}
            </span>

            <div
              className={`min-w-[34px] rounded-full px-2 py-1 text-center text-xs font-black ${
                showArchived
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-zinc-400"
              }`}
            >
              {
                quotes.filter(
                  (quote) => quote.archived === true
                ).length
              }
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}