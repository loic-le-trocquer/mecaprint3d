export default function AdminTransformations({
  Card,
  Field,
  draft,
  uploadImage,
  update,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) {
  const emptyTransformation = {
    title: "",
    category: "",
    beforeImage: "",
    afterImage: "",
  };

  return (
    <Card title="Transformations avant / après">
      <Field
        label="Petit titre"
        value={draft.transformationsIntro?.eyebrow}
        onChange={(v) => update("transformationsIntro.eyebrow", v)}
      />

      <Field
        label="Titre"
        value={draft.transformationsIntro?.title}
        onChange={(v) => update("transformationsIntro.title", v)}
      />

      <Field
        label="Description"
        value={draft.transformationsIntro?.description}
        onChange={(v) => update("transformationsIntro.description", v)}
        textarea
      />

      {(draft.transformations || []).map((item, index) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <div className="mb-5 grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-widest text-orange-400">
                Avant
              </p>

              {item.beforeImage && (
                <img
                  src={item.beforeImage}
                  alt=""
                  className="mb-3 h-52 w-full rounded-2xl object-cover"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  uploadImage(e.target.files?.[0], `transformations.${index}.beforeImage`)
                }
                className="block w-full rounded-xl border border-white/10 bg-black/40 p-3 text-zinc-300"
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-widest text-orange-400">
                Après
              </p>

              {item.afterImage && (
                <img
                  src={item.afterImage}
                  alt=""
                  className="mb-3 h-52 w-full rounded-2xl object-cover"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  uploadImage(e.target.files?.[0], `transformations.${index}.afterImage`)
                }
                className="block w-full rounded-xl border border-white/10 bg-black/40 p-3 text-zinc-300"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Titre"
              value={item.title}
              onChange={(v) => updateArrayItem("transformations", index, "title", v)}
            />

            <Field
              label="Catégorie"
              value={item.category}
              onChange={(v) => updateArrayItem("transformations", index, "category", v)}
            />
          </div>

          <div className="mt-5">
            <button
              onClick={() => removeArrayItem("transformations", index)}
              className="rounded-xl border border-red-500/30 px-4 py-3 font-bold text-red-300 hover:bg-red-500/10"
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => addArrayItem("transformations", { ...emptyTransformation })}
        className="rounded-xl border border-orange-500/40 px-5 py-3 font-bold text-orange-300 hover:bg-orange-500/10"
      >
        Ajouter une transformation
      </button>
    </Card>
  );
}