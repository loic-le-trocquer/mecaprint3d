import { useState } from "react";

import { API_URL } from "../lib/api";

export default function QuickOrder() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    material: "PLA",
    size: "S",
    quantity: 1,
    color: "Noir",
  });

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!file) {
      alert("Ajoutez un fichier STL");
      return;
    }

    try {

      setLoading(true);

      const formData =
        new FormData();

      Object.entries(form).forEach(
        ([key, value]) => {
          formData.append(
            key,
            value
          );
        }
      );

      formData.append("file", file);

      const response = await fetch(
        `${API_URL}/api/simple-orders/create-checkout`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (!data.success) {
        alert(data.error);
        return;
      }

      window.location.href =
        data.url;

    } catch (error) {

      console.error(error);

      alert(
        "Erreur serveur"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-20 text-white">

      <div className="mx-auto max-w-3xl">

        <div className="mb-10">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
            COMMANDE RAPIDE
          </p>

          <h1 className="mt-4 text-5xl font-black">
            Impression 3D
            instantanée
          </h1>

          <p className="mt-4 text-zinc-400">
            Déposez votre STL,
            choisissez la matière
            et payez directement.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950 p-8"
        >

          <input
            type="text"
            name="name"
            placeholder="Nom"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-2xl bg-black px-5 py-4"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-2xl bg-black px-5 py-4"
          />

          <input
            type="text"
            name="phone"
            placeholder="Téléphone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-2xl bg-black px-5 py-4"
          />

          <select
            name="material"
            value={form.material}
            onChange={handleChange}
            className="w-full rounded-2xl bg-black px-5 py-4"
          >
            <option>PLA</option>
            <option>PETG</option>
            <option>ASA</option>
            <option>TPU</option>
          </select>

          <select
  name="size"
  value={form.size}
  onChange={handleChange}
  className="w-full rounded-2xl bg-black px-5 py-4"
>
  <option value="S">Petit</option>
  <option value="M">Moyen</option>
  <option value="L">Grand</option>
  <option value="XL">Très grand</option>
</select>

          <input
            type="number"
            name="quantity"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            className="w-full rounded-2xl bg-black px-5 py-4"
          />

          <input
            type="text"
            name="color"
            placeholder="Couleur"
            value={form.color}
            onChange={handleChange}
            className="w-full rounded-2xl bg-black px-5 py-4"
          />

          <input
            type="file"
            accept=".stl,.step,.stp,.obj"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
            className="w-full rounded-2xl bg-black px-5 py-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full rounded-2xl
              bg-orange-500 px-6 py-5
              text-lg font-black
              transition hover:bg-orange-400
            "
          >
            {loading
              ? "Chargement..."
              : "Payer maintenant"}
          </button>

        </form>

      </div>

    </div>
  );
}