import { useEffect, useState } from "react";

import { API_URL } from "../lib/api";

import AdminLayout from "./AdminLayout";

import QuoteCard from "./quotes/QuoteCard";
import QuoteFilters from "./quotes/QuoteFilters";

export default function AdminQuotes() {

  // =====================================================
  // STATES
  // =====================================================
  const [quotes, setQuotes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] =
    useState("Tous");

  const [showArchived, setShowArchived] =
    useState(false);

  const [search, setSearch] =
    useState("");  

  // =====================================================
  // LOAD QUOTES
  // =====================================================
  useEffect(() => {

    const loadQuotes = async () => {

      try {

        const token = localStorage.getItem(
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

  // =====================================================
  // UPDATE QUOTE
  // =====================================================
  const updateQuote = async (
    id,
    updates
  ) => {

    try {

      const token = localStorage.getItem(
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

  // =====================================================
  // FILTERS
  // =====================================================
  const filteredQuotes = quotes.filter((quote) => {
  const matchStatus =
    statusFilter === "Tous" ||
    quote.status === statusFilter;

  const matchArchive =
    showArchived
      ? true
      : quote.archived !== true;

  const searchText = [
    quote.name,
    quote.email,
    quote.phone,
    quote.project,
    quote.material,
    quote.surface,
    quote.vehicle,
    quote.coveringReference,
    quote.dimensions,
    quote.message,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matchSearch =
    !search.trim() ||
    searchText.includes(search.toLowerCase());

  return matchStatus && matchArchive && matchSearch;
});


// ================= KPI =================
const totalQuotes =
  quotes.length;

const newQuotes =
  quotes.filter(
    (q) => q.status === "nouveau"
  ).length;

const inProgressQuotes =
  quotes.filter(
    (q) => q.status === "en_cours"
  ).length;

const validatedQuotes =
  quotes.filter(
    (q) => q.status === "valide"
  ).length;

const withFilesQuotes =
  quotes.filter(
    (q) => q.files?.length
  ).length;

const coveringQuotes =
  quotes.filter(
    (q) =>
      q.project ===
      "Covering intérieur"
  ).length;

const printQuotes =
  quotes.filter(
    (q) =>
      q.project ===
      "Impression 3D"
  ).length;

const vanQuotes =
  quotes.filter(
    (q) =>
      q.project ===
      "Van / camping-car"
  ).length;


  // =====================================================
  // RENDER
  // =====================================================
  return (

    <AdminLayout title="Demandes de devis">

      {/* LOADING */}
      {loading && (
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-10 text-center text-zinc-400">
          Chargement des devis...
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        filteredQuotes.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-10 text-center text-zinc-400">
            Aucun devis disponible.
          </div>
        )}

      {/* FILTERS */}
      <div className="mb-8 rounded-3xl border border-white/10 bg-zinc-900/70 p-5">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Rechercher un devis : nom, email, projet, véhicule, CoverStyl..."
    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-500"
  />
</div>

{/* ================= KPI ================= */}
<div className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

  {/* TOTAL */}
  <div className="rounded-[28px] border border-white/10 bg-zinc-900/70 p-6 backdrop-blur-xl">

    <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-400">
      Total devis
    </p>

    <h2 className="mt-4 text-5xl font-black text-white">
      {totalQuotes}
    </h2>

  </div>

  {/* NOUVEAUX */}
  <div className="rounded-[28px] border border-cyan-500/10 bg-cyan-500/5 p-6">

    <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
      Nouveaux
    </p>

    <h2 className="mt-4 text-5xl font-black text-white">
      {newQuotes}
    </h2>

  </div>

  {/* EN COURS */}
  <div className="rounded-[28px] border border-orange-500/10 bg-orange-500/5 p-6">

    <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">
      En cours
    </p>

    <h2 className="mt-4 text-5xl font-black text-white">
      {inProgressQuotes}
    </h2>

  </div>

  {/* VALIDES */}
  <div className="rounded-[28px] border border-green-500/10 bg-green-500/5 p-6">

    <p className="text-xs font-black uppercase tracking-[0.25em] text-green-300">
      Validés
    </p>

    <h2 className="mt-4 text-5xl font-black text-white">
      {validatedQuotes}
    </h2>

  </div>

</div>

{/* ================= KPI 2 ================= */}
<div className="mb-12 grid gap-5 md:grid-cols-3 xl:grid-cols-4">

  {/* FICHIERS */}
  <div className="rounded-[24px] border border-orange-500/10 bg-orange-500/5 p-5">

    <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">
      Avec fichiers
    </p>

    <p className="mt-3 text-3xl font-black text-white">
      {withFilesQuotes}
    </p>

  </div>

  {/* COVERING */}
  <div className="rounded-[24px] border border-amber-500/10 bg-amber-500/5 p-5">

    <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
      Covering
    </p>

    <p className="mt-3 text-3xl font-black text-white">
      {coveringQuotes}
    </p>

  </div>

  {/* PRINT */}
  <div className="rounded-[24px] border border-cyan-500/10 bg-cyan-500/5 p-5">

    <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
      Impression 3D
    </p>

    <p className="mt-3 text-3xl font-black text-white">
      {printQuotes}
    </p>

  </div>

  {/* VAN */}
  <div className="rounded-[24px] border border-purple-500/10 bg-purple-500/5 p-5">

    <p className="text-xs font-black uppercase tracking-[0.25em] text-purple-300">
      Vans
    </p>

    <p className="mt-3 text-3xl font-black text-white">
      {vanQuotes}
    </p>

  </div>

</div>
{/* ================= LISTE DEVIS ================= */}

<div className="grid gap-6">

  {filteredQuotes.map((quote) => (

    <QuoteCard
      key={quote._id}
      quote={quote}
      setQuotes={setQuotes}
      onUpdate={updateQuote}
    />

  ))}

</div>
      {/* LISTE */}
      <div className="grid gap-6">

        {filteredQuotes.map((quote) => (

          <QuoteCard
            key={quote._id}
            quote={quote}
            setQuotes={setQuotes}
            onUpdate={updateQuote}
          />

        ))}

      </div>

    </AdminLayout>

  );
}