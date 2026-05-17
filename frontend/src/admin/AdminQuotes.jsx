import { useEffect, useState } from "react";
import { API_URL } from "../lib/api";
import AdminLayout from "./AdminLayout";


export default function AdminQuotes() {

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [showArchived, setShowArchived] = useState(false);
  
const updateQuote = async (
  id,
  updates
) => {

  try {

    const token =
      localStorage.getItem(
        "mecaprint3d_admin_token"
      );

    const response = await fetch(
      `${API_URL}/api/quotes/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(updates),
      }
    );

    const data = await response.json();

    if (!data.success) return;

    setQuotes((current) =>
      current.map((quote) =>
        quote._id === id
          ? data.quote
          : quote
      )
    );

  } catch (error) {

    console.error(error);

  }

};

  useEffect(() => {

    const loadQuotes = async () => {

      try {

        const token =
          localStorage.getItem(
            "mecaprint3d_admin_token"
          );

        const response = await fetch(
          `${API_URL}/api/quotes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setQuotes(data.quotes || []);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    loadQuotes();

  }, []);

const statusColors = {
  "Nouveau":
    "bg-blue-500/20 text-blue-300",

  "En analyse":
    "bg-yellow-500/20 text-yellow-300",

  "Devis envoyé":
    "bg-purple-500/20 text-purple-300",

  "En fabrication":
    "bg-orange-500/20 text-orange-300",

  "Terminé":
    "bg-green-500/20 text-green-300",

  "Refusé":
    "bg-red-500/20 text-red-300",
};

const filteredQuotes = quotes.filter((quote) => {
  const matchStatus =
    statusFilter === "Tous" || quote.status === statusFilter;

  const matchArchive =
    showArchived ? true : !quote.archived;

  return matchStatus && matchArchive;
});

  return (
  <AdminLayout title="Demandes de devis">

        {/* LOADING */}
        {loading && (
          <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-10 text-center text-zinc-400">
            Chargement des devis...
          </div>
        )}

        {/* EMPTY */}
        {!loading && quotes.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-10 text-center text-zinc-400">
            Aucun devis disponible.
          </div>
        )}

{/* FILTRES */}
<div className="mb-6 flex flex-wrap gap-3">
  {[
    "Tous",
    "Nouveau",
    "En analyse",
    "Devis envoyé",
    "En fabrication",
    "Terminé",
    "Refusé",
  ].map((status) => (
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

        {/* LISTE */}
        <div className="grid gap-6">

          {filteredQuotes.map((quote) => (

            <div
              key={quote._id}
              className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6"
            >

              {/* TOP */}
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                <div>

{/* ===================================================== */
/* 🏷️ TITRE + STATUT */
/* ===================================================== */}
<div className="flex flex-wrap items-center gap-3">

  {/* TITRE PROJET */}
  <h2 className="text-2xl font-black">
    {quote.project}
  </h2>

  {/* SELECT STATUT */}
  <select
    value={quote.status}

    onChange={(e) =>
      updateQuote(
        quote._id,
        {
          status: e.target.value,
          adminNotes:
            quote.adminNotes,
          archived:
            quote.archived,
        }
      )
    }

    className={`
      rounded-full
      border border-white/10
      px-4 py-2
      text-sm font-bold
      outline-none
      ${statusColors[quote.status]}
    `}
  >

    <option value="Nouveau">
      Nouveau
    </option>

    <option value="En analyse">
      En analyse
    </option>

    <option value="Devis envoyé">
      Devis envoyé
    </option>

    <option value="En fabrication">
      En fabrication
    </option>

    <option value="Terminé">
      Terminé
    </option>

    <option value="Refusé">
      Refusé
    </option>

  </select>

                  </div>

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
                      📅 {new Date(
                        quote.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">

                  <p>
                    <strong>Quantité :</strong>{" "}
                    {quote.quantity || "—"}
                  </p>

<button
  type="button"
  onClick={() =>
    updateQuote(quote._id, {
      status: quote.status,
      adminNotes: quote.adminNotes,
      archived: !quote.archived,
    })
  }
  className={`mt-3 rounded-xl border px-4 py-2 text-sm font-bold transition ${
    quote.archived
      ? "border-green-500/40 text-green-300 hover:bg-green-500/10"
      : "border-white/10 text-zinc-300 hover:border-red-500 hover:text-red-300"
  }`}
>
  {quote.archived ? "Désarchiver" : "Archiver"}
</button>

                  <p className="mt-1">
                    <strong>Matière :</strong>{" "}
                    {quote.material || "—"}
                  </p>

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

              {/* FILES */}
              {quote.files?.length > 0 && (

                <div className="mt-6">

                  <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-400">
                    Fichiers
                  </p>

                  <div className="flex flex-wrap gap-3">

                    {quote.files.map((file) => (

                      <a
                        key={file.path}
                        href={file.path}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-200 hover:border-orange-500"
                      >
                        {file.originalName}
                      </a>

                    ))}

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

        </AdminLayout>

  );
}