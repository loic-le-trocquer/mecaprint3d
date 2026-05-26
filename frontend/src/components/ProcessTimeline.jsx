// ================= IMPORTS =================
import FadeInSection from "./ui/FadeInSection";

// ================= DATA =================
const steps = [
  {
    number: "01",
    title: "Analyse du besoin",
    description:
      "Étude du projet, des contraintes techniques, du rendu attendu et des solutions adaptées.",
  },
  {
    number: "02",
    title: "Conception / Scan / CAO",
    description:
      "Création, modélisation, scan 3D ou rétroconception pour préparer une solution fiable et cohérente.",
  },
  {
    number: "03",
    title: "Fabrication & transformation",
    description:
      "Impression 3D, covering, rénovation, fabrication technique ou intégration des solutions partenaires.",
  },
  {
    number: "04",
    title: "Finition & livraison",
    description:
      "Contrôle visuel, ajustements, finitions et accompagnement jusqu’à la livraison du projet.",
  },
];

// ================= COMPONENT =================
export default function ProcessTimeline() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-zinc-950 px-6 py-28">
      {/* BACKGROUND */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <FadeInSection>

          {/* INTRO */}
          <div className="mb-20 max-w-4xl">

            <p className="text-sm font-black uppercase tracking-[0.35em] text-orange-500">
              Méthodologie
            </p>

            <h2 className="mt-6 text-5xl font-black leading-none tracking-tight text-white md:text-7xl">
              Une approche claire & structurée
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-400">
              Chaque projet suit une logique de conception, validation et fabrication afin de garantir un résultat cohérent, durable et adapté au besoin réel.
            </p>

          </div>

          {/* TIMELINE */}
          <div className="relative">

            {/* LINE */}
            <div className="absolute left-[30px] top-0 hidden h-full w-[2px] bg-gradient-to-b from-orange-500/0 via-orange-500 to-orange-500/0 md:block" />

            <div className="space-y-14">

              {steps.map((step) => (

                <div
                  key={step.number}
                  className="group relative flex flex-col gap-6 md:flex-row md:items-start"
                >

                  {/* NUMBER */}
                  <div className="relative z-10 flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-black text-xl font-black text-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.2)]">

                    {step.number}

                  </div>

                  {/* CARD */}
                  <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-xl transition duration-500 group-hover:-translate-y-1 group-hover:border-orange-500/40 group-hover:shadow-[0_0_40px_rgba(249,115,22,0.12)]">

                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/5 opacity-0 transition duration-500 group-hover:opacity-100" />

                    <div className="relative z-10">

                      <h3 className="text-3xl font-black text-white">
                        {step.title}
                      </h3>

                      <p className="mt-5 max-w-3xl leading-relaxed text-zinc-400">
                        {step.description}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </FadeInSection>
      </div>
    </section>
  );
}