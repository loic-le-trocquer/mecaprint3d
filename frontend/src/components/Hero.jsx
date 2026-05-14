import logo from "../assets/logo.png";

export default function Hero({ content }) {
  const videoUrl = content?.heroVideoUrl;
  const imageUrl = content?.heroImageUrl;

  return (
    <section className="relative min-h-screen overflow-hidden">

      {videoUrl ? (
        <video
          key={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src={imageUrl || "/fallback-hero.jpg"}
          alt="Mecaprint3D"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-black" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <img src={logo} alt="Mecaprint3D" className="mb-8 w-44 drop-shadow-2xl" />

        <div className="mb-6 rounded-full border border-orange-500/40 bg-orange-500/10 px-5 py-2 text-sm text-orange-300 backdrop-blur-sm">
          Atelier de fabrication • Réparation • Prototypage
        </div>

        <h1 className="max-w-5xl text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
          {content?.heroTitle || "L’impression 3D est devenue accessible."}
          <span className="mt-4 block text-orange-400">
            {content?.heroSubtitle || "La conception reste la clé d’une pièce performante."}
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          {content?.description ||
            "MECAPRINT3D accompagne particuliers et industriels dans la conception, la réparation et la fabrication de pièces techniques sur mesure."}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a href="#devis" className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-orange-500/30 hover:bg-orange-400">
            {content?.primaryButton || "Demander un devis"}
          </a>

          <a href="#services" className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md hover:bg-white/10">
            {content?.secondaryButton || "Voir les services"}
          </a>
        </div>
      </div>
    </section>
  );
}