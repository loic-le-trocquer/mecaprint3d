import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  File,
  MessageCircle,
  Paperclip,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { API_URL } from "../lib/api";

const universes = [
  {
    id: "TECH",
    title: "TECH",
    subtitle: "Impression 3D, scan, CAO ou pièce technique",
  },
  {
    id: "DESIGN",
    title: "DESIGN",
    subtitle: "Covering, mobilier ou transformation d’espace",
  },
  {
    id: "HOME & OUTDOOR",
    title: "HOME & OUTDOOR",
    subtitle: "Maison, jardin, décoration ou acier Corten",
  },
];

const initialForm = {
  universe: "",
  project: "",
  quantity: "1",
  material: "",
  message: "",
  name: "",
  email: "",
  phone: "",
};

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("");

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const progress = useMemo(() => {
    if (step >= 4) return 100;
    return Math.max(12, ((step + 1) / 4) * 100);
  }, [step]);

  const canContinue = () => {
    if (step === 0) return Boolean(form.universe);
    if (step === 1) return Boolean(form.project.trim());
    if (step === 2) {
      return (
        form.name.trim().length >= 2 &&
        /^\S+@\S+\.\S+$/.test(form.email.trim())
      );
    }
    return true;
  };

  const next = () => {
    if (!canContinue()) {
      setError("Complétez les informations demandées pour continuer.");
      return;
    }
    setStep((current) => Math.min(current + 1, 3));
  };

  const previous = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const removeFile = (index) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const submit = async () => {
    if (!canContinue()) return;

    setLoading(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("email", form.email.trim());
      payload.append("phone", form.phone.trim());
      payload.append("project", `[${form.universe}] ${form.project.trim()}`);
      payload.append("quantity", form.quantity || "1");
      payload.append("material", form.material.trim() || "À définir");
      payload.append("message", form.message.trim());

      files.forEach((file) => payload.append("files", file));

      const response = await fetch(`${API_URL}/api/quotes`, {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "La demande n’a pas pu être envoyée.");
      }

      setQuoteNumber(data.quote?.quoteNumber || "");
      setStep(4);
      setFiles([]);
    } catch (submissionError) {
      setError(
        submissionError.message ||
          "Une erreur est survenue. Vous pouvez réessayer dans un instant."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(initialForm);
    setFiles([]);
    setQuoteNumber("");
    setError("");
    setStep(0);
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Fermer l’assistant" : "Ouvrir l’assistant devis"}
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-2xl shadow-orange-500/30 transition hover:scale-105 hover:bg-orange-400"
      >
        {open ? <X size={27} /> : <MessageCircle size={27} />}
      </button>

      {open && (
        <section className="fixed bottom-24 right-4 z-50 flex max-h-[calc(100vh-7rem)] w-[calc(100vw-2rem)] max-w-[430px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60 sm:right-6">
          <header className="bg-gradient-to-r from-orange-600 to-orange-400 p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/80">
                  <Sparkles size={15} />
                  Assistant projet
                </div>
                <h2 className="mt-2 text-xl font-black">Parlons de votre idée</h2>
                <p className="mt-1 text-sm leading-relaxed text-white/85">
                  Quelques informations suffisent pour préparer votre demande.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-black/15 p-2 transition hover:bg-black/25"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {step < 4 && (
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/15">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </header>

          <div className="overflow-y-auto p-5 sm:p-6">
            {step === 0 && (
              <div>
                <StepTitle
                  eyebrow="Étape 1 sur 4"
                  title="Quel est votre univers ?"
                  description="Cela nous permet d’orienter immédiatement votre demande."
                />

                <div className="mt-5 space-y-3">
                  {universes.map((universe) => {
                    const selected = form.universe === universe.id;
                    return (
                      <button
                        type="button"
                        key={universe.id}
                        onClick={() => update("universe", universe.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-orange-500 bg-orange-500/10"
                            : "border-white/10 bg-white/[0.03] hover:border-white/25"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-black text-white">{universe.title}</p>
                            <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                              {universe.subtitle}
                            </p>
                          </div>
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                              selected
                                ? "border-orange-500 bg-orange-500 text-white"
                                : "border-white/20 text-transparent"
                            }`}
                          >
                            <Check size={15} />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <StepTitle
                  eyebrow="Étape 2 sur 4"
                  title="Décrivez votre projet"
                  description="Une phrase simple suffit. Nous affinerons ensuite avec vous."
                />

                <div className="mt-5 space-y-4">
                  <Field label="Votre besoin *">
                    <textarea
                      rows={4}
                      value={form.project}
                      onChange={(event) => update("project", event.target.value)}
                      placeholder="Ex. : reproduire une pièce cassée, rénover une cuisine, créer des bordures Corten…"
                      className={inputClass}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Quantité">
                      <input
                        type="number"
                        min="1"
                        value={form.quantity}
                        onChange={(event) => update("quantity", event.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Matière souhaitée">
                      <input
                        value={form.material}
                        onChange={(event) => update("material", event.target.value)}
                        placeholder="À définir"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Précisions utiles">
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(event) => update("message", event.target.value)}
                      placeholder="Dimensions, usage, délai souhaité, environnement…"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <StepTitle
                  eyebrow="Étape 3 sur 4"
                  title="Comment vous recontacter ?"
                  description="Ces informations servent uniquement au suivi de votre projet."
                />

                <div className="mt-5 space-y-4">
                  <Field label="Nom et prénom *">
                    <input
                      value={form.name}
                      onChange={(event) => update("name", event.target.value)}
                      autoComplete="name"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Adresse e-mail *">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      autoComplete="email"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Téléphone">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <StepTitle
                  eyebrow="Étape 4 sur 4"
                  title="Ajoutez vos fichiers"
                  description="Facultatif : photos, plans, STL, STEP ou PDF facilitent l’analyse."
                />

                <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-orange-500/40 bg-orange-500/[0.06] px-5 py-8 text-center transition hover:bg-orange-500/10">
                  <Paperclip size={26} className="text-orange-400" />
                  <span className="mt-3 font-black text-white">
                    Sélectionner des fichiers
                  </span>
                  <span className="mt-1 text-xs text-zinc-500">
                    Jusqu’à 10 fichiers
                  </span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) =>
                      setFiles(Array.from(event.target.files || []).slice(0, 10))
                    }
                  />
                </label>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                      >
                        <File size={17} className="shrink-0 text-orange-400" />
                        <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-zinc-500 transition hover:text-red-400"
                          aria-label={`Retirer ${file.name}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-zinc-400">
                  <strong className="text-white">Votre demande :</strong>{" "}
                  {form.project}
                  <span className="mt-2 block text-xs text-zinc-500">
                    Un accusé de réception sera envoyé à {form.email}.
                  </span>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="py-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <Check size={30} />
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-orange-400">
                  Demande transmise
                </p>
                <h3 className="mt-3 text-2xl font-black text-white">
                  Merci {form.name.split(" ")[0]} !
                </h3>
                <p className="mt-3 leading-relaxed text-zinc-400">
                  Votre projet est enregistré et MecaPrint3D a été prévenu
                  automatiquement.
                </p>
                {quoteNumber && (
                  <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                    Référence : <strong className="text-white">{quoteNumber}</strong>
                  </p>
                )}
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 text-sm font-bold text-orange-400 transition hover:text-orange-300"
                >
                  Déposer une autre demande
                </button>
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}
          </div>

          {step < 4 && (
            <footer className="flex items-center gap-3 border-t border-white/10 bg-black/20 p-4">
              {step > 0 && (
                <button
                  type="button"
                  onClick={previous}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-zinc-300 transition hover:bg-white/5"
                  aria-label="Étape précédente"
                >
                  <ArrowLeft size={18} />
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 font-black text-black transition hover:bg-orange-400"
                >
                  Continuer
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 font-black text-black transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-60"
                >
                  {loading ? "Envoi en cours…" : "Envoyer ma demande"}
                  {!loading && <Send size={17} />}
                </button>
              )}
            </footer>
          )}
        </section>
      )}
    </>
  );
}

function StepTitle({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-400">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-bold text-zinc-300">
      {label}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500";
