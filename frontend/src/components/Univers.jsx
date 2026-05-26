// ================= IMPORTS =================
import FadeInSection from "./ui/FadeInSection";

// ================= UNIVERS COMPONENT =================
export default function Univers({ content }) {

  // ================= DATA =================
  const intro = content?.universIntro || {};
  const items = content?.univers?.items || [];

  // ================= RENDER =================
  return (

    <section 
    id="univers"
    className="relative overflow-hidden border-y border-white/5 bg-black py-28">

      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.18),transparent_55%)]" />

      {/* ================= CONTAINER ================= */}
      <div className="relative mx-auto max-w-7xl px-6">

        {/* ================= FADE SECTION ================= */}
        <FadeInSection>

          {/* ================= INTRO ================= */}
          <div className="max-w-4xl">

            {/* EYEBROW */}
            <p className="text-sm font-black uppercase tracking-[0.35em] text-orange-500">

              {intro.eyebrow}

            </p>

            {/* TITLE */}
            <h2 className="mt-6 text-5xl font-black leading-none tracking-tight text-white md:text-7xl">

              {intro.title}

            </h2>

            {/* DESCRIPTION */}
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-400">

              {intro.description}

            </p>

          </div>

          {/* ================= CARDS ================= */}
          <div className="mt-20 grid gap-8 md:grid-cols-3">

            {items.map((item, index) => (

              <article
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-[0_0_40px_rgba(249,115,22,0.18)]"
              >

                {/* ================= IMAGE ================= */}
                <div className="relative h-80 overflow-hidden">

                  {item.imageUrl ? (

                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                  ) : (

                    <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(249,115,22,0.15),rgba(255,255,255,0.03))]">

                      <span className="text-7xl font-black text-orange-500/10">

                        {String(index + 1).padStart(2, "0")}

                      </span>

                    </div>

                  )}

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                </div>

                {/* ================= CONTENT ================= */}
                <div className="relative p-8">

                  {/* SUBTITLE */}
                  <p className="text-sm font-black uppercase tracking-[0.3em] text-orange-400">

                    {item.subtitle}

                  </p>

                  {/* TITLE */}
                  <h3 className="mt-4 text-3xl font-black text-white">

                    {item.title}

                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-5 text-base leading-relaxed text-zinc-400">

                    {item.description}

                  </p>

                  {/* CTA */}
                  <a
                    href={item.link || "#"}
                    className="mt-8 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-orange-400 transition hover:text-orange-300"
                  >

                    Découvrir

                    <span className="transition duration-300 group-hover:translate-x-1">
                      →
                    </span>

                  </a>

                </div>

              </article>

            ))}

          </div>

        </FadeInSection>

      </div>

    </section>

  );
}