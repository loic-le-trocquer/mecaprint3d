// ================= IMPORTS =================
import { ArrowRight, Sparkles, Play } from "lucide-react";
import FadeInSection from "./ui/FadeInSection";

// ================= HERO COMPONENT =================
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

  const primaryButton = hero.primaryButton || "Demander un devis";
  const secondaryButton = hero.secondaryButton || "Découvrir nos univers";

  const backgroundVideo = hero.videoUrl || "";

  const backgroundImage =
    hero.imageUrl ||
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80";

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-black pt-36 text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        {backgroundVideo ? (
          <video
            className="h-full w-full scale-105 object-cover animate-[heroZoom_18s_ease-in-out_infinite_alternate]"
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
            className="h-full w-full scale-105 object-cover animate-[heroZoom_18s_ease-in-out_infinite_alternate]"
          />
        )}

        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-orange-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* LIGHT GLOWS */}
        <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-[360px] w-[360px] rounded-full bg-amber-400/10 blur-3xl" />

        {/* GRID */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-[calc(92vh-9rem)] max-w-7xl items-center px-6 py-10 lg:px-8">
        <FadeInSection className="max-w-5xl">
          {/* BADGE */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-white/10 px-4 py-2 text-sm font-bold text-orange-100 shadow-lg shadow-black/30 backdrop-blur-xl">
            <Sparkles size={16} className="text-orange-400" />
            {badge}
          </div>

          {/* TITLE */}
          <h1 className="max-w-6xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-7xl">
            {title}{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-200 to-white bg-clip-text text-transparent">
              {highlight}
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-200 sm:text-xl">
            {description}
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#devis"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-base font-black text-white shadow-[0_0_35px_rgba(249,115,22,0.35)] transition duration-300 hover:-translate-y-1 hover:bg-orange-400"
            >
              {primaryButton}
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </a>

            <a
              href="#univers"
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/20"
            >
              <Play size={16} className="text-orange-300" />
              {secondaryButton}
            </a>
          </div>

          {/* MINI KPI */}
          <div className="mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
            <HeroKpi value="3D" label="Fabrication additive" />
            <HeroKpi value="Cover" label="Finition & rénovation" />
            <HeroKpi value="Sur-mesure" label="Conception adaptée" />
          </div>
        </FadeInSection>
      </div>

      {/* BOTTOM FADE */}
      <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black to-transparent" />

      <style>{`
        @keyframes heroZoom {
          from {
            transform: scale(1.05);
          }
          to {
            transform: scale(1.14);
          }
        }
      `}</style>
    </section>
  );
}

// ================= MINI KPI =================
function HeroKpi({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm font-medium text-zinc-400">{label}</p>
    </div>
  );
}