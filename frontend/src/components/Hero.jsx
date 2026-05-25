// ================= IMPORTS =================
import { ArrowRight, Sparkles, Wrench, Layers } from "lucide-react";

// ================= HERO COMPONENT =================
export default function Hero({ content = {} }) {

  // ================= DATA HERO =================
  const hero = content.hero || {};

  // ================= TEXTES =================
  const badge =
    hero.badge || "Atelier de conception & rénovation sur mesure";

  const title =
    hero.title || "Fabrication 3D, covering premium & rénovation design";

  const highlight =
    hero.highlight || "sur mesure";

  const description =
    hero.description ||
    "De la pièce technique à la rénovation complète, MecaPrint3D conçoit, fabrique et transforme vos projets grâce à la fabrication numérique, au covering décoratif et au sur-mesure.";

  // ================= BOUTONS =================
  const primaryButton =
    hero.primaryButton || "Demander un devis";

  const secondaryButton =
    hero.secondaryButton || "Découvrir nos univers";

  // ================= MEDIA =================
  const backgroundVideo = hero.videoUrl || "";

  const backgroundImage =
    hero.imageUrl ||
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80";

  // ================= RENDER =================
  return (

    <section className="relative min-h-screen overflow-hidden bg-slate-950 pt-20 text-white">

      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">

        {/* VIDEO */}
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

          // IMAGE FALLBACK
          <img
            src={backgroundImage}
            alt="Atelier MecaPrint3D"
            className="h-full w-full object-cover"
          />

        )}

        {/* OVERLAYS */}
        <div className="absolute inset-0 bg-slate-950/75" />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-orange-950/30" />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-6 py-16 lg:px-8">

        <div className="max-w-5xl">

          {/* ================= BADGE ================= */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-white/10 px-4 py-2 text-sm font-medium text-orange-100 backdrop-blur">

            <Sparkles
              size={16}
              className="text-orange-400"
            />

            {badge}

          </div>

          {/* ================= TITLE ================= */}
          <h1 className="max-w-5xl text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-7xl">

            {title}{" "}

            <span className="bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
              {highlight}
            </span>

          </h1>

          {/* ================= DESCRIPTION ================= */}
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">

            {description}

          </p>

          {/* ================= BUTTONS ================= */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            {/* BTN DEVIS */}
            <a
              href="#devis"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400"
            >

              {primaryButton}

              <ArrowRight size={18} />

            </a>

            {/* BTN UNIVERS */}
            <a
              href="#univers"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >

              {secondaryButton}

            </a>

          </div>

          {/* ================= MINI UNIVERS ================= */}
          <div className="mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">

            {/* TECH */}
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur transition hover:border-orange-500/40 hover:bg-white/15">

              <Wrench
                className="mb-3 text-orange-400"
                size={24}
              />

              <h3 className="font-bold tracking-wide">
                TECH
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">

                Impression 3D, scan, CAO et fabrication de pièces techniques.

              </p>

            </div>

            {/* DESIGN */}
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur transition hover:border-orange-500/40 hover:bg-white/15">

              <Layers
                className="mb-3 text-orange-400"
                size={24}
              />

              <h3 className="font-bold tracking-wide">
                DESIGN
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">

                Covering, rénovation intérieure, mobilier, cuisines et commerces.

              </p>

            </div>

            {/* CAMPER */}
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur transition hover:border-orange-500/40 hover:bg-white/15">

              <Sparkles
                className="mb-3 text-orange-400"
                size={24}
              />

              <h3 className="font-bold tracking-wide">
                CAMPER
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">

                Vans, fourgons et camping-cars personnalisés et rénovés sur mesure.

              </p>

            </div>

          </div>

        </div>

      </div>

    </section>

  );
}
