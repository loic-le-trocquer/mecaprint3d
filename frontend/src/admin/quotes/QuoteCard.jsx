// ================= IMPORTS =================
import QuoteStatusSelect from "./QuoteStatusSelect";
import QuoteFiles from "./QuoteFiles";
import QuoteAdminNotes from "./QuoteAdminNotes";
import QuoteCommercial from "./QuoteCommercial";

// ================= STATUS COLORS =================
const statusConfig = {
  nouveau: {
    label: "Nouveau",
    className:
      "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  },

  en_cours: {
    label: "En cours",
    className:
      "border-orange-500/30 bg-orange-500/10 text-orange-300",
  },

  valide: {
    label: "Validé",
    className:
      "border-green-500/30 bg-green-500/10 text-green-300",
  },

  termine: {
    label: "Terminé",
    className:
      "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
  },

  archive: {
    label: "Archivé",
    className:
      "border-red-500/20 bg-red-500/10 text-red-300",
  },
};

// ================= COMPONENT =================
export default function QuoteCard({
  quote,
  setQuotes,
  onUpdate,
}) {

  // ================= STATUS =================
  const status =
    statusConfig[quote.status] ||
    statusConfig.nouveau;

  // ================= FILES =================
  const hasFiles =
    quote.files?.length > 0;

  // ================= PROJECT TYPE =================
  const isCovering =
    quote.project ===
    "Covering intérieur";

  const isVan =
    quote.project ===
    "Van / camping-car";

  const isPrint =
    quote.project ===
    "Impression 3D";

  // ================= RENDER =================
  return (

    <article className="overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900/80 shadow-[0_0_45px_rgba(0,0,0,0.25)] backdrop-blur-xl">

      {/* ================= TOP ================= */}
      <div className="border-b border-white/10 p-6">

        {/* HEADER */}
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

          {/* CLIENT */}
          <div>

            <div className="flex flex-wrap items-center gap-3">

              {/* STATUS */}
              <div
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.25em] ${status.className}`}
              >

                {status.label}

              </div>

              {/* FILES */}
              {hasFiles && (

                <div className="rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-orange-300">

                  {quote.files.length} fichier(s)

                </div>

              )}

              {/* PROJECT */}
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-zinc-300">

                {quote.project}

              </div>

            </div>

            {/* NAME */}
            <h2 className="mt-5 text-3xl font-black text-white">

              {quote.name}

            </h2>

            {/* CONTACT */}
            <div className="mt-4 flex flex-col gap-2 text-zinc-400">

              <p>
                📧 {quote.email}
              </p>

              {quote.phone && (
                <p>
                  📞 {quote.phone}
                </p>
              )}

            </div>

          </div>

          {/* STATUS SELECT */}
          <div className="xl:min-w-[240px]">

            <QuoteStatusSelect
              quote={quote}
              setQuotes={setQuotes}
              onUpdate={onUpdate}
            />

          </div>

        </div>

        {/* ================= INFOS PROJET ================= */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          {/* QUANTITE */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-400">
              Quantité
            </p>

            <p className="mt-3 text-xl font-black text-white">

              {quote.quantity || "—"}

            </p>

          </div>

          {/* MATIERE */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-400">
              Matière
            </p>

            <p className="mt-3 text-xl font-black text-white">

              {quote.material || "À définir"}

            </p>

          </div>

          {/* DIMENSIONS */}
          {isPrint && (

            <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-5">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                Dimensions
              </p>

              <p className="mt-3 text-xl font-black text-white">

                {quote.dimensions || "—"}

              </p>

            </div>

          )}

          {/* SURFACE */}
          {(isCovering || isVan) && (

            <div className="rounded-2xl border border-orange-500/10 bg-orange-500/5 p-5">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">
                Surface
              </p>

              <p className="mt-3 text-xl font-black text-white">

                {quote.surface || "—"}

              </p>

            </div>

          )}

          {/* VEHICULE */}
          {isVan && (

            <div className="rounded-2xl border border-purple-500/10 bg-purple-500/5 p-5">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-purple-300">
                Véhicule
              </p>

              <p className="mt-3 text-xl font-black text-white">

                {quote.vehicle || "—"}

              </p>

            </div>

          )}

          {/* COVER STYL */}
          {isCovering && (

            <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-5">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
                COVER STYL
              </p>

              <p className="mt-3 text-xl font-black text-white">

                {quote.coveringReference || "—"}

              </p>

            </div>

          )}

        </div>

      </div>

      {/* ================= MESSAGE ================= */}
      <div className="border-b border-white/10 p-6">

        <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-orange-400">

          Description du projet

        </p>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-zinc-300">

          {quote.message || "Aucun message."}

        </div>

      </div>

      {/* ================= FILES ================= */}
      {hasFiles && (

        <div className="border-b border-white/10 p-6">

          <QuoteFiles quote={quote} />

        </div>

      )}

      {/* ================= COMMERCIAL ================= */}
      <div className="border-b border-white/10 p-6">

        <QuoteCommercial
          quote={quote}
          setQuotes={setQuotes}
          onUpdate={onUpdate}
        />

      </div>

      {/* ================= NOTES ================= */}
      <div className="p-6">

        <QuoteAdminNotes
          quote={quote}
          setQuotes={setQuotes}
          onUpdate={onUpdate}
        />

      </div>

    </article>

  );
}