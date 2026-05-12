import { useEffect, useState } from "react";
import { API_URL, apiFetch } from "../lib/api";
import { defaultContent } from "../lib/defaultContent";

const emptyService = { number: "", title: "", description: "", badge: "Sur devis" };
const emptyRealisation = { title: "", description: "", imageUrl: "", category: "" };

function Field({ label, value, onChange, textarea = false, placeholder = "" }) {
  const className = "mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-500";

  return (
    <label className="block text-sm font-semibold text-zinc-300">
      {label}
      {textarea ? (
        <textarea rows="4" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={className} />
      ) : (
        <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={className} />
      )}
    </label>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl shadow-black/30">
      <h2 className="mb-6 text-2xl font-black text-white">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default function Admin({ content, setContent }) {
  const [token, setToken] = useState(localStorage.getItem("mecaprint3d_admin_token") || "");
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState(content || defaultContent);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft({ ...defaultContent, ...content });
  }, [content]);

  const update = (path, value) => {
    setDraft((current) => {
      const copy = structuredClone(current);
      const keys = path.split(".");
      let target = copy;
      keys.slice(0, -1).forEach((key) => {
        target[key] = target[key] || {};
        target = target[key];
      });
      target[keys.at(-1)] = value;
      return copy;
    });
  };

  const login = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = await apiFetch("/api/site-content/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      localStorage.setItem("mecaprint3d_admin_token", data.token);
      setToken(data.token);
      setPassword("");
      setMessage("Connexion admin réussie.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const save = async () => {
    setSaving(true);
    setMessage("");

    try {
      const data = await apiFetch("/api/site-content/admin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      });

      setContent(data.content);
      setDraft(data.content);
      setMessage("Modifications enregistrées avec succès.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file, path) => {
    if (!file) return;
    setMessage("Upload de l’image en cours...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/api/site-content/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.error || "Upload impossible");

      update(path, data.imageUrl);
      setMessage("Image envoyée. Pense à cliquer sur Enregistrer les modifications.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updateArrayItem = (arrayName, index, key, value) => {
    setDraft((current) => {
      const copy = structuredClone(current);
      copy[arrayName][index][key] = value;
      return copy;
    });
  };

  const addArrayItem = (arrayName, item) => {
    setDraft((current) => ({ ...current, [arrayName]: [...(current[arrayName] || []), item] }));
  };

  const removeArrayItem = (arrayName, index) => {
    setDraft((current) => ({
      ...current,
      [arrayName]: current[arrayName].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
        <form onSubmit={login} className="mx-auto max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-8">
          <h1 className="text-3xl font-black">Administration MecaPrint3D</h1>
          <p className="mt-3 text-zinc-400">Connexion protégée pour modifier les textes et les photos du site.</p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe admin" className="mt-8 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-4 outline-none focus:border-orange-500" />
          <button className="mt-5 w-full rounded-xl bg-orange-500 px-5 py-4 font-black hover:bg-orange-400">Se connecter</button>
          {message && <p className="mt-4 text-sm text-orange-300">{message}</p>}
          <a href="/" className="mt-6 block text-center text-sm text-zinc-400 hover:text-white">Retour au site</a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">Admin</p>
            <h1 className="text-4xl font-black">Contenu du site</h1>
            <p className="mt-2 text-zinc-400">Modifie les textes, le logo, les photos et les réalisations.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/" className="rounded-xl border border-white/10 px-5 py-3 font-bold text-zinc-200 hover:border-orange-500">Voir le site</a>
            <button onClick={() => { localStorage.removeItem("mecaprint3d_admin_token"); setToken(""); }} className="rounded-xl border border-white/10 px-5 py-3 font-bold text-zinc-200 hover:border-red-500">Déconnexion</button>
            <button onClick={save} disabled={saving} className="rounded-xl bg-orange-500 px-5 py-3 font-black text-white hover:bg-orange-400 disabled:opacity-60">
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </div>

        {message && <div className="mb-6 rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 text-orange-200">{message}</div>}

        <div className="grid gap-6">
          <Card title="Identité / logo">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nom de marque" value={draft.brand?.name} onChange={(v) => update("brand.name", v)} />
              <Field label="Email de contact" value={draft.brand?.email} onChange={(v) => update("brand.email", v)} />
              <Field label="Localisation" value={draft.brand?.location} onChange={(v) => update("brand.location", v)} />
              <Field label="URL du logo" value={draft.brand?.logoUrl} onChange={(v) => update("brand.logoUrl", v)} />
            </div>
            <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0], "brand.logoUrl")} className="block w-full rounded-xl border border-white/10 bg-black/40 p-3 text-zinc-300" />
          </Card>

          <Card title="Accueil">
            <Field label="Badge" value={draft.hero?.badge} onChange={(v) => update("hero.badge", v)} />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Titre" value={draft.hero?.title} onChange={(v) => update("hero.title", v)} />
              <Field label="Texte orange" value={draft.hero?.highlight} onChange={(v) => update("hero.highlight", v)} />
            </div>
            <Field label="Description" value={draft.hero?.description} onChange={(v) => update("hero.description", v)} textarea />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Bouton principal" value={draft.hero?.primaryButton} onChange={(v) => update("hero.primaryButton", v)} />
              <Field label="Bouton secondaire" value={draft.hero?.secondaryButton} onChange={(v) => update("hero.secondaryButton", v)} />
            </div>
            <Field label="URL photo bannière" value={draft.hero?.imageUrl} onChange={(v) => update("hero.imageUrl", v)} />
            <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0], "hero.imageUrl")} className="block w-full rounded-xl border border-white/10 bg-black/40 p-3 text-zinc-300" />
          </Card>

          <Card title="Étapes d’accueil">
            {(draft.steps || []).map((step, index) => (
              <Field key={index} label={`Étape ${index + 1}`} value={step} onChange={(v) => {
                const steps = [...draft.steps];
                steps[index] = v;
                update("steps", steps);
              }} />
            ))}
          </Card>

          <Card title="Introduction services">
            <Field label="Petit titre" value={draft.servicesIntro?.eyebrow} onChange={(v) => update("servicesIntro.eyebrow", v)} />
            <Field label="Titre" value={draft.servicesIntro?.title} onChange={(v) => update("servicesIntro.title", v)} />
            <Field label="Description" value={draft.servicesIntro?.description} onChange={(v) => update("servicesIntro.description", v)} textarea />
          </Card>

          <Card title="Services">
            {(draft.services || []).map((service, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="grid gap-4 md:grid-cols-4">
                  <Field label="Numéro" value={service.number} onChange={(v) => updateArrayItem("services", index, "number", v)} />
                  <Field label="Titre" value={service.title} onChange={(v) => updateArrayItem("services", index, "title", v)} />
                  <Field label="Badge" value={service.badge} onChange={(v) => updateArrayItem("services", index, "badge", v)} />
                  <button onClick={() => removeArrayItem("services", index)} className="self-end rounded-xl border border-red-500/30 px-4 py-3 font-bold text-red-300 hover:bg-red-500/10">Supprimer</button>
                </div>
                <div className="mt-4">
                  <Field label="Description" value={service.description} onChange={(v) => updateArrayItem("services", index, "description", v)} textarea />
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem("services", { ...emptyService, number: String((draft.services || []).length + 1).padStart(2, "0") })} className="rounded-xl border border-orange-500/40 px-5 py-3 font-bold text-orange-300 hover:bg-orange-500/10">Ajouter un service</button>
          </Card>

          <Card title="Réalisations avec photos">
            <Field label="Petit titre" value={draft.realisationsIntro?.eyebrow} onChange={(v) => update("realisationsIntro.eyebrow", v)} />
            <Field label="Titre" value={draft.realisationsIntro?.title} onChange={(v) => update("realisationsIntro.title", v)} />
            <Field label="Description" value={draft.realisationsIntro?.description} onChange={(v) => update("realisationsIntro.description", v)} textarea />

            {(draft.realisations || []).map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                {item.imageUrl && <img src={item.imageUrl} alt="" className="mb-4 h-40 w-full rounded-xl object-cover" />}
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Titre" value={item.title} onChange={(v) => updateArrayItem("realisations", index, "title", v)} />
                  <Field label="Catégorie" value={item.category} onChange={(v) => updateArrayItem("realisations", index, "category", v)} />
                  <Field label="URL photo" value={item.imageUrl} onChange={(v) => updateArrayItem("realisations", index, "imageUrl", v)} />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <Field label="Description" value={item.description} onChange={(v) => updateArrayItem("realisations", index, "description", v)} textarea />
                  <div className="space-y-3">
                    <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0], `realisations.${index}.imageUrl`)} className="block w-full max-w-xs rounded-xl border border-white/10 bg-black/40 p-3 text-zinc-300" />
                    <button onClick={() => removeArrayItem("realisations", index)} className="w-full rounded-xl border border-red-500/30 px-4 py-3 font-bold text-red-300 hover:bg-red-500/10">Supprimer</button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem("realisations", { ...emptyRealisation })} className="rounded-xl border border-orange-500/40 px-5 py-3 font-bold text-orange-300 hover:bg-orange-500/10">Ajouter une réalisation</button>
          </Card>

          <Card title="Bloc devis">
            <Field label="Petit titre" value={draft.quoteIntro?.eyebrow} onChange={(v) => update("quoteIntro.eyebrow", v)} />
            <Field label="Titre" value={draft.quoteIntro?.title} onChange={(v) => update("quoteIntro.title", v)} />
            <Field label="Description" value={draft.quoteIntro?.description} onChange={(v) => update("quoteIntro.description", v)} textarea />
            {(draft.quoteIntro?.bullets || []).map((bullet, index) => (
              <Field key={index} label={`Point fort ${index + 1}`} value={bullet} onChange={(v) => {
                const bullets = [...draft.quoteIntro.bullets];
                bullets[index] = v;
                update("quoteIntro.bullets", bullets);
              }} />
            ))}
          </Card>

          <Card title="Pied de page">
            <Field label="Description" value={draft.footer?.description} onChange={(v) => update("footer.description", v)} textarea />
            <Field label="Copyright" value={draft.footer?.legal} onChange={(v) => update("footer.legal", v)} />
          </Card>
        </div>

        <div className="sticky bottom-4 mt-8 rounded-2xl border border-white/10 bg-black/80 p-4 backdrop-blur">
          <button onClick={save} disabled={saving} className="w-full rounded-xl bg-orange-500 px-5 py-4 font-black text-white hover:bg-orange-400 disabled:opacity-60">
            {saving ? "Enregistrement..." : "Enregistrer toutes les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}
