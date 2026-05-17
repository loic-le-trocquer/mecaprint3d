import { useState } from "react";
import { API_URL } from "../lib/api";

export default function QuoteForm({ content }) {
  const quoteIntro = content?.quoteIntro || {};

  // ================= STATE FORMULAIRE =================
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    quantity: "",
    material: "",
    message: "",
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
const handleFileChange = (e) => {
  const newFiles = Array.from(e.target.files || []);

  setForm((current) => ({
    ...current,
    files: [...current.files, ...newFiles],
  }));
};

const removeFile = (fileIndex) => {
  setForm((current) => ({
    ...current,
    files: current.files.filter(
      (_, index) => index !== fileIndex
    ),
  }));
};

  // ================= ENVOI FORMULAIRE =================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // ================= FORMDATA =================
      // obligatoire pour envoyer un fichier
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("project", form.project);
      formData.append("quantity", form.quantity);
      formData.append("material", form.material);
      formData.append("message", form.message);

      // ================= FICHIER =================
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

      const data = await response.json();



      // ================= GESTION ERREUR =================
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur serveur");
      }



      // ================= SUCCÈS =================
      alert("Votre demande de devis a bien été envoyée.");



      // ================= RESET FORM =================
      setForm({
        name: "",
        email: "",
        phone: "",
        project: "",
        quantity: "",
        material: "",
        message: "",
        files: [],
      });

    } catch (error) {

      console.error(error);

      alert("Erreur : impossible d’envoyer la demande.");
    }
  };



  return (
    <section
      id="devis"
      className="border-t border-white/10 px-6 py-24"
    >

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-start">

        {/* ================= TEXTE GAUCHE ================= */}
        <div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            {quoteIntro.eyebrow || "Demande de devis"}
          </p>

          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            {quoteIntro.title || "Expliquez votre besoin, on s’occupe du reste"}
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-zinc-300">
            {quoteIntro.description ||
              "Envoyez les informations principales de votre projet. Nous analyserons la faisabilité, la matière adaptée et le coût avant fabrication."}
          </p>

          <div className="mt-10 space-y-4 text-zinc-300">
            {(quoteIntro.bullets || []).map((bullet) => (
              <p key={bullet}>✅ {bullet}</p>
            ))}
          </div>

        </div>



        {/* ================= FORMULAIRE ================= */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl shadow-black/40 md:p-8"
        >

          {/* ================= GRID INPUTS ================= */}
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
              <option value="">Type de projet</option>

              <option>Impression 3D sur mesure</option>
              <option>Réparation de pièce</option>
              <option>Restauration auto / moto</option>
              <option>Goodies personnalisés</option>
              <option>Prototype</option>
              <option>Autre demande</option>

            </select>



            {/* MATIERE */}
            <select
              name="material"
              value={form.material}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
            >
              <option value="">Matière souhaitée</option>

              <option>Je ne sais pas</option>
              <option>PLA</option>
              <option>PETG</option>
              <option>ABS / ASA</option>
              <option>TPU souple</option>
              <option>Carbone / technique</option>

            </select>

          </div>



          {/* ================= MESSAGE ================= */}
          <textarea
            name="message"
            placeholder="Décrivez votre projet..."
            rows="7"
            value={form.message}
            onChange={handleChange}
            required
            className="mt-5 w-full rounded-2xl border border-white/10 bg-black/60 px-5 py-4 outline-none transition focus:border-orange-500"
          />



          {/* ================= UPLOAD FICHIER ================= */}
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
          onClick={() => removeFile(index)}
          className="ml-3 rounded-full bg-red-500 px-2 py-1 text-xs font-black text-white hover:bg-red-400"
        >
          X
        </button>

      </div>

    ))}

  </div>

) : (
              <span>
                Ajouter un fichier STL, STEP, photo ou PDF
              </span>
            )}

          </label>



          {/* ================= BOUTON ================= */}
          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-400"
          >
            Envoyer ma demande
          </button>



          {/* ================= INFO ================= */}
          <p className="mt-4 text-center text-xs text-zinc-500">
            Aucun paiement maintenant. Le devis est validé avant fabrication.
          </p>

        </form>
      </div>
    </section>
  );
}