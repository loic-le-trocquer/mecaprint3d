import { useMemo, useState } from "react";

import normalizeMedia from "./normalizeMedia";
import MediaPreview from "./MediaPreview";

export default function RealisationCard({
  item,
  onOpen,
}) {

  // ================= MEDIA =================
  const mediaList =
    useMemo(() => normalizeMedia(item), [item]);

  // ================= MEDIA ACTIVE =================
  const [activeIndex, setActiveIndex] =
    useState(0);

  const activeMedia = mediaList[activeIndex];

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/30 transition duration-500 hover:-translate-y-1 hover:border-orange-500/40">

      {/* MEDIA PRINCIPAL */}
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

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

          {/* BADGE */}
          <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur">

            {activeMedia.type === "video"
              ? "Vidéo"
              : "Zoom"}

          </div>

        </button>
      )}

      {/* MINIATURES */}
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

      {/* TEXTE */}
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