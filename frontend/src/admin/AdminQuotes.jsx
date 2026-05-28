// ================= IMPORTS =================
import { useEffect, useMemo, useState } from "react";

import { API_URL } from "../lib/api";

import AdminLayout from "./AdminLayout";

import QuoteCard from "./quotes/QuoteCard";
import QuoteFilters from "./quotes/QuoteFilters";
import CreateQuoteModal from "./quotes/CreateQuoteModal";

// ================= ADMIN QUOTES =================
export default function AdminQuotes() {
  // =====================================================
  // STATES
  // =====================================================
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createModal, setCreateModal] = useState(false);

  const [statusFilter, setStatusFilter] = useState("Tous");
  const [projectFilter, setProjectFilter] = useState("Tous");
  const [sortOrder, setSortOrder] = useState("recent");
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState("");

  // =====================================================
  // LOAD QUOTES
  // =====================================================
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const token = localStorage.getItem("mecaprint3d_admin_token");

        const response = await fetch(`${API_URL}/api/quotes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
  const updateQuote = async (id, updates) => {
    try {
      const token = localStorage.getItem("mecaprint3d_admin_token");

      const response = await fetch(`${API_URL}/api/quotes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!data.success) return;

      setQuotes((current) =>
        current.map((quote) =>
          quote._id === id ? data.quote : quote
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================================
  // PROJECTS LIST
  // =====================================================
  const projects = useMemo(() => {
    const list = quotes
      .map((quote) => quote.project)
      .filter(Boolean);

    return ["Tous", ...new Set(list)];
  }, [quotes]);

  // =====================================================
  // FILTERED + SORTED QUOTES
  // =====================================================
  const filteredQuotes = useMemo(() => {
    return quotes
      .filter((quote) => {
        const matchStatus =
          statusFilter === "Tous" || quote.status === statusFilter;

        const matchProject =
          projectFilter === "Tous" || quote.project === projectFilter;

        const matchArchive = showArchived
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
          quote.source,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchSearch =
          !search.trim() ||
          searchText.includes(search.trim().toLowerCase());

        return (
          matchStatus &&
          matchProject &&
          matchArchive &&
          matchSearch
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();

        return sortOrder === "recent"
          ? dateB - dateA
          : dateA - dateB;
      });
  }, [
    quotes,
    statusFilter,
    projectFilter,
    showArchived,
    search,
    sortOrder,
  ]);

  // =====================================================
  // KPI
  // =====================================================
  const totalQuotes = quotes.length;
  const visibleQuotes = filteredQuotes.length;

  const newQuotes = quotes.filter(
    (q) => q.status === "Nouveau"
  ).length;

  const inProgressQuotes = quotes.filter(
    (q) => q.status === "En analyse"
  ).length;

  const validatedQuotes = quotes.filter(
    (q) => q.status === "Devis envoyé"
  ).length;

  const withFilesQuotes = quotes.filter(
    (q) => q.files?.length
  ).length;

  const archivedQuotes = quotes.filter(
    (q) => q.archived === true
  ).length;

  const coveringQuotes = quotes.filter(
    (q) => q.project === "Covering intérieur"
  ).length;

  const printQuotes = quotes.filter(
    (q) => q.project === "Impression 3D"
  ).length;

  const vanQuotes = quotes.filter(
    (q) => q.project === "Van / camping-car"
  ).length;

  const manualQuotes = quotes.filter(
    (q) => q.manual === true
  ).length;

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <AdminLayout title="Demandes de devis">
      {/* ================= CREATE MODAL ================= */}
      <CreateQuoteModal
        open={createModal}
        onClose={() => setCreateModal(false)}
      />

      {/* ================= HEADER DASHBOARD ================= */}
      <div className="mb-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">
              Dashboard commercial
            </p>

            <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">
              Suivi des demandes clients
            </h1>

            <p className="mt-3 max-w-3xl text-sm text-zinc-400">
              Recherche, tri, filtres par statut, projet et suivi des
              demandes entrantes MecaPrint3D.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4 text-right">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">
              Résultats affichés
            </p>

            <p className="mt-1 text-3xl font-black text-white">
              {visibleQuotes}
            </p>
          </div>
        </div>
      </div>

      {/* ================= CREATE BUTTON ================= */}
      <div className="mb-8 flex justify-end">
        <button
          type="button"
          onClick={() => setCreateModal(true)}
          className="rounded-2xl bg-orange-500 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-[0_0_25px_rgba(249,115,22,0.3)] transition duration-300 hover:-translate-y-1 hover:bg-orange-400"
        >
          + Ajouter une demande
        </button>
      </div>

      {/* ================= STATUS FILTERS ================= */}
      <QuoteFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        showArchived={showArchived}
        setShowArchived={setShowArchived}
        quotes={quotes}
      />

      {/* ================= SEARCH + PROJECT + SORT ================= */}
      <div className="mb-8 grid gap-4 rounded-[28px] border border-white/10 bg-zinc-900/70 p-5 backdrop-blur-xl lg:grid-cols-[1fr_260px_220px]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher : nom, email, téléphone, projet, source..."
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-500"
        />

        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition focus:border-orange-500"
        >
          {projects.map((project) => (
            <option
              key={project}
              value={project}
              className="bg-zinc-950"
            >
              {project === "Tous" ? "Tous les projets" : project}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition focus:border-orange-500"
        >
          <option value="recent" className="bg-zinc-950">
            Plus récent
          </option>

          <option value="oldest" className="bg-zinc-950">
            Plus ancien
          </option>
        </select>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-10 text-center text-zinc-400">
          Chargement des devis...
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && filteredQuotes.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-10 text-center text-zinc-400">
          Aucun devis ne correspond aux filtres.
        </div>
      )}

      {/* ================= QUOTES LIST ================= */}
      {!loading && filteredQuotes.length > 0 && (
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
      )}
    </AdminLayout>
  );
}

// =====================================================
// KPI CARD
// =====================================================
function KpiCard({ label, value, color = "orange" }) {
  const colors = {
    orange: "border-orange-500/10 bg-orange-500/5 text-orange-300",
    cyan: "border-cyan-500/10 bg-cyan-500/5 text-cyan-300",
    amber: "border-amber-500/10 bg-amber-500/5 text-amber-300",
    green: "border-green-500/10 bg-green-500/5 text-green-300",
  };

  return (
    <div
      className={`rounded-[28px] border p-6 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 ${
        colors[color] || colors.orange
      }`}
    >
      <p className="text-xs font-black uppercase tracking-[0.25em]">
        {label}
      </p>

      <h2 className="mt-4 text-5xl font-black text-white">
        {value}
      </h2>
    </div>
  );
}

// =====================================================
// SMALL KPI
// =====================================================
function SmallKpi({ label, value }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-zinc-900/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-orange-500/30">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">
        {value}
      </p>
    </div>
  );
}