import QuoteStatusSelect from "./QuoteStatusSelect";
import QuoteAdminNotes from "./QuoteAdminNotes";
import QuoteFiles from "./QuoteFiles";
import { API_URL } from "../../lib/api";


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

{/* PDF */}
<button
  type="button"

  onClick={async () => {

    try {

      const token =
        localStorage.getItem(
          "mecaprint3d_admin_token"
        );

      const response = await fetch(
        `${API_URL}/api/quotes/${quote._id}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `devis-${quote._id}.pdf`;

      link.click();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(error);

    }

  }}

  className="
    mt-3 block w-full rounded-xl
    border border-orange-500/30
    bg-orange-500/10
    px-4 py-2 text-center
    text-sm font-bold text-orange-300
    transition hover:bg-orange-500/20
  "
>
  Générer PDF
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
<div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
  <p className="mb-4 text-sm font-bold uppercase tracking-widest text-orange-400">
    Devis commercial
  </p>

  <p className="text-zinc-400">
    Bloc devis temporairement désactivé pour sécuriser le déploiement.
  </p>

  <p className="mt-3 text-xs text-zinc-500">
    TVA non applicable — art. 293 B du CGI
  </p>
</div>
      {/* FICHIERS */}
      <QuoteFiles files={quote.files} />

    </div>
  );
}
