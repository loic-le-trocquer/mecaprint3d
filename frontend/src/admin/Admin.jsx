import { useEffect, useState } from "react";
import { API_URL, apiFetch } from "../lib/api";
import { defaultContent } from "../lib/defaultContent";
import AdminLayout from "./AdminLayout";


// ================= OBJETS VIDES =================
const emptyService = {
  number: "",
  title: "",
  description: "",
  badge: "Sur devis",
};

const emptyRealisation = {
  title: "",
  description: "",
  imageUrl: "",
  category: "",
  media: [],
};

const emptyTechnology = {
  process: "",
  title: "",
  badge: "",
  description: "",
  materials: [],
  applications: [],
  benefits: [],
  mediaUrl: "",
  mediaType: "image",
};

// ================= CHAMP TEXTE =================
function Field({ label, value, onChange, textarea = false, placeholder = "" }) {
  const className =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-500";

  return (
    <label className="block text-sm font-semibold text-zinc-300">
      {label}
      {textarea ? (
        <textarea
          rows="4"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
        />
      )}
    </label>
  );
}

// ================= SELECT =================
function SelectField({ label, value, onChange, options = [] }) {
  return (
    <label className="block text-sm font-semibold text-zinc-300">
      {label}
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-500"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-zinc-950 text-white">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

// ================= CARTE ADMIN =================
function Card({ title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl shadow-black/30">
      <h2 className="mb-6 text-2xl font-black text-white">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default function Admin({ content, setContent }) {
  // ================= ETATS =================
  const [token, setToken] = useState(
    localStorage.getItem("mecaprint3d_admin_token") || ""
  );
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState(content || defaultContent);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // ================= SYNCHRO CONTENU =================
  useEffect(() => {
    setDraft({ ...defaultContent, ...content });
  }, [content]);

  // ================= UPDATE CHAMP SIMPLE =================
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

  // ================= LOGIN =================
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

  // ================= SAVE GLOBAL =================
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

  // ================= UPLOAD IMAGE SIMPLE =================
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

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload impossible");
      }

      update(path, data.imageUrl);
      setMessage("Image envoyée. Pense à cliquer sur Enregistrer les modifications.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  // ================= UPLOAD MEDIA IMAGE / VIDEO =================
  const uploadMedia = async (file, path, typePath = null) => {
    if (!file) return;
    setMessage("Upload du média en cours...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/api/site-content/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload impossible");
      }

      update(path, data.imageUrl);

      if (typePath && data.media?.type) {
        update(typePath, data.media.type);
      }

      setMessage("Média envoyé. Pense à cliquer sur Enregistrer les modifications.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  // ================= UPLOAD MEDIA REALISATION =================
  const uploadRealisationMedia = async (file, realisationIndex) => {
    if (!file) return;
    setMessage("Upload du média en cours...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/api/site-content/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload impossible");
      }

      setDraft((current) => {
        const copy = structuredClone(current);
        const item = copy.realisations[realisationIndex];

        item.media = [
          ...(item.media || []),
          data.media || { type: "image", url: data.imageUrl },
        ];

        item.imageUrl = item.imageUrl || data.imageUrl;

        return copy;
      });

      setMessage("Média ajouté. Pense à cliquer sur Enregistrer les modifications.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  // ================= SUPPRESSION MEDIA REALISATION =================
  const removeRealisationMedia = (realisationIndex, mediaIndex) => {
    setDraft((current) => {
      const copy = structuredClone(current);
      const item = copy.realisations[realisationIndex];

      item.media = (item.media || []).filter(
        (_, index) => index !== mediaIndex
      );

      item.imageUrl = item.media?.[0]?.url || "";

      return copy;
    });
  };

  // ================= DEFINIR MEDIA PRINCIPAL =================
  const setPrimaryRealisationMedia = (realisationIndex, mediaIndex) => {
    setDraft((current) => {
      const copy = structuredClone(current);
      const item = copy.realisations[realisationIndex];
      const media = item.media || [];

      if (!media[mediaIndex]) return current;

      const selected = media[mediaIndex];

      item.media = [
        selected,
        ...media.filter((_, index) => index !== mediaIndex),
      ];

      item.imageUrl = selected.url;

      return copy;
    });
  };

  // ================= DEPLACER MEDIA REALISATION =================
  const moveRealisationMedia = (realisationIndex, mediaIndex, direction) => {
    setDraft((current) => {
      const copy = structuredClone(current);
      const item = copy.realisations[realisationIndex];
      const media = [...(item.media || [])];

      const targetIndex = mediaIndex + direction;

      if (targetIndex < 0 || targetIndex >= media.length) {
        return current;
      }

      [media[mediaIndex], media[targetIndex]] = [
        media[targetIndex],
        media[mediaIndex],
      ];

      item.media = media;
      item.imageUrl = media[0]?.url || "";

      return copy;
    });
  };

  // ================= UPDATE TABLEAU =================
  const updateArrayItem = (arrayName, index, key, value) => {
    setDraft((current) => {
      const copy = structuredClone(current);
      copy[arrayName][index][key] = value;
      return copy;
    });
  };

  // ================= UPDATE LISTE TEXTE =================
  const updateArrayItemList = (arrayName, index, key, value) => {
    const list = value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    updateArrayItem(arrayName, index, key, list);
  };

  // ================= AJOUTER ELEMENT =================
  const addArrayItem = (arrayName, item) => {
    setDraft((current) => ({
      ...current,
      [arrayName]: [...(current[arrayName] || []), item],
    }));
  };

  // ================= SUPPRIMER ELEMENT =================
  const removeArrayItem = (arrayName, index) => {
    setDraft((current) => ({
      ...current,
      [arrayName]: current[arrayName].filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  // ================= PAGE LOGIN =================
  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
        <form
          onSubmit={login}
          className="mx-auto max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-8"
        >
          <h1 className="text-3xl font-black">Administration MecaPrint3D</h1>

          <p className="mt-3 text-zinc-400">
            Connexion protégée pour modifier les textes et les photos du site.
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe admin"
            className="mt-8 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-4 outline-none focus:border-orange-500"
          />

          <button className="mt-5 w-full rounded-xl bg-orange-500 px-5 py-4 font-black hover:bg-orange-400">
            Se connecter
          </button>

          {message && (
            <p className="mt-4 text-sm text-orange-300">{message}</p>
          )}

          <a
            href="/"
            className="mt-6 block text-center text-sm text-zinc-400 hover:text-white"
          >
            Retour au site
          </a>
        </form>
      </div>
    );
  }

  // ================= PAGE ADMIN =================
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER ADMIN ================= */}
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
              Admin
            </p>
            <h1 className="text-4xl font-black">Contenu du site</h1>
            <p className="mt-2 text-zinc-400">
              Modifie les textes, le logo, les photos, les vidéos et les réalisations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-xl border border-white/10 px-5 py-3 font-bold text-zinc-200 hover:border-orange-500"
            >
              Voir le site
            </a>

            <button
              onClick={() => {
                localStorage.removeItem("mecaprint3d_admin_token");
                setToken("");
              }}
              className="rounded-xl border border-white/10 px-5 py-3 font-bold text-zinc-200 hover:border-red-500"
            >
              Déconnexion
            </button>

            <button
              onClick={save}
              disabled={saving}
              className="rounded-xl bg-orange-500 px-5 py-3 font-black text-white hover:bg-orange-400 disabled:opacity-60"
            >
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 text-orange-200">
            {message}
          </div>
        )}

        <div className="grid gap-6">

          {/* ================= IDENTITE ================= */}
          <Card title="Identité / logo">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Nom de marque"
                value={draft.brand?.name}
                onChange={(v) => update("brand.name", v)}
              />

              <Field
                label="Email de contact"
                value={draft.brand?.email}
                onChange={(v) => update("brand.email", v)}
              />

              <Field
                label="Localisation"
                value={draft.brand?.location}
                onChange={(v) => update("brand.location", v)}
              />

              <Field
                label="URL du logo"
                value={draft.brand?.logoUrl}
                onChange={(v) => update("brand.logoUrl", v)}
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                uploadImage(e.target.files?.[0], "brand.logoUrl")
              }
              className="block w-full rounded-xl border border-white/10 bg-black/40 p-3 text-zinc-300"
            />
          </Card>

          {/* ================= ACCUEIL ================= */}
          <Card title="Accueil">
            <Field
              label="Badge"
              value={draft.hero?.badge}
              onChange={(v) => update("hero.badge", v)}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Titre"
                value={draft.hero?.title}
                onChange={(v) => update("hero.title", v)}
              />

              <Field
                label="Texte orange"
                value={draft.hero?.highlight}
                onChange={(v) => update("hero.highlight", v)}
              />
            </div>

            <Field
              label="Description"
              value={draft.hero?.description}
              onChange={(v) => update("hero.description", v)}
              textarea
            />

            <Field
              label="Slogan / signature"
              value={draft.hero?.slogan}
              onChange={(v) => update("hero.slogan", v)}
              textarea
              placeholder="L’impression 3D est devenue accessible. La conception reste la clé d’une pièce performante."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Bouton principal"
                value={draft.hero?.primaryButton}
                onChange={(v) => update("hero.primaryButton", v)}
              />

              <Field
                label="Bouton secondaire"
                value={draft.hero?.secondaryButton}
                onChange={(v) => update("hero.secondaryButton", v)}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="URL photo bannière / fallback"
                value={draft.hero?.imageUrl}
                onChange={(v) => update("hero.imageUrl", v)}
              />

              <Field
                label="URL vidéo bannière"
                value={draft.hero?.videoUrl}
                onChange={(v) => update("hero.videoUrl", v)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  uploadImage(e.target.files?.[0], "hero.imageUrl")
                }
                className="block w-full rounded-xl border border-white/10 bg-black/40 p-3 text-zinc-300"
              />

              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  uploadMedia(e.target.files?.[0], "hero.videoUrl")
                }
                className="block w-full rounded-xl border border-white/10 bg-black/40 p-3 text-zinc-300"
              />
            </div>
          </Card>

          {/* ================= ETAPES ================= */}
          <Card title="Étapes d’accueil">
            {(draft.steps || []).map((step, index) => (
              <Field
                key={index}
                label={`Étape ${index + 1}`}
                value={step}
                onChange={(v) => {
                  const steps = [...draft.steps];
                  steps[index] = v;
                  update("steps", steps);
                }}
              />
            ))}
          </Card>

          {/* ================= SERVICES INTRO ================= */}
          <Card title="Introduction services">
            <Field
              label="Petit titre"
              value={draft.servicesIntro?.eyebrow}
              onChange={(v) => update("servicesIntro.eyebrow", v)}
            />

            <Field
              label="Titre"
              value={draft.servicesIntro?.title}
              onChange={(v) => update("servicesIntro.title", v)}
            />

            <Field
              label="Description"
              value={draft.servicesIntro?.description}
              onChange={(v) => update("servicesIntro.description", v)}
              textarea
            />
          </Card>

          {/* ================= SERVICES ================= */}
          <Card title="Services">
            {(draft.services || []).map((service, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-black/30 p-5"
              >
                <div className="grid gap-4 md:grid-cols-4">
                  <Field
                    label="Numéro"
                    value={service.number}
                    onChange={(v) =>
                      updateArrayItem("services", index, "number", v)
                    }
                  />

                  <Field
                    label="Titre"
                    value={service.title}
                    onChange={(v) =>
                      updateArrayItem("services", index, "title", v)
                    }
                  />

                  <Field
                    label="Badge"
                    value={service.badge}
                    onChange={(v) =>
                      updateArrayItem("services", index, "badge", v)
                    }
                  />

                  <button
                    onClick={() => removeArrayItem("services", index)}
                    className="self-end rounded-xl border border-red-500/30 px-4 py-3 font-bold text-red-300 hover:bg-red-500/10"
                  >
                    Supprimer
                  </button>
                </div>

                <div className="mt-4">
                  <Field
                    label="Description"
                    value={service.description}
                    onChange={(v) =>
                      updateArrayItem("services", index, "description", v)
                    }
                    textarea
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() =>
                addArrayItem("services", {
                  ...emptyService,
                  number: String((draft.services || []).length + 1).padStart(
                    2,
                    "0"
                  ),
                })
              }
              className="rounded-xl border border-orange-500/40 px-5 py-3 font-bold text-orange-300 hover:bg-orange-500/10"
            >
              Ajouter un service
            </button>
          </Card>

          {/* ================= TECHNOLOGIES ================= */}
          <Card title="Technologies / matériaux / découpe laser">
            <Field
              label="Petit titre"
              value={draft.technologiesIntro?.eyebrow}
              onChange={(v) => update("technologiesIntro.eyebrow", v)}
            />

            <Field
              label="Titre"
              value={draft.technologiesIntro?.title}
              onChange={(v) => update("technologiesIntro.title", v)}
            />

            <Field
              label="Description"
              value={draft.technologiesIntro?.description}
              onChange={(v) => update("technologiesIntro.description", v)}
              textarea
            />

            {(draft.technologies || []).map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-black/30 p-5"
              >
                {item.mediaUrl && (
                  <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black">
                    {item.mediaType === "video" ? (
                      <video
                        src={item.mediaUrl}
                        className="h-48 w-full object-cover"
                        muted
                        loop
                        playsInline
                        controls
                      />
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt=""
                        className="h-48 w-full object-cover"
                      />
                    )}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-4">
                  <Field
                    label="Procédé"
                    value={item.process}
                    onChange={(v) =>
                      updateArrayItem("technologies", index, "process", v)
                    }
                  />

                  <Field
                    label="Titre"
                    value={item.title}
                    onChange={(v) =>
                      updateArrayItem("technologies", index, "title", v)
                    }
                  />

                  <SelectField
                    label="Réalisation / source"
                    value={item.badge || "Atelier MECAPRINT3D"}
                    onChange={(v) =>
                      updateArrayItem("technologies", index, "badge", v)
                    }
                    options={[
                      "Atelier MECAPRINT3D",
                      "Partenaire",
                      "Service complémentaire",
                      "Interne + partenaire",
                    ]}
                  />

                  <button
                    onClick={() => removeArrayItem("technologies", index)}
                    className="self-end rounded-xl border border-red-500/30 px-4 py-3 font-bold text-red-300 hover:bg-red-500/10"
                  >
                    Supprimer
                  </button>
                </div>

                <div className="mt-4">
                  <Field
                    label="Texte du badge personnalisé"
                    value={item.badge}
                    onChange={(v) =>
                      updateArrayItem("technologies", index, "badge", v)
                    }
                    placeholder="Ex : Atelier MECAPRINT3D, Partenaire, Service complémentaire..."
                  />
                </div>

                <div className="mt-4">
                  <Field
                    label="Description"
                    value={item.description}
                    onChange={(v) =>
                      updateArrayItem("technologies", index, "description", v)
                    }
                    textarea
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <Field
                    label="Matériaux — un par ligne"
                    value={(item.materials || []).join("\n")}
                    onChange={(v) =>
                      updateArrayItemList("technologies", index, "materials", v)
                    }
                    textarea
                  />

                  <Field
                    label="Applications — une par ligne"
                    value={(item.applications || []).join("\n")}
                    onChange={(v) =>
                      updateArrayItemList(
                        "technologies",
                        index,
                        "applications",
                        v
                      )
                    }
                    textarea
                  />

                  <Field
                    label="Avantages — un par ligne"
                    value={(item.benefits || []).join("\n")}
                    onChange={(v) =>
                      updateArrayItemList("technologies", index, "benefits", v)
                    }
                    textarea
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <Field
                    label="URL média technologie"
                    value={item.mediaUrl}
                    onChange={(v) =>
                      updateArrayItem("technologies", index, "mediaUrl", v)
                    }
                  />

                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setMessage("Upload du média technologie en cours...");

                      try {
                        const formData = new FormData();
                        formData.append("image", file);

                        const response = await fetch(
                          `${API_URL}/api/site-content/admin/upload`,
                          {
                            method: "POST",
                            headers: { Authorization: `Bearer ${token}` },
                            body: formData,
                          }
                        );

                        const data = await response.json();

                        if (!response.ok || !data.success) {
                          throw new Error(data.error || "Upload impossible");
                        }

                        updateArrayItem(
                          "technologies",
                          index,
                          "mediaUrl",
                          data.imageUrl
                        );

                        updateArrayItem(
                          "technologies",
                          index,
                          "mediaType",
                          data.media?.type || "image"
                        );

                        setMessage(
                          "Média technologie ajouté. Pense à cliquer sur Enregistrer les modifications."
                        );
                      } catch (error) {
                        setMessage(error.message);
                      }
                    }}
                    className="block w-full max-w-xs rounded-xl border border-white/10 bg-black/40 p-3 text-zinc-300"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() => addArrayItem("technologies", { ...emptyTechnology })}
              className="rounded-xl border border-orange-500/40 px-5 py-3 font-bold text-orange-300 hover:bg-orange-500/10"
            >
              Ajouter une technologie
            </button>
          </Card>

          {/* ================= REALISATIONS ================= */}
          <Card title="Réalisations avec photos / vidéos">
            <Field
              label="Petit titre"
              value={draft.realisationsIntro?.eyebrow}
              onChange={(v) => update("realisationsIntro.eyebrow", v)}
            />

            <Field
              label="Titre"
              value={draft.realisationsIntro?.title}
              onChange={(v) => update("realisationsIntro.title", v)}
            />

            <Field
              label="Description"
              value={draft.realisationsIntro?.description}
              onChange={(v) => update("realisationsIntro.description", v)}
              textarea
            />

            {(draft.realisations || []).map((item, index) => {
              const mediaList = item.media?.length
                ? item.media
                : item.imageUrl
                  ? [{ type: "image", url: item.imageUrl }]
                  : [];

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  {/* MEDIAS */}
                  {mediaList.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                      {mediaList.map((media, mediaIndex) => (
                        <div
                          key={`${media.url}-${mediaIndex}`}
                          className="relative overflow-hidden rounded-xl border border-white/10 bg-black"
                        >
                          {media.type === "video" ? (
                            <video
                              src={media.url}
                              className="h-32 w-full object-cover"
                              muted
                              controls
                            />
                          ) : (
                            <img
                              src={media.url}
                              alt=""
                              className="h-32 w-full object-cover"
                            />
                          )}

                          {/* BOUTONS HAUT */}
                          <div className="absolute inset-x-2 top-2 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setPrimaryRealisationMedia(index, mediaIndex)
                              }
                              className={`rounded-full px-2 py-1 text-xs font-black ${
                                mediaIndex === 0
                                  ? "bg-orange-500 text-white"
                                  : "bg-black/70 text-white hover:bg-orange-500"
                              }`}
                            >
                              {mediaIndex === 0 ? "★ Principal" : "★"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeRealisationMedia(index, mediaIndex)
                              }
                              className="rounded-full bg-red-600 px-2 py-1 text-xs font-black text-white hover:bg-red-500"
                            >
                              X
                            </button>
                          </div>

                          {/* BOUTONS BAS */}
                          <div className="absolute inset-x-2 bottom-2 flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                moveRealisationMedia(index, mediaIndex, -1)
                              }
                              disabled={mediaIndex === 0}
                              className="rounded-full bg-black/70 px-3 py-1 text-xs font-black text-white disabled:opacity-30"
                            >
                              ←
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                moveRealisationMedia(index, mediaIndex, 1)
                              }
                              disabled={mediaIndex === mediaList.length - 1}
                              className="rounded-full bg-black/70 px-3 py-1 text-xs font-black text-white disabled:opacity-30"
                            >
                              →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-3">
                    <Field
                      label="Titre"
                      value={item.title}
                      onChange={(v) =>
                        updateArrayItem("realisations", index, "title", v)
                      }
                    />

                    <Field
                      label="Catégorie"
                      value={item.category}
                      onChange={(v) =>
                        updateArrayItem("realisations", index, "category", v)
                      }
                    />

                    <Field
                      label="URL principale"
                      value={item.imageUrl}
                      onChange={(v) =>
                        updateArrayItem("realisations", index, "imageUrl", v)
                      }
                    />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                    <Field
                      label="Description"
                      value={item.description}
                      onChange={(v) =>
                        updateArrayItem("realisations", index, "description", v)
                      }
                      textarea
                    />

                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) =>
                          uploadRealisationMedia(e.target.files?.[0], index)
                        }
                        className="block w-full max-w-xs rounded-xl border border-white/10 bg-black/40 p-3 text-zinc-300"
                      />

                      <button
                        onClick={() => removeArrayItem("realisations", index)}
                        className="w-full rounded-xl border border-red-500/30 px-4 py-3 font-bold text-red-300 hover:bg-red-500/10"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() =>
                addArrayItem("realisations", { ...emptyRealisation })
              }
              className="rounded-xl border border-orange-500/40 px-5 py-3 font-bold text-orange-300 hover:bg-orange-500/10"
            >
              Ajouter une réalisation
            </button>
          </Card>

          {/* ================= DEVIS ================= */}
          <Card title="Bloc devis">
            <Field
              label="Petit titre"
              value={draft.quoteIntro?.eyebrow}
              onChange={(v) => update("quoteIntro.eyebrow", v)}
            />

            <Field
              label="Titre"
              value={draft.quoteIntro?.title}
              onChange={(v) => update("quoteIntro.title", v)}
            />

            <Field
              label="Description"
              value={draft.quoteIntro?.description}
              onChange={(v) => update("quoteIntro.description", v)}
              textarea
            />

            {(draft.quoteIntro?.bullets || []).map((bullet, index) => (
              <Field
                key={index}
                label={`Point fort ${index + 1}`}
                value={bullet}
                onChange={(v) => {
                  const bullets = [...draft.quoteIntro.bullets];
                  bullets[index] = v;
                  update("quoteIntro.bullets", bullets);
                }}
              />
            ))}
          </Card>

          {/* ================= FOOTER ================= */}
          <Card title="Pied de page">
            <Field
              label="Description"
              value={draft.footer?.description}
              onChange={(v) => update("footer.description", v)}
              textarea
            />

            <Field
              label="Copyright"
              value={draft.footer?.legal}
              onChange={(v) => update("footer.legal", v)}
            />
          </Card>
        </div>

        {/* ================= SAVE STICKY ================= */}
        <div className="sticky bottom-4 mt-8 rounded-2xl border border-white/10 bg-black/80 p-4 backdrop-blur">
          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-xl bg-orange-500 px-5 py-4 font-black text-white hover:bg-orange-400 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer toutes les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}