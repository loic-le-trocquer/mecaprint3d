// =====================================================
// 📦 IMPORTS
// =====================================================
const statuses = [
  "Tous",
  "Nouveau",
  "En analyse",
  "Devis envoyé",
  "En fabrication",
  "Terminé",
  "Refusé",
];

// =====================================================
// 🎨 STATUS COLORS
// =====================================================
const statusStyles = {
  Tous:
    "border-white/10 bg-zinc-900/80 text-white",

  Nouveau:
    "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",

  "En analyse":
    "border-amber-500/20 bg-amber-500/10 text-amber-300",

  "Devis envoyé":
    "border-green-500/20 bg-green-500/10 text-green-300",

  "En fabrication":
    "border-orange-500/20 bg-orange-500/10 text-orange-300",

  Terminé:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",

  Refusé:
    "border-red-500/20 bg-red-500/10 text-red-300",
};

// =====================================================
// 📊 KPI FILTERS COMPONENT
// =====================================================
export default function QuoteFilters({
  statusFilter,
  setStatusFilter,
  showArchived,
  setShowArchived,
  quotes,
}) {

  // =====================================================
  // 📈 COUNTERS
  // =====================================================
  const getCount = (status) => {

    // ================= TOUS =================
    if (status === "Tous") {

      return quotes.filter(
        (quote) =>
          showArchived
            ? true
            : quote.archived !== true
      ).length;

    }

    // ================= STATUS =================
    return quotes.filter(
      (quote) =>
        quote.status === status &&
        (
          showArchived
            ? true
            : quote.archived !== true
        )
    ).length;

  };

  // =====================================================
  // 🧾 RENDER
  // =====================================================
  return (

    <div className="mb-10">

      {/* =====================================================
          KPI GRID
      ===================================================== */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* =====================================================
            KPI STATUS
        ===================================================== */}
        {statuses.map((status) => {

          const active =
            statusFilter === status;

          return (

            <button
              key={status}
              type="button"
              onClick={() =>
                setStatusFilter(status)
              }
              className={`
                rounded-[28px]
                border
                p-6
                text-left
                shadow-xl
                shadow-black/20
                transition
                duration-300
                hover:-translate-y-1
                hover:scale-[1.01]
                ${
                  statusStyles[status]
                }
                ${
                  active
                    ? "ring-2 ring-orange-400 shadow-[0_0_35px_rgba(249,115,22,0.25)]"
                    : ""
                }
              `}
            >

              {/* LABEL */}
              <p className="text-xs font-black uppercase tracking-[0.25em]">

                {status}

              </p>

              {/* VALUE */}
              <h2 className="mt-4 text-5xl font-black text-white">

                {getCount(status)}

              </h2>

            </button>

          );

        })}

        {/* =====================================================
            KPI ARCHIVES
        ===================================================== */}
        <button
          type="button"
          onClick={() =>
            setShowArchived(
              (value) => !value
            )
          }
          className={`
            rounded-[28px]
            border
            p-6
            text-left
            shadow-xl
            shadow-black/20
            transition
            duration-300
            hover:-translate-y-1
            hover:scale-[1.01]
            ${
              showArchived
                ? "border-purple-500/30 bg-purple-500/10 text-purple-300 ring-2 ring-purple-400"
                : "border-white/10 bg-zinc-900/80 text-zinc-300"
            }
          `}
        >

          {/* LABEL */}
          <p className="text-xs font-black uppercase tracking-[0.25em]">

            {showArchived
              ? "Archivés visibles"
              : "Archivés masqués"}

          </p>

          {/* VALUE */}
          <h2 className="mt-4 text-5xl font-black text-white">

            {
              quotes.filter(
                (quote) =>
                  quote.archived === true
              ).length
            }

          </h2>

        </button>

      </div>

    </div>

  );
}