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
  const filteredQuotes = quotes.filter(
    (quote) => {

      const matchStatus =
        statusFilter === "Tous" ||
        quote.status === statusFilter;

      const matchArchive =
        showArchived
        ? true
        : quote.archived !== true;

      return (
        matchStatus && matchArchive
      );

    }
  );

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
      <QuoteFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        showArchived={showArchived}
        setShowArchived={setShowArchived}
      />

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