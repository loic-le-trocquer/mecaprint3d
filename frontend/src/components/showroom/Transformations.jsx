
// ================= IMPORTS =================
import FadeInSection from "../ui/FadeInSection";
import BeforeAfterSlider from "./BeforeAfterSlider";

// ================= TRANSFORMATIONS =================
export default function Transformations({ content }) {
  const intro = content?.transformationsIntro || {};
  const transformations = content?.transformations || [];

  if (!transformations.length) return null;

  return (
    
    <section 
    
    id="showroom"
    className="relative overflow-hidden border-t border-white/10 bg-zinc-950 px-6 py-28">

          {/* ================= BACKGROUND ================= */}
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-3xl" />

          {/* ================= CONTAINER ================= */}
          <div className="relative z-10 mx-auto max-w-7xl">

            <FadeInSection>

          {/* ================= INTRO ================= */}
          <div className="mb-20 max-w-4xl">

            <p className="text-sm font-black uppercase tracking-[0.35em] text-orange-500">

              {intro.eyebrow || "Transformations"}

            </p>

            <h2 className="mt-6 text-5xl font-black leading-none tracking-tight text-white md:text-7xl">

              {intro.title || "Avant / Après premium"}

            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-400">

              {intro.description ||
  "Découvrez l’impact des réalisations MecaPrint3D à travers des transformations avant/après immersives."}

            </p>

          </div>

          {/* ================= GRID ================= */}
            <div className="space-y-12">

            {transformations.map((item, index) => {

             if (!item.beforeImage || !item.afterImage) {
             return null;
            }

             return (

            <BeforeAfterSlider
                key={index}
                before={item.beforeImage}
                after={item.afterImage}
                title={item.title}
                category={item.category}
             />

    );

  })}

</div>

        </FadeInSection>

      </div>

    </section>

  );
}