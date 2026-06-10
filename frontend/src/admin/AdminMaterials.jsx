import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mecaprint3d-backend.onrender.com";

const emptyMaterial = {
  name: "",
  brand: "Polymaker",
  family: "",
  range: "",
  category: "",

  imageUrl: "",
  imagePublicId: "",

  shortDescription: "",
  description: "",

  colors: "",
  applications: "",
  strengths: "",

  performance: {
    strength: 3,
    heatResistance: 2,
    chemicalResistance: 2,
    flexibility: 1,
    easeOfPrint: 4,
    surfaceQuality: 4,
  },

  printSettings: {
    nozzleTemp: "",
    bedTemp: "",
    chamberTemp: "",
    printSpeed: "",
    fan: "",
    drying: "",
    enclosureRecommended: false,
    abrasive: false,
    hygroscopic: false,
  },

  physical: {
    density: "",
    shrinkage: "",
  },

  mechanical: {
    tensileStrength: "",
    youngModulus: "",
    bendingStrength: "",
    impactStrength: "",
    elongationAtBreak: "",
  },

  thermal: {
    hdt: "",
    glassTransition: "",
    meltingTemp: "",
  },

  isActive: true,
  isFeatured: false,

  sortOrder: 0,
  price: 0,
  stock: 0,
  leadTime: "",

  datasheetUrl: "",
  printingGuideUrl: "",
  safetyDataUrl: "",
  manufacturerUrl: "",
};

