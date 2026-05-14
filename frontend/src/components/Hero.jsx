import logo from "../assets/logo.png";
import workshopVideo from "../assets/videos/workshop.mp4";

export default function Hero({ content }) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={workshopVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-black" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <img
          src={logo}
          alt="Mecaprint3D"
          className="mb-8 w-44 drop-shadow-2xl"
        />

        <div className="mb-6 rounded-full border border-orange-500/40 bg-orange-500/10 px-5 py-2 text-sm text-orange-300 backdrop-blur-sm">
          Atelier de fabrication • Réparation • Prototypage
        </div>

        <h1 className="max-w-5xl text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
          {content?.heroTitle || "L’impression 3D est devenue accessible."}
          <span className="mt-4 block text-orange-400">
            {content?.heroSubtitle ||
              "La conception reste la clé d’une pièce performante."}
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          MECAPRINT3D accompagne particuliers et industriels dans la conception,
          la réparation et la fabrication de pièces techniques sur mesure.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#devis"
            className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-orange-500/30 transition-all duration-300 hover:bg-orange-400"
          >
            Demander un devis
          </a>

          <a
            href="https://wa.me/33600000000"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10"
          >
            WhatsApp
          </a>
        </div>

        <div className="mt-20 grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            ["+250", "Pièces réalisées"],
            ["3D", "Conception sur mesure"],
            ["PRO", "Réparation & prototypage"],
            ["B2B", "Partenaires industriels"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <div className="text-3xl font-black text-orange-400">
                {value}
              </div>
              <div className="mt-2 text-zinc-300">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/60">
        ↓
      </div>
    </section>
  );
}