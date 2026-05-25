import { ArrowRight, Sparkles, Wrench, Layers } from "lucide-react";

export default function Hero({ content = {} }) {
  const hero = content.hero || {};

  const badge =
    hero.badge || "Atelier de conception & rénovation sur mesure";

  const title =
    hero.title || "Fabrication 3D, covering premium & rénovation design";

  const highlight = hero.highlight || "sur mesure";

  const description =
    hero.description ||
    "De la pièce technique à la rénovation complète, MecaPrint3D conçoit, fabrique et transforme vos projets grâce à la fabrication numérique, au covering décoratif et au sur-mesure.";

  const primaryButton =
    hero.primaryButton || "Demander un devis";

  const secondaryButton =
    hero.secondaryButton || "Découvrir nos univers";

  const backgroundVideo = hero.videoUrl || "";
 
  const backgroundImage =
  hero.imageUrl ||
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80";
 
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-slate-950 text-white">
      {/* Background video / image */}
      <div className="absolute inset-0">
        {backgroundVideo ? (
          <video
            className="h-full w-full object-cover"
            src={backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={backgroundImage}
            alt="Atelier MecaPrint3D"
            className="h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-orange-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl items-center px-6 py-24 lg:px-8">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-white/10 px-4 py-2 text-sm font-medium text-orange-100 backdrop-blur">
            <Sparkles size={16} className="text-orange-400" />
            {badge}
          </div>

          {/* Title */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            {title}{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
              {highlight}
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            {description}
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#devis"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400"
            >
              {primaryButton}
              <ArrowRight size={18} />
            </a>

            <a
              href="#univers"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              {secondaryButton}
            </a>
          </div>

          {/* Mini univers */}
          <div className="mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <Wrench className="mb-3 text-orange-400" size={24} />
              <h3 className="font-semibold">TECH</h3>
              <p className="mt-1 text-sm text-slate-300">
                Impression 3D, scan, CAO, pièces techniques.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <Layers className="mb-3 text-orange-400" size={24} />
              <h3 className="font-semibold">DESIGN</h3>
              <p className="mt-1 text-sm text-slate-300">
                Covering, mobilier, cuisines, commerces, hôtels.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <Sparkles className="mb-3 text-orange-400" size={24} />
              <h3 className="font-semibold">CAMPER</h3>
              <p className="mt-1 text-sm text-slate-300">
                Vans, camping-cars, rénovation et personnalisation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}