export default function AdminMaterials() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState(emptyMaterial);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

 async function loadMaterials() {
  const res = await fetch(
    `${API_URL}/api/materials`
  );

  const data = await res.json();

  setMaterials(
    Array.isArray(data)
      ? data
      : data.materials || []
  );
}

  useEffect(() => {
    loadMaterials();
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // =====================================================
// UPLOAD IMAGE CLOUDINARY
// =====================================================

async function uploadImage(file) {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${API_URL}/api/material-uploads/image`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (data.success) {
    updateField("imageUrl", data.url);
    updateField("imagePublicId", data.publicId);
  } else {
    alert(data.message);
  }
}

// =====================================================
// UPLOAD PDF
// =====================================================

async function uploadDatasheet(file) {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
console.log("UPLOAD FILE");
console.log(file);
console.log(file.name);
console.log(file.type);
  const res = await fetch(
    `${API_URL}/api/material-uploads/datasheet`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (data.success) {
    updateField("datasheetUrl", data.url);
  } else {
    alert(data.message);
  }
}
  
 function normalizePayload() {
  return {
    ...form,

    colors: form.colors
      ? form.colors.split(",").map((item) => item.trim()).filter(Boolean)
      : [],

    applications: form.applications
      ? form.applications.split(",").map((item) => item.trim()).filter(Boolean)
      : [],

    strengths: form.strengths
      ? form.strengths.split(",").map((item) => item.trim()).filter(Boolean)
      : [],

    sortOrder: Number(form.sortOrder || 0),
    price: Number(form.price || 0),
    stock: Number(form.stock || 0),

    performance: {
      strength: Number(form.performance?.strength || 0),
      heatResistance: Number(form.performance?.heatResistance || 0),
      chemicalResistance: Number(form.performance?.chemicalResistance || 0),
      flexibility: Number(form.performance?.flexibility || 0),
      easeOfPrint: Number(form.performance?.easeOfPrint || 0),
      surfaceQuality: Number(form.performance?.surfaceQuality || 0),
    },

    printSettings: {
      ...form.printSettings,
      enclosureRecommended: Boolean(form.printSettings?.enclosureRecommended),
      abrasive: Boolean(form.printSettings?.abrasive),
      hygroscopic: Boolean(form.printSettings?.hygroscopic),
    },
  };
}

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = normalizePayload();

    const url = editingId
      ? `${API_URL}/api/materials/${editingId}`
      : `${API_URL}/api/materials`;

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setForm(emptyMaterial);
    setEditingId(null);
    setLoading(false);
    loadMaterials();
  }

  // =====================================================
  // edition
  // =====================================================

  function handleEdit(material) {
  setEditingId(material._id);

  setForm({
    name: material.name || "",
    brand: material.brand || "Polymaker",
    family: material.family || "",
    range: material.range || "",
    category: material.category || "",

    imageUrl: material.imageUrl || "",
    imagePublicId: material.imagePublicId || "",

    shortDescription: material.shortDescription || "",
    description: material.description || "",

    colors: material.colors?.join(", ") || "",
    applications: material.applications?.join(", ") || "",
    strengths: material.strengths?.join(", ") || "",

    performance: {
      strength: material.performance?.strength || 3,
      heatResistance: material.performance?.heatResistance || 2,
      chemicalResistance: material.performance?.chemicalResistance || 2,
      flexibility: material.performance?.flexibility || 1,
      easeOfPrint: material.performance?.easeOfPrint || 4,
      surfaceQuality: material.performance?.surfaceQuality || 4,
    },

    printSettings: {
      nozzleTemp: material.printSettings?.nozzleTemp || "",
      bedTemp: material.printSettings?.bedTemp || "",
      chamberTemp: material.printSettings?.chamberTemp || "",
      printSpeed: material.printSettings?.printSpeed || "",
      fan: material.printSettings?.fan || "",
      drying: material.printSettings?.drying || "",
      enclosureRecommended:
        material.printSettings?.enclosureRecommended || false,
      abrasive: material.printSettings?.abrasive || false,
      hygroscopic: material.printSettings?.hygroscopic || false,
    },

    physical: {
      density: material.physical?.density || "",
      shrinkage: material.physical?.shrinkage || "",
    },

    mechanical: {
      tensileStrength: material.mechanical?.tensileStrength || "",
      youngModulus: material.mechanical?.youngModulus || "",
      bendingStrength: material.mechanical?.bendingStrength || "",
      impactStrength: material.mechanical?.impactStrength || "",
      elongationAtBreak: material.mechanical?.elongationAtBreak || "",
    },

    thermal: {
      hdt: material.thermal?.hdt || "",
      glassTransition: material.thermal?.glassTransition || "",
      meltingTemp: material.thermal?.meltingTemp || "",
    },

    isActive: material.isActive ?? true,
    isFeatured: material.isFeatured ?? false,

    sortOrder: material.sortOrder || 0,
    price: material.price || 0,
    stock: material.stock || 0,
    leadTime: material.leadTime || "",

    datasheetUrl: material.datasheetUrl || "",
    printingGuideUrl: material.printingGuideUrl || "",
    safetyDataUrl: material.safetyDataUrl || "",
    manufacturerUrl: material.manufacturerUrl || "",
  });
}
// =====================================================
// DUPLICATION
// =====================================================

function handleDuplicate(material) {
  setEditingId(null);

  setForm({
    name: `${material.name} (copie)`,
    brand: material.brand || "Polymaker",
    family: material.family || "",
    range: material.range || "",
    category: material.category || "",

    imageUrl: material.imageUrl || "",
    imagePublicId: material.imagePublicId || "",

    shortDescription: material.shortDescription || "",
    description: material.description || "",

    colors: material.colors?.join(", ") || "",
    applications: material.applications?.join(", ") || "",
    strengths: material.strengths?.join(", ") || "",

    performance: {
      strength: material.performance?.strength || 3,
      heatResistance: material.performance?.heatResistance || 2,
      chemicalResistance: material.performance?.chemicalResistance || 2,
      flexibility: material.performance?.flexibility || 1,
      easeOfPrint: material.performance?.easeOfPrint || 4,
      surfaceQuality: material.performance?.surfaceQuality || 4,
    },

    printSettings: {
      nozzleTemp: material.printSettings?.nozzleTemp || "",
      bedTemp: material.printSettings?.bedTemp || "",
      chamberTemp: material.printSettings?.chamberTemp || "",
      printSpeed: material.printSettings?.printSpeed || "",
      fan: material.printSettings?.fan || "",
      drying: material.printSettings?.drying || "",
      enclosureRecommended:
        material.printSettings?.enclosureRecommended || false,
      abrasive: material.printSettings?.abrasive || false,
      hygroscopic: material.printSettings?.hygroscopic || false,
    },

    physical: {
      density: material.physical?.density || "",
      shrinkage: material.physical?.shrinkage || "",
    },

    mechanical: {
      tensileStrength: material.mechanical?.tensileStrength || "",
      youngModulus: material.mechanical?.youngModulus || "",
      bendingStrength: material.mechanical?.bendingStrength || "",
      impactStrength: material.mechanical?.impactStrength || "",
      elongationAtBreak: material.mechanical?.elongationAtBreak || "",
    },

    thermal: {
      hdt: material.thermal?.hdt || "",
      glassTransition: material.thermal?.glassTransition || "",
      meltingTemp: material.thermal?.meltingTemp || "",
    },

    isActive: true,
    isFeatured: material.isFeatured ?? false,

    sortOrder: material.sortOrder || 0,
    price: material.price || 0,
    stock: material.stock || 0,
    leadTime: material.leadTime || "",

    datasheetUrl: material.datasheetUrl || "",
    printingGuideUrl: material.printingGuideUrl || "",
    safetyDataUrl: material.safetyDataUrl || "",
    manufacturerUrl: material.manufacturerUrl || "",
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
  // =====================================================
  // SUPRESSION
  // =====================================================

  async function handleDelete(id) {
    if (!confirm("Supprimer ce matériau ?")) return;

    await fetch(`${API_URL}/api/materials/${id}`, {
      method: "DELETE",
    });

    loadMaterials();
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-orange-400">
            Admin
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Catalogue matériaux
          </h1>

          <p className="mt-3 text-zinc-400">
            Gestion long terme des matériaux Polymaker / Fiberon / partenaires.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-3xl border border-white/10 bg-zinc-900 p-6"
        >
          <h2 className="mb-6 text-2xl font-black">
            {editingId ? "Modifier le matériau" : "Ajouter un matériau"}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Nom"
              value={form.name}
              onChange={(v) => updateField("name", v)}
              required
            />

            <Input
              label="Marque"
              value={form.brand}
              onChange={(v) => updateField("brand", v)}
            />

            <Input
              label="Famille"
              placeholder="PLA, PETG, ASA, TPU..."
              value={form.family}
              onChange={(v) => updateField("family", v)}
            />

            <Input
              label="Catégorie"
              placeholder="Standard, Technique, Composite..."
              value={form.category}
              onChange={(v) => updateField("category", v)}
            />

            <div>
  <label className="mb-2 block text-sm font-black uppercase tracking-widest text-zinc-400">
    Image matériau
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      uploadImage(e.target.files?.[0])
    }
    className="w-full rounded-2xl border border-white/10 bg-black p-4 text-white"
  />

  {form.imageUrl && (
    <img
      src={form.imageUrl}
      alt="preview"
      className="mt-3 h-28 rounded-xl border border-white/10"
    />
  )}
</div>

            <Input
              label="Couleurs"
              placeholder="Noir, Blanc, Gris"
              value={form.colors}
              onChange={(v) => updateField("colors", v)}
            />

            <Input
              label="Applications"
              placeholder="Prototype, Atelier, Extérieur"
              value={form.applications}
              onChange={(v) => updateField("applications", v)}
            />

            <Input
             label="Points forts"
             placeholder="Facile à imprimer, Bonne finition, Faible retrait"
             value={form.strengths}
             onChange={(v) => updateField("strengths", v)}
            />

            <Input
              label="Ordre d’affichage"
              type="number"
              value={form.sortOrder}
              onChange={(v) => updateField("sortOrder", v)}
            />

            <Input
            label="Prix indicatif €"
            type="number"
            value={form.price}
            onChange={(v) => updateField("price", v)}
            />

            <Input
            label="Stock"
            type="number"
            value={form.stock}
            onChange={(v) => updateField("stock", v)}
            />

            <Input
            label="Délai"
            placeholder="En stock, 24h, 72h, sur commande..."
            value={form.leadTime}
            onChange={(v) => updateField("leadTime", v)}
            />

            <div>
  <label className="mb-2 block text-sm font-black uppercase tracking-widest text-zinc-400">
    Fiche technique PDF
  </label>

  <input
    type="file"
    accept=".pdf"
    onChange={(e) =>
      uploadDatasheet(
        e.target.files?.[0]
      )
    }
    className="w-full rounded-2xl border border-white/10 bg-black p-4 text-white"
  />

  {form.datasheetUrl && (
    <a
      href={form.datasheetUrl}
      target="_blank"
      rel="noreferrer"
      className="mt-2 block text-orange-400"
    >
      Voir la fiche PDF
    </a>
  )}
</div>
          <Input
  label="Lien fabricant"
  value={form.manufacturerUrl}
  onChange={(v) => updateField("manufacturerUrl", v)}
/>

{/* ================= PERFORMANCES ================= */}
<div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/30 p-4">
  <h3 className="mb-4 text-lg font-black text-white">
    Performances MecaPrint3D
  </h3>

  <div className="grid gap-4 md:grid-cols-3">
    <Input label="Solidité" type="number" value={form.performance?.strength || 0}
      onChange={(v) => updateField("performance", { ...form.performance, strength: Number(v) })}
    />

    <Input label="Température" type="number" value={form.performance?.heatResistance || 0}
      onChange={(v) => updateField("performance", { ...form.performance, heatResistance: Number(v) })}
    />

    <Input label="Résistance chimique" type="number" value={form.performance?.chemicalResistance || 0}
      onChange={(v) => updateField("performance", { ...form.performance, chemicalResistance: Number(v) })}
    />

    <Input label="Flexibilité" type="number" value={form.performance?.flexibility || 0}
      onChange={(v) => updateField("performance", { ...form.performance, flexibility: Number(v) })}
    />

    <Input label="Facilité d'impression" type="number" value={form.performance?.easeOfPrint || 0}
      onChange={(v) => updateField("performance", { ...form.performance, easeOfPrint: Number(v) })}
    />

    <Input label="Qualité de surface" type="number" value={form.performance?.surfaceQuality || 0}
      onChange={(v) => updateField("performance", { ...form.performance, surfaceQuality: Number(v) })}
    />
  </div>
</div>

{/* ================= PRINT SETTINGS ================= */}
<div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/30 p-4">
  <h3 className="mb-4 text-lg font-black text-white">
    Préconisations d'impression
  </h3>

  <div className="grid gap-4 md:grid-cols-2">
    <Input label="Température buse" placeholder="220 - 240°C" value={form.printSettings?.nozzleTemp || ""}
      onChange={(v) => updateField("printSettings", { ...form.printSettings, nozzleTemp: v })}
    />

    <Input label="Température plateau" placeholder="60 - 80°C" value={form.printSettings?.bedTemp || ""}
      onChange={(v) => updateField("printSettings", { ...form.printSettings, bedTemp: v })}
    />

    <Input label="Température chambre" placeholder="40 - 70°C" value={form.printSettings?.chamberTemp || ""}
      onChange={(v) => updateField("printSettings", { ...form.printSettings, chamberTemp: v })}
    />

    <Input label="Vitesse d'impression" placeholder="50 - 200 mm/s" value={form.printSettings?.printSpeed || ""}
      onChange={(v) => updateField("printSettings", { ...form.printSettings, printSpeed: v })}
    />

    <Input label="Ventilation" placeholder="0 à 100%" value={form.printSettings?.fan || ""}
      onChange={(v) => updateField("printSettings", { ...form.printSettings, fan: v })}
    />

    <Input label="Séchage" placeholder="55°C pendant 6 heures" value={form.printSettings?.drying || ""}
      onChange={(v) => updateField("printSettings", { ...form.printSettings, drying: v })}
    />
  </div>

  <div className="mt-6 flex flex-wrap gap-6">
    <Checkbox label="Caisson recommandé" checked={form.printSettings?.enclosureRecommended || false}
      onChange={(checked) => updateField("printSettings", { ...form.printSettings, enclosureRecommended: checked })}
    />

    <Checkbox label="Filament abrasif" checked={form.printSettings?.abrasive || false}
      onChange={(checked) => updateField("printSettings", { ...form.printSettings, abrasive: checked })}
    />

    <Checkbox label="Sensible à l'humidité" checked={form.printSettings?.hygroscopic || false}
      onChange={(checked) => updateField("printSettings", { ...form.printSettings, hygroscopic: checked })}
    />
  </div>
</div>

{/* ================= PHYSICAL ================= */}
<div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/30 p-4">
  <h3 className="mb-4 text-lg font-black text-white">
    Propriétés physiques
  </h3>

  <div className="grid gap-4 md:grid-cols-2">
    <Input label="Densité" placeholder="1.24 g/cm³" value={form.physical?.density || ""}
      onChange={(v) => updateField("physical", { ...form.physical, density: v })}
    />

    <Input label="Retrait" placeholder="0.2 - 0.5%" value={form.physical?.shrinkage || ""}
      onChange={(v) => updateField("physical", { ...form.physical, shrinkage: v })}
    />
  </div>
</div>

{/* ================= MECHANICAL ================= */}
<div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/30 p-4">
  <h3 className="mb-4 text-lg font-black text-white">
    Propriétés mécaniques
  </h3>

  <div className="grid gap-4 md:grid-cols-2">
    <Input label="Résistance traction" placeholder="45 MPa" value={form.mechanical?.tensileStrength || ""}
      onChange={(v) => updateField("mechanical", { ...form.mechanical, tensileStrength: v })}
    />

    <Input label="Module de Young" placeholder="2.6 GPa" value={form.mechanical?.youngModulus || ""}
      onChange={(v) => updateField("mechanical", { ...form.mechanical, youngModulus: v })}
    />

    <Input label="Résistance flexion" placeholder="80 MPa" value={form.mechanical?.bendingStrength || ""}
      onChange={(v) => updateField("mechanical", { ...form.mechanical, bendingStrength: v })}
    />

    <Input label="Résistance impact" placeholder="5 kJ/m²" value={form.mechanical?.impactStrength || ""}
      onChange={(v) => updateField("mechanical", { ...form.mechanical, impactStrength: v })}
    />

    <Input label="Allongement rupture" placeholder="10%" value={form.mechanical?.elongationAtBreak || ""}
      onChange={(v) => updateField("mechanical", { ...form.mechanical, elongationAtBreak: v })}
    />
  </div>
</div>

{/* ================= THERMAL ================= */}
<div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/30 p-4">
  <h3 className="mb-4 text-lg font-black text-white">
    Propriétés thermiques
  </h3>

  <div className="grid gap-4 md:grid-cols-3">
    <Input label="HDT" placeholder="55°C" value={form.thermal?.hdt || ""}
      onChange={(v) => updateField("thermal", { ...form.thermal, hdt: v })}
    />

    <Input label="Transition vitreuse" placeholder="60°C" value={form.thermal?.glassTransition || ""}
      onChange={(v) => updateField("thermal", { ...form.thermal, glassTransition: v })}
    />

    <Input label="Température de fusion" placeholder="150 - 170°C" value={form.thermal?.meltingTemp || ""}
      onChange={(v) => updateField("thermal", { ...form.thermal, meltingTemp: v })}
    />
  </div>
</div>

</div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-black uppercase tracking-widest text-zinc-400">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-black p-4 text-white outline-none focus:border-orange-500"
            />
          </div>

          <label className="mt-4 flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => updateField("isActive", e.target.checked)}
            />
            Matériau actif sur le site
          </label>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-orange-500 px-6 py-3 font-black text-black hover:bg-orange-400"
            >
              {loading ? "Enregistrement..." : editingId ? "Modifier" : "Ajouter"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyMaterial);
                }}
                className="rounded-full border border-white/10 px-6 py-3 font-bold text-zinc-300 hover:border-orange-500"
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        <div className="grid gap-4">
          {materials.map((material) => (
            <div
              key={material._id}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-zinc-900 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-black">
                  {material.imageUrl ? (
                    <img
                      src={material.imageUrl}
                      alt={material.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                      Image
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-black">
                    {material.name}
                  </h3>

                  <p className="text-sm text-zinc-400">
                    {material.brand} — {material.family || "Famille non définie"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                   {material.isActive ? "Actif" : "Masqué"}
                  </p>
                </div>
              </div>

             <div className="flex gap-2">

  {/* ================= MODIFIER ================= */}
  <button
    onClick={() => handleEdit(material)}
    className="
      rounded-full
      border border-orange-500/30
      px-4 py-2
      text-sm font-bold
      text-orange-300
      hover:bg-orange-500
      hover:text-black
    "
  >
    Modifier
  </button>

  {/* ================= DUPLIQUER ================= */}
  <button
    onClick={() => handleDuplicate(material)}
    className="
      rounded-full
      border border-blue-500/30
      px-4 py-2
      text-sm font-bold
      text-blue-300
      hover:bg-blue-500
      hover:text-black
    "
  >
    Dupliquer
  </button>

  {/* ================= SUPPRIMER ================= */}
  <button
    onClick={() => handleDelete(material._id)}
    className="
      rounded-full
      border border-red-500/30
      px-4 py-2
      text-sm font-bold
      text-red-300
      hover:bg-red-500
      hover:text-black
    "
  >
    Supprimer
  </button>

</div>
            </div>
          ))}

          {!materials.length && (
            <div className="rounded-3xl border border-white/10 bg-zinc-900 p-8 text-center text-zinc-400">
              Aucun matériau pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black uppercase tracking-widest text-zinc-400">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black p-4 text-white outline-none focus:border-orange-500"
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-zinc-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}