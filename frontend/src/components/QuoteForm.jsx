import { useState } from "react";
import { API_URL } from "../lib/api";

export default function QuoteForm({ content }) {

  const quoteIntro =
    content?.quoteIntro || {};

  // ================= STATE FORMULAIRE =================
  const [form, setForm] = useState({

    // ================= INFOS CLIENT =================
    name: "",
    email: "",
    phone: "",

    // ================= TYPE PROJET =================
    project: "",

    // ================= IMPRESSION 3D =================
    quantity: "",
    material: "",
    dimensions: "",

    // ================= COVERING =================
    surface: "",
    coveringReference: "",

    // ================= VEHICULE =================
    vehicle: "",

    // ================= MESSAGE =================
    message: "",

    // ================= FICHIERS =================
    files: [],

  });

  // ================= CHAMPS TEXTE =================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  // ================= FICHIER =================
  const MAX_FILE_SIZE =
    50 * 1024 * 1024;

  const handleFileChange = (e) => {

    const selectedFiles =
      Array.from(e.target.files || []);

    const validFiles = [];
    const rejectedFiles = [];

    selectedFiles.forEach((file) => {

      if (file.size > MAX_FILE_SIZE) {

        rejectedFiles.push(file.name);

      } else {

        validFiles.push(file);

      }

    });

    if (rejectedFiles.length) {

      alert(
        `Fichier trop volumineux :\n\n${rejectedFiles.join(
          "\n"
        )}\n\nTaille maximale : 100 Mo par fichier`
      );

    }

    setForm((current) => ({
      ...current,
      files: [
        ...current.files,
        ...validFiles,
      ],
    }));

  };

  // ================= REMOVE FILE =================
  const removeFile = (fileIndex) => {

    setForm((current) => ({
      ...current,
      files: current.files.filter(
        (_, index) =>
          index !== fileIndex
      ),
    }));

  };

  // ================= ENVOI FORMULAIRE =================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // ================= FORMDATA =================
      const formData = new FormData();

      // ================= INFOS =================
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);

      // ================= PROJET =================
      formData.append("project", form.project);

      // ================= IMPRESSION 3D =================
      formData.append("quantity", form.quantity);
      formData.append("material", form.material);
      formData.append(
        "dimensions",
        form.dimensions
      );

      // ================= COVERING =================
      formData.append(
        "surface",
        form.surface
      );

      formData.append(
        "coveringReference",
        form.coveringReference
      );

      // ================= VEHICULE =================
      formData.append(
        "vehicle",
        form.vehicle
      );

      // ================= MESSAGE =================
      formData.append(
        "message",
        form.message
      );

      // ================= FICHIERS =================
      form.files.forEach((file) => {

        formData.append("files", file);

      });

      // ================= ENVOI BACKEND =================
      const response = await fetch(
        `${API_URL}/api/quotes`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      // ================= ERREUR =================
      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.error ||
          "Erreur serveur"
        );

      }

      // ================= SUCCES =================
      alert(
        "Votre demande de devis a bien été envoyée."
      );

      // ================= RESET =================
      setForm({

        name: "",
        email: "",
        phone: "",

        project: "",

        quantity: "",
        material: "",
        dimensions: "",

        surface: "",
        coveringReference: "",

        vehicle: "",

        message: "",

        files: [],

      });

    } catch (error) {

      console.error(error);

      alert(
        "Erreur : impossible d’envoyer la demande."
      );

    }

  };

  // ================= RENDER =================
  return (

    <section
      id="devis"
      className="border-t border-white/10 px-6 py-24"
    >

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-start">

        {/* ================= TEXTE ================= */}
        <div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">

            {quoteIntro.eyebrow ||
              "Demande de devis"}

          </p>

          <h2 className="text-4xl font-black leading-tight md:text-6xl">

            {quoteIntro.title ||
              "Expliquez votre besoin, on s’occupe du reste"}

          </h2>

          <p className="mt-6 text-lg leading-relaxed text-zinc-300">

            {quoteIntro.description ||
              "Envoyez les informations principales de votre projet."}

          </p>

        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl shadow-black/40 md:p-8"
        >

          {/* ================= GRID ================= */}
          <div className="grid gap-5 md:grid-cols-2">

            {/* NOM */}
            <input
              type="text"
              name="name"
              placeholder="Nom / Prénom"
              value={form.name}
              onChange={handleChange}
              required
              className="rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              value={form.email}
              onChange={handleChange}
              required
              className="rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
            />

            {/* TELEPHONE */}
            <input
              type="tel"
              name="phone"
              placeholder="Téléphone"
              value={form.phone}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
            />

            {/* QUANTITE */}
            <input
              type="number"
              name="quantity"
              placeholder="Quantité"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
            />

            {/* TYPE PROJET */}
            <select
              name="project"
              value={form.project}
              onChange={handleChange}
              required
              className="rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
            >

              <option value="">
                Type de projet
              </option>

              <option>
                Impression 3D
              </option>

              <option>
                Réparation de pièce
              </option>

              <option>
                Covering intérieur
              </option>

              <option>
                Van / camping-car
              </option>

              <option>
                Mobil-home
              </option>

              <option>
                Scan 3D / rétroconception
              </option>

              <option>
                Prototype / conception
              </option>

              <option>
                Autre demande
              </option>

            </select>

            {/* MATIERE */}
            <select
              name="material"
              value={form.material}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
            >

              <option value="">
                Matière souhaitée
              </option>

              <option>
                Je ne sais pas
              </option>

              <option>
                PLA
              </option>

              <option>
                PETG
              </option>

              <option>
                ABS / ASA
              </option>

              <option>
                TPU souple
              </option>

              <option>
                Carbone / technique
              </option>

            </select>

          </div>

          {/* ================= DYNAMIC FIELDS ================= */}

          {/* COVERING */}
          {form.project ===
            "Covering intérieur" && (

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <input
                type="text"
                name="surface"
                placeholder="Surface à rénover"
                value={form.surface}
                onChange={handleChange}
                className="rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
              />

              <input
                type="text"
                name="coveringReference"
                placeholder="Référence COVER STYL souhaitée"
                value={form.coveringReference}
                onChange={handleChange}
                className="rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
              />

            </div>

          )}

          {/* VAN */}
          {form.project ===
            "Van / camping-car" && (

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <input
                type="text"
                name="vehicle"
                placeholder="Modèle du véhicule"
                value={form.vehicle}
                onChange={handleChange}
                className="rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
              />

              <input
                type="text"
                name="surface"
                placeholder="Zone à transformer"
                value={form.surface}
                onChange={handleChange}
                className="rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
              />

            </div>

          )}

          {/* IMPRESSION 3D */}
          {form.project ===
            "Impression 3D" && (

            <div className="mt-5">

              <input
                type="text"
                name="dimensions"
                placeholder="Dimensions approximatives"
                value={form.dimensions}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
              />

            </div>

          )}

          {/* MESSAGE */}
          <textarea
            name="message"
            placeholder="Décrivez votre projet..."
            rows="7"
            value={form.message}
            onChange={handleChange}
            required
            className="mt-5 w-full rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
          />

          {/* FILES */}
          <label className="mt-5 block cursor-pointer rounded-2xl border border-dashed border-white/15 bg-black/40 p-5 text-center text-sm text-zinc-400 transition hover:border-orange-500">

            <input
              type="file"
              multiple
              name="file"
              onChange={handleFileChange}
              accept=".stl,.step,.stp,.obj,.3mf,.jpg,.jpeg,.png,.pdf"
              className="hidden"
            />

            {form.files?.length ? (

              <div className="space-y-2">

                {form.files.map((file, index) => (

                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3"
                  >

                    <div className="truncate text-left text-sm text-orange-300">

                      {file.name}

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeFile(index)
                      }
                      className="ml-3 rounded-full bg-red-500 px-2 py-1 text-xs font-black text-white hover:bg-red-400"
                    >

                      X

                    </button>

                  </div>

                ))}

              </div>

            ) : (

              <span>
                Ajouter un STL, STEP,
                photo ou PDF
              </span>

            )}

          </label>

          {/* BOUTON */}
          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-400"
          >

            Envoyer ma demande

          </button>

          {/* INFO */}
          <p className="mt-4 text-center text-xs text-zinc-500">

            Aucun paiement maintenant.
            Le devis est validé avant fabrication.

          </p>

        </form>

      </div>

    </section>

  );
}