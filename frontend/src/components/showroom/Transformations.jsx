// ================= IMPORTS =================
import FadeInSection from "../ui/FadeInSection";
import BeforeAfterSlider from "./BeforeAfterSlider";

// ================= TRANSFORMATIONS =================
export default function Transformations() {

  return (

    <section className="relative overflow-hidden border-t border-white/10 bg-zinc-950 px-6 py-28">

      {/* ================= BACKGROUND ================= */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-3xl" />

      {/* ================= CONTAINER ================= */}
      <div className="relative z-10 mx-auto max-w-7xl">

        <FadeInSection>

          {/* ================= INTRO ================= */}
          <div className="mb-20 max-w-4xl">

            <p className="text-sm font-black uppercase tracking-[0.35em] text-orange-500">

              Transformations

            </p>

            <h2 className="mt-6 text-5xl font-black leading-none tracking-tight text-white md:text-7xl">

              Avant / Après premium

            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-400">

              Découvrez l’impact des réalisations MecaPrint3D à travers des transformations avant/après immersives.

            </p>

          </div>

          {/* ================= GRID ================= */}
          <div className="space-y-12">

            {/* ================= SLIDER 1 ================= */}
            <BeforeAfterSlider
              before="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"
              after="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80"
              title="Cuisine rénovée & covering premium"
              category="DESIGN"
            />

            {/* ================= SLIDER 2 ================= */}
            <BeforeAfterSlider
              before="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=80"
              after="https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1600&q=80"
              title="Transformation van & camping-car"
              category="CAMPER"
            />

          </div>

        </FadeInSection>

      </div>

    </section>

  );
}