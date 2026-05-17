import { useEffect, useState } from "react";
import { API_URL } from "../lib/api";
import AdminLayout from "./AdminLayout";


export default function AdminQuotes() {

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

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

        {/* LISTE */}
        <div className="grid gap-6">

          {quotes.map((quote) => (

            <div
              key={quote._id}
              className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6"
            >

              {/* TOP */}
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                <div>

                  <div className="flex flex-wrap items-center gap-3">

                    <h2 className="text-2xl font-black">
                      {quote.project}
                    </h2>

                    <div className="rounded-full bg-orange-500/20 px-3 py-1 text-sm font-bold text-orange-300">
                      {quote.status}
                    </div>

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