export default function MaterialProductSheet({ material, onClose }) {
  if (!material) return null;

  const hasImage = Boolean(material.imageUrl);

  const strengths = material.strengths || [];
  const applications = material.applications || [];
  const colors = material.colors || [];

  const performance = material.performance || {};
  const printSettings = material.printSettings || {};
  const physical = material.physical || {};
  const mechanical = material.mechanical || {};
  const thermal = material.thermal || {};

  return (
    <div className="fixed inset-0 z-[230] overflow-auto bg-black/90 p-6 backdrop-blur">
      <button
  type="button"
  onClick={onClose}
  className="
    fixed
    top-4
    right-4
    z-[9999]
    rounded-full
    bg-black/80
    border border-orange-500/50
    px-5
    py-3
    font-black
    text-white
    shadow-lg
    backdrop-blur-md
    transition
    hover:bg-orange-500
    hover:text-black
  "
>
  ✕ Fermer
</button>

      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-orange-500/5">
          {hasImage && (
            <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-black">
              <img
                src={material.imageUrl}
                alt={material.name}
                className="h-72 w-full object-contain p-6"
              />
            </div>
          )}

          <p className="mb-3 text-sm font-black uppercase tracking-widest text-orange-400">
            Fiche matériau
          </p>

          <h2 className="text-4xl font-black text-white">
            {material.name}
          </h2>

          <p className="mt-2 text-zinc-400">
            {material.brand || "Marque non renseignée"} ·{" "}
            {material.family || "Famille non renseignée"}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {material.category && <Badge strong>{material.category}</Badge>}
            {material.range && <Badge>{material.range}</Badge>}
            {material.isFeatured && <Badge>Matériau recommandé</Badge>}
          </div>

          {material.description && (
            <p className="mt-8 text-lg leading-relaxed text-zinc-300">
              {material.description}
            </p>
          )}

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoCard
              title="Prix indicatif"
              text={material.price ? `${material.price} €` : "Sur demande"}
            />
            <InfoCard
              title="Stock"
              text={material.stock ? `${material.stock} bobine(s)` : "Sur commande"}
            />
            <InfoCard
              title="Délai"
              text={material.leadTime || "Sur demande"}
            />
          </div>

          {!!applications.length && (
            <Section title="Applications">
              <TagList items={applications} />
            </Section>
          )}

          {!!strengths.length && (
            <Section title="Points forts">
              <TagList items={strengths} orange />
            </Section>
          )}

          <Section title="Performances MecaPrint3D">
            <div className="grid gap-4 md:grid-cols-3">
              <Rating label="Solidité" value={performance.strength} />
              <Rating label="Température" value={performance.heatResistance} />
              <Rating label="Résistance chimique" value={performance.chemicalResistance} />
              <Rating label="Flexibilité" value={performance.flexibility} />
              <Rating label="Facilité d'impression" value={performance.easeOfPrint} />
              <Rating label="Qualité de surface" value={performance.surfaceQuality} />
            </div>
          </Section>

          <Section title="Préconisations d'impression">
            <div className="grid gap-4 md:grid-cols-2">
              <Spec label="Température buse" value={printSettings.nozzleTemp} />
              <Spec label="Température plateau" value={printSettings.bedTemp} />
              <Spec label="Température chambre" value={printSettings.chamberTemp} />
              <Spec label="Vitesse d'impression" value={printSettings.printSpeed} />
              <Spec label="Ventilation" value={printSettings.fan} />
              <Spec label="Séchage" value={printSettings.drying} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {printSettings.enclosureRecommended && <Badge>Caisson recommandé</Badge>}
              {printSettings.abrasive && <Badge>Filament abrasif</Badge>}
              {printSettings.hygroscopic && <Badge>Sensible à l'humidité</Badge>}
            </div>
          </Section>

          {(physical.density || physical.shrinkage) && (
            <Section title="Propriétés physiques">
              <div className="grid gap-4 md:grid-cols-2">
                <Spec label="Densité" value={physical.density} />
                <Spec label="Retrait" value={physical.shrinkage} />
              </div>
            </Section>
          )}

          {(mechanical.tensileStrength ||
            mechanical.youngModulus ||
            mechanical.bendingStrength ||
            mechanical.impactStrength ||
            mechanical.elongationAtBreak) && (
            <Section title="Propriétés mécaniques">
              <div className="grid gap-4 md:grid-cols-2">
                <Spec label="Résistance traction" value={mechanical.tensileStrength} />
                <Spec label="Module de Young" value={mechanical.youngModulus} />
                <Spec label="Résistance flexion" value={mechanical.bendingStrength} />
                <Spec label="Résistance impact" value={mechanical.impactStrength} />
                <Spec label="Allongement rupture" value={mechanical.elongationAtBreak} />
              </div>
            </Section>
          )}

          {(thermal.hdt || thermal.glassTransition || thermal.meltingTemp) && (
            <Section title="Propriétés thermiques">
              <div className="grid gap-4 md:grid-cols-3">
                <Spec label="HDT" value={thermal.hdt} />
                <Spec label="Transition vitreuse" value={thermal.glassTransition} />
                <Spec label="Température de fusion" value={thermal.meltingTemp} />
              </div>
            </Section>
          )}

          {!!colors.length && (
            <Section title="Coloris disponibles">
              <TagList items={colors} />
            </Section>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#devis"
              onClick={onClose}
              className="rounded-full bg-orange-500 px-6 py-3 font-black text-black transition hover:bg-orange-400"
            >
              Demander un devis
            </a>

            {material.datasheetUrl && (
              <a
                href={material.datasheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-orange-500 px-6 py-3 font-black text-orange-400 transition hover:bg-orange-500 hover:text-black"
              >
                Fiche technique PDF
              </a>
            )}

            {material.printingGuideUrl && (
              <a
                href={material.printingGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-6 py-3 font-black text-white transition hover:border-orange-500 hover:text-orange-400"
              >
                Guide d'impression
              </a>
            )}

            {material.safetyDataUrl && (
              <a
                href={material.safetyDataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-6 py-3 font-black text-white transition hover:border-orange-500 hover:text-orange-400"
              >
                Fiche sécurité
              </a>
            )}

            {material.manufacturerUrl && (
              <a
                href={material.manufacturerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-6 py-3 font-black text-white transition hover:border-orange-500 hover:text-orange-400"
              >
                Site fabricant
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 px-6 py-3 font-black text-white transition hover:border-orange-500 hover:text-orange-400"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-black/30 p-6">
      <h3 className="mb-5 text-2xl font-black text-white">{title}</h3>
      {children}
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h4 className="mb-2 text-sm font-black uppercase tracking-widest text-orange-400">
        {title}
      </h4>
      <p className="leading-relaxed text-zinc-300">{text}</p>
    </div>
  );
}

function Spec({ label, value }) {
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
      <div className="text-xs font-black uppercase tracking-widest text-zinc-500">
        {label}
      </div>
      <div className="mt-1 font-semibold text-white">{value}</div>
    </div>
  );
}

function Rating({ label, value }) {
  const score = Number(value || 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-3 text-xs font-black uppercase tracking-widest text-orange-400">
        {label}
      </p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <span
            key={level}
            className={`h-2.5 w-2.5 rounded-full ${
              level <= score
                ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function TagList({ items, orange = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={`rounded-full border px-4 py-2 text-sm ${
            orange
              ? "border-orange-500/20 bg-orange-500/10 text-orange-300"
              : "border-white/10 bg-white/5 text-zinc-200"
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Badge({ children, strong = false }) {
  return (
    <span
      className={
        strong
          ? "rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black"
          : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
      }
    >
      {children}
    </span>
  );
}