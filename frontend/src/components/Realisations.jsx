import { useMemo, useState } from "react";

function normalizeMedia(item) {
  const media = Array.isArray(item.media)
    ? item.media.filter((m) => m?.url)
    : [];

  if (media.length) return media;

  if (item.imageUrl) {
    return [{ type: "image", url: item.imageUrl }];
  }

  return [];
}

function MediaPreview({ media, title, className = "" }) {
  if (!media?.url) return null;

  // ================= VIDEO =================
  if (media.type === "video") {
    return (
      <video
        src={media.url}
        className={className}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  // ================= IMAGE =================
  return (
    <img
      src={media.url}
      alt={title}
      className={className}
    />
  );
}

function RealisationCard({ item, onOpen }) {
  const mediaList = useMemo(() => normalizeMedia(item), [item]);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeMedia = mediaList[activeIndex];

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/30 transition duration-500 hover:-translate-y-1 hover:border-orange-500/40">

      {/* ================= MEDIA PRINCIPAL ================= */}
      {activeMedia && (
        <button
          type="button"
          onClick={() => onOpen(item, activeIndex)}
          className="relative block h-72 w-full overflow-hidden bg-black text-left"
        >
          <MediaPreview
            media={activeMedia}
            title={item.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>

          {/* Badge */}
          <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur">
            {activeMedia.type === "video" ? "Vidéo" : "Zoom"}
          </div>
        </button>
      )}

      {/* ================= MINIATURES ================= */}
      {mediaList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-black/30 p-3">

          {mediaList.map((media, mediaIndex) => (
            <button
              key={`${media.url}-${mediaIndex}`}
              type="button"
              onMouseEnter={() => setActiveIndex(mediaIndex)}
              onClick={() => setActiveIndex(mediaIndex)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border transition ${
                mediaIndex === activeIndex
                  ? "border-orange-500"
                  : "border-white/10 hover:border-orange-400"
              }`}
            >

              {/* VIDEO */}
              {media.type === "video" ? (
                <>
                  <video
                    src={media.url}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />

                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-xs font-black text-white">
                    ▶
                  </span>
                </>
              ) : (
                /* IMAGE */
                <img
                  src={media.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ================= TEXTE ================= */}
      <div className="p-6">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-400">
          {item.category}
        </p>

        <h3 className="text-2xl font-black">
          {item.title}
        </h3>

        <p className="mt-3 text-zinc-300">
          {item.description}
        </p>
      </div>
    </article>
  );
}

export default function Realisations({ content }) {
  const intro = content?.realisationsIntro || {};
  const realisations = content?.realisations || [];

  const [lightbox, setLightbox] = useState(null);

  if (!realisations.length) return null;

  const activeMedia = lightbox
    ? normalizeMedia(lightbox.item)[lightbox.index]
    : null;

  return (
    <section
      id="realisations"
      className="border-t border-white/10 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* ================= INTRO ================= */}
        <div className="mb-16 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            {intro.eyebrow}
          </p>

          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            {intro.title}
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-zinc-300">
            {intro.description}
          </p>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid gap-6 md:grid-cols-3">
          {realisations.map((item, index) => (
            <RealisationCard
              key={`${item.title}-${index}`}
              item={item}
              onOpen={(selectedItem, selectedIndex) =>
                setLightbox({
                  item: selectedItem,
                  index: selectedIndex,
                })
              }
            />
          ))}
        </div>
      </div>

      {/* ================= LIGHTBOX ================= */}
      {lightbox && activeMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur">

          {/* Fermer */}
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-black text-white transition hover:bg-orange-500"
          >
            Fermer
          </button>

          <div className="w-full max-w-6xl">

            <MediaPreview
              media={activeMedia}
              title={lightbox.item.title}
              className="max-h-[80vh] w-full rounded-3xl object-contain shadow-2xl shadow-black"
            />

            <div className="mt-4 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
                {lightbox.item.category}
              </p>

              <h3 className="text-2xl font-black text-white">
                {lightbox.item.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}