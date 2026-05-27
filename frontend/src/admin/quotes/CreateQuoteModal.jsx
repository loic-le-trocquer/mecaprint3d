import { useState } from "react";
import { API_URL } from "../../lib/api";

export default function CreateQuoteModal({
  open,
  onClose,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    project: "Impression 3D",
    message: "",
    source: "Téléphone",
  });

  if (!open) return null;

  const handleChange = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await fetch(`${API_URL}/api/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          manual: true,
        }),
      });

      onClose();

      window.location.reload();

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl">
      <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-zinc-950 p-8 shadow-[0_0_60px_rgba(0,0,0,0.45)]">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-400">
              Nouvelle demande
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Ajouter un devis manuel
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-white transition hover:border-red-500 hover:bg-red-500"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5"
        >
          <input
            type="text"
            placeholder="Nom client"
            value={form.name}
            onChange={(e) =>
              handleChange("name", e.target.value)
            }
            className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-orange-500"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              handleChange("email", e.target.value)
            }
            className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-orange-500"
          />

          <input
            type="text"
            placeholder="Téléphone"
            value={form.phone}
            onChange={(e) =>
              handleChange("phone", e.target.value)
            }
            className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-orange-500"
          />

          <select
            value={form.project}
            onChange={(e) =>
              handleChange("project", e.target.value)
            }
            className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-orange-500"
          >
            <option>Impression 3D</option>
            <option>Covering intérieur</option>
            <option>Van / camping-car</option>
          </select>

          <select
            value={form.source}
            onChange={(e) =>
              handleChange("source", e.target.value)
            }
            className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-orange-500"
          >
            <option>Téléphone</option>
            <option>Email</option>
            <option>Facebook</option>
            <option>Instagram</option>
            <option>Client direct</option>
          </select>

          <textarea
            rows={6}
            placeholder="Description du besoin client..."
            value={form.message}
            onChange={(e) =>
              handleChange("message", e.target.value)
            }
            className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-orange-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-orange-500 px-6 py-5 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-orange-400 disabled:opacity-50"
          >
            {loading
              ? "Création..."
              : "Créer la demande"}
          </button>
        </form>
      </div>
    </div>
  );
}