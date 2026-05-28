import { useEffect, useState } from "react";
import { API_URL } from "../lib/api";

export default function QuoteCheckout() {
  const [error, setError] = useState("");

  const id = window.location.pathname
    .replace("/commande/", "")
    .trim();

  useEffect(() => {
    const startCheckout = async () => {
      try {
        const response = await fetch(`${API_URL}/api/quotes/${id}/checkout`, {
          method: "POST",
        });

        const data = await response.json();

        if (!data.success || !data.url) {
          setError(data.error || "Impossible de lancer le paiement.");
          return;
        }

        window.location.href = data.url;
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la redirection vers Stripe.");
      }
    };

    if (id) startCheckout();
  }, [id]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-lg rounded-3xl border border-white/10 bg-zinc-900 p-8 text-center">
        <h1 className="text-3xl font-black">
          Redirection vers le paiement
        </h1>

        <p className="mt-4 text-zinc-400">
          Préparation du paiement sécurisé Stripe...
        </p>

        {error && (
          <p className="mt-6 rounded-xl bg-red-500/10 p-4 text-red-300">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}