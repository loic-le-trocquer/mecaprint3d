// ================= IMPORTS =================
import QuoteStatusSelect from "./QuoteStatusSelect";
import QuoteFiles from "./QuoteFiles";
import QuoteAdminNotes from "./QuoteAdminNotes";
import QuoteCommercial from "./QuoteCommercial";

// ================= STATUS CONFIG =================
const statusConfig = {
  Nouveau: {
    label: "Nouveau",
    className: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  },
  "En analyse": {
    label: "En analyse",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  "Devis envoyé": {
    label: "Devis envoyé",
    className: "border-green-500/30 bg-green-500/10 text-green-300",
  },
  "En fabrication": {
    label: "En fabrication",
    className: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  },
  Terminé: {
    label: "Terminé",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  Refusé: {
    label: "Refusé",
    className: "border-red-500/30 bg-red-500/10 text-red-300",
  },

  // Compatibilité anciens statuts
  nouveau: {
    label: "Nouveau",
    className: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  },
  en_cours: {
    label: "En analyse",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  valide: {
    label: "Devis envoyé",
    className: "border-green-500/30 bg-green-500/10 text-green-300",
  },
  termine: {
    label: "Terminé",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
};

export default function QuoteCard({ quote, setQuotes, onUpdate }) {
  const status = statusConfig[quote.status] || statusConfig.Nouveau;
  const hasFiles = quote.files?.length > 0;

  const isCovering = quote.project === "Covering intérieur";
  const isVan = quote.project === "Van / camping-car";
  const isPrint = quote.project === "Impression 3D";

  const createdDate = quote.createdAt
    ? new Date(quote.createdAt).toLocaleDateString("fr-FR")
    : "Date inconnue";

  return (
    <article className="overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black shadow-[0_0_45px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:border-orange-500/30">
      {/* HEADER */}
      <div className="border-b border-white/10 p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={status.className}>{status.label}</Badge>

              {hasFiles && (
                <Badge className="border-orange-500/20 bg-orange-500/10 text-orange-300">
                  {quote.files.length} fichier(s)
                </Badge>
              )}

              {quote.archived && (
                <Badge className="border-purple-500/20 bg-purple-500/10 text-purple-300">
                  Archivé
                </Badge>
              )}

              <Badge className="border-white/10 bg-white/5 text-zinc-300">
                {quote.project || "Projet non renseigné"}
              </Badge>

              <Badge className="border-white/10 bg-black/30 text-zinc-400">
                {createdDate}
              </Badge>
            </div>

            <h2 className="mt-5 text-3xl font-black text-white">
              {quote.name || "Client non renseigné"}
            </h2>

            <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-2">
              <ContactLine label="Email" value={quote.email} />
              <ContactLine label="Téléphone" value={quote.phone} />
            </div>
          </div>

          <div className="xl:min-w-[260px]">
            <QuoteStatusSelect
              quote={quote}
              setQuotes={setQuotes}
              onUpdate={onUpdate}
            />
          </div>
        </div>

        {/* INFOS PROJET */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoBox label="Quantité" value={quote.quantity || "—"} />
          <InfoBox label="Matière" value={quote.material || "À définir"} />

          {isPrint && (
            <InfoBox
              label="Dimensions"
              value={quote.dimensions || "—"}
              color="cyan"
            />
          )}

          {(isCovering || isVan) && (
            <InfoBox
              label="Surface"
              value={quote.surface || "—"}
              color="orange"
            />
          )}

          {isVan && (
            <InfoBox
              label="Véhicule"
              value={quote.vehicle || "—"}
              color="purple"
            />
          )}

          {isCovering && (
            <InfoBox
              label="Cover Styl"
              value={quote.coveringReference || "—"}
              color="amber"
            />
          )}
        </div>
      </div>

      {/* MESSAGE */}
      <Section title="Description du projet">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 leading-relaxed text-zinc-300">
          {quote.message || "Aucun message."}
        </div>
      </Section>

      {/* FILES */}
      {hasFiles && (
        <Section title="Fichiers client">
          <QuoteFiles quote={quote} />
        </Section>
      )}

      {/* COMMERCIAL */}
      <Section title="Chiffrage commercial">
        <QuoteCommercial
          quote={quote}
          setQuotes={setQuotes}
          onUpdate={onUpdate}
        />
      </Section>

      {/* NOTES */}
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

// ================= SMALL COMPONENTS =================
function Badge({ children, className }) {
  return (
    <div
      className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.22em] ${className}`}
    >
      {children}
    </div>
  );
}

function ContactLine({ label, value }) {
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 font-bold text-zinc-200">{value}</p>
    </div>
  );
}

function InfoBox({ label, value, color = "orange" }) {
  const colors = {
    orange: "border-orange-500/10 bg-orange-500/5 text-orange-300",
    cyan: "border-cyan-500/10 bg-cyan-500/5 text-cyan-300",
    purple: "border-purple-500/10 bg-purple-500/5 text-purple-300",
    amber: "border-amber-500/10 bg-amber-500/5 text-amber-300",
  };

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <p className="text-xs font-black uppercase tracking-[0.25em]">
        {label}
      </p>
      <p className="mt-3 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border-b border-white/10 p-6">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-orange-400">
        {title}
      </p>
      {children}
    </div>
  );
}