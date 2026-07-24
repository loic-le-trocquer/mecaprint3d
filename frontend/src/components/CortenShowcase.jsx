import {
  ArrowRight,
  Fence,
  FlameKindling,
  Flower2,
  PanelsTopLeft,
} from "lucide-react";
import FadeInSection from "./ui/FadeInSection";

const products = [
  {
    icon: Fence,
    title: "Bordures de jardin",
    description:
      "Des lignes nettes et durables pour structurer massifs, allées et espaces paysagers.",
  },
  {
    icon: Flower2,
    title: "Jardinières & bacs",
    description:
      "Formats standards ou réalisations sur mesure pour terrasses, entrées et jardins.",
  },
  {
    icon: PanelsTopLeft,
    title: "Claustras & panneaux",
    description:
      "Décors, séparations et écrans extérieurs découpés selon votre projet.",
  },
  {
    icon: FlameKindling,
    title: "Braseros & créations",
    description:
      "Pièces fortes pour aménager un extérieur chaleureux et singulier.",
  },
];

export default function CortenShowcase() {
  return (
    <section
      id="corten"
      className="relative overflow-hidden bg-[#12100e] py-24 sm:py-32"
    >
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_18%_20%,rgba(180,83,9,.28),transparent_34%),radial-gradient(circle_at_85%_75%,rgba(120,53,15,.22),transparent_35%)]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(115deg,transparent_45%,#fff_46%,transparent_47%)] [background-size:38px_38px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <FadeInSection>
          <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-500">
                Home & Outdoor
              </p>
              <h2 className="mt-6 text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-7xl">
                L’acier Corten,
                <span className="block text-amber-600">
                  une matière qui vit.
                </span>
              </h2>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-stone-300">
                MecaPrint3D imagine des aménagements extérieurs robustes et
                élégants, conçus avec notre partenaire chaudronnier. La patine
                naturelle du Corten protège l’acier et donne à chaque création
                une identité unique.
              </p>
              <a
                href="#devis"
                className="group mt-9 inline-flex items-center gap-3 rounded-full bg-amber-700 px-7 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-amber-600"
              >
                Étudier mon projet extérieur
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {products.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="group rounded-3xl border border-amber-700/20 bg-black/30 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:bg-black/45"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-600/30 bg-amber-900/30 text-amber-500">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-white">{title}</h3>
                  <p className="mt-3 leading-relaxed text-stone-400">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
