import QuoteStatusSelect from "./QuoteStatusSelect";
import QuoteAdminNotes from "./QuoteAdminNotes";
import QuoteFiles from "./QuoteFiles";

export default function QuoteCard({
  quote,
  setQuotes,
  onUpdate,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6">

      {/* TOP */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

        <div>

          {/* TITRE + STATUT */}
          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-2xl font-black">
              {quote.project}
            </h2>

            <QuoteStatusSelect
              quote={quote}
              onUpdate={onUpdate}
            />

          </div>

          {/* INFOS CLIENT */}
          <div className="mt-3 space-y-1 text-sm text-zinc-400">

            <p>
              👤 {quote.name}
            </p>

            <p>
              📧 {quote.email}
            </p>

            {quote.phone && (
              <p>
                📱 {quote.phone}
              </p>
            )}

            <p>
              📅{" "}
              {new Date(
                quote.createdAt
              ).toLocaleString()}
            </p>

          </div>

        </div>

        {/* INFOS PROJET */}
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">

          <p>
            <strong>Quantité :</strong>{" "}
            {quote.quantity || "—"}
          </p>

          <p className="mt-1">
            <strong>Matière :</strong>{" "}
            {quote.material || "—"}
          </p>

          {/* ARCHIVE */}
          <button
            type="button"

            onClick={() =>
              onUpdate(quote._id, {
                status: quote.status,
                adminNotes: quote.adminNotes,
                archived: !quote.archived,
              })
            }

            className={`
              mt-4 w-full rounded-xl border px-4 py-2
              text-sm font-bold transition

              ${
                quote.archived
                  ? "border-green-500/40 text-green-300 hover:bg-green-500/10"
                  : "border-white/10 text-zinc-300 hover:border-red-500 hover:text-red-300"
              }
            `}
          >
            {quote.archived
              ? "Désarchiver"
              : "Archiver"}
          </button>

        </div>

      </div>

      {/* MESSAGE */}
      {quote.message && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">

          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-orange-400">
            Message client
          </p>

          <p className="whitespace-pre-wrap text-zinc-300">
            {quote.message}
          </p>

        </div>
      )}

      {/* NOTES ADMIN */}
      <QuoteAdminNotes
        quote={quote}
        setQuotes={setQuotes}
        onUpdate={onUpdate}
      />
{/* ===================================================== */}
{/* 💰 DEVIS COMMERCIAL */}
{/* ===================================================== */}
<div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">

  <p className="mb-4 text-sm font-bold uppercase tracking-widest text-orange-400">
    Devis commercial
  </p>

  <div className="grid gap-4 md:grid-cols-2">

    {/* MONTANT */}
    <div>
      <p className="mb-2 text-sm text-zinc-400">
        Montant (€)
      </p>

      <input
        type="number"

        value={quote.quoteAmount || 0}

        onChange={(e) => {

          const value = e.target.value;

          setQuotes((current) =>
            current.map((item) =>
              item._id === quote._id
                ? {
                    ...item,
                    quoteAmount: value,
                  }
                : item
            )
          );

        }}

        onBlur={() =>
          onUpdate(quote._id, {
            status: quote.status,
            adminNotes: quote.adminNotes,
            archived: quote.archived,
            quoteAmount: quote.quoteAmount,
            quoteDelay: quote.quoteDelay,
            quoteComment: quote.quoteComment,
          })
        }

        className="
          w-full rounded-xl border border-white/10
          bg-zinc-950 px-4 py-3
          text-white outline-none
          focus:border-orange-500
        "
      />
    </div>

    {/* DELAI */}
    <div>
      <p className="mb-2 text-sm text-zinc-400">
        Délai
      </p>

      <input
        type="text"

        value={quote.quoteDelay || ""}

        onChange={(e) => {

          const value = e.target.value;

          setQuotes((current) =>
            current.map((item) =>
              item._id === quote._id
                ? {
                    ...item,
                    quoteDelay: value,
                  }
                : item
            )
          );

        }}

        onBlur={() =>
          onUpdate(quote._id, {
            status: quote.status,
            adminNotes: quote.adminNotes,
            archived: quote.archived,
            quoteAmount: quote.quoteAmount,
            quoteDelay: quote.quoteDelay,
            quoteComment: quote.quoteComment,
          })
        }

        placeholder="Ex : 5 jours"

        className="
          w-full rounded-xl border border-white/10
          bg-zinc-950 px-4 py-3
          text-white outline-none
          focus:border-orange-500
        "
      />
    </div>

  </div>

  {/* COMMENTAIRE */}
  <div className="mt-4">

    <p className="mb-2 text-sm text-zinc-400">
      Commentaire commercial
    </p>

    <textarea
      rows="4"

      value={quote.quoteComment || ""}

      onChange={(e) => {

        const value = e.target.value;

        setQuotes((current) =>
          current.map((item) =>
            item._id === quote._id
              ? {
                  ...item,
                  quoteComment: value,
                }
              : item
          )
        );

      }}

      onBlur={() =>
        onUpdate(quote._id, {
          status: quote.status,
          adminNotes: quote.adminNotes,
          archived: quote.archived,
          quoteAmount: quote.quoteAmount,
          quoteDelay: quote.quoteDelay,
          quoteComment: quote.quoteComment,
        })
      }

      placeholder="Informations complémentaires..."

      className="
        w-full rounded-2xl border border-white/10
        bg-zinc-950 p-4
        text-white outline-none
        focus:border-orange-500
      "
    />

  </div>

</div>
      {/* FICHIERS */}
      <QuoteFiles files={quote.files} />

    </div>
  );
}