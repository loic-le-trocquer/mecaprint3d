// ================= IMPORTS =================
import { useMemo, useState } from "react";

import normalizeMedia from "./normalizeMedia";
import MediaPreview from "./MediaPreview";

// ================= REALISATION CARD =================
export default function RealisationCard({
  item,
  onOpen,
}) {

  // ================= MEDIA =================
  const mediaList =
    useMemo(() => normalizeMedia(item), [item]);

  // ================= ACTIVE MEDIA =================
  const [activeIndex, setActiveIndex] =
    useState(0);

  const activeMedia = mediaList[activeIndex];

  // ================= RENDER =================
  return (

    <article className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-[0_0_50px_rgba(249,115,22,0.15)]">

      {/* ================= MAIN MEDIA ================= */}
      {activeMedia && (

        <button
          type="button"
          onClick={() => onOpen(item, activeIndex)}
          className="relative block h-[420px] w-full overflow-hidden bg-black text-left"
        >

          {/* MEDIA */}
          <MediaPreview
            media={activeMedia}
            title={item.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {/* TOP BADGES */}
          <div className="absolute left-5 top-5 flex items-center gap-3">

            {/* CATEGORY */}
            <div className="rounded-full border border-orange-500/20 bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-300 backdrop-blur-xl">

              {item.category || "Projet"}

            </div>

            {/* TYPE */}
            <div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl">

              {activeMedia.type === "video"
                ? "Vidéo"
                : "Galerie"}

            </div>

          </div>

          {/* CONTENT OVERLAY */}
          <div className="absolute inset-x-0 bottom-0 p-8">

            {/* TITLE */}
            <h3 className="text-3xl font-black text-white drop-shadow-xl">

              {item.title}

            </h3>

            {/* DESCRIPTION */}
            <p className="mt-3 max-w-2xl text-zinc-200 drop-shadow-lg">

              {item.description}

            </p>

            {/* CTA */}
            <div className="mt-6 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-orange-300 transition duration-300 group-hover:translate-x-1">

              Voir le projet

              <span className="transition duration-300 group-hover:translate-x-1">
                →
              </span>

            </div>

          </div>

        </button>

      )}

      {/* ================= THUMBNAILS ================= */}
      {mediaList.length > 1 && (

        <div className="flex gap-3 overflow-x-auto border-t border-white/10 bg-black/40 p-4">

          {mediaList.map((media, mediaIndex) => (

            <button
              key={`${media.url}-${mediaIndex}`}
              type="button"
              onMouseEnter={() => setActiveIndex(mediaIndex)}
              onClick={() => setActiveIndex(mediaIndex)}
              className={`group/thumb relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border transition duration-300 ${
                mediaIndex === activeIndex
                  ? "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                  : "border-white/10 hover:border-orange-400"
              }`}
            >

              {/* VIDEO */}
              {media.type === "video" ? (

                <>
                  <video
                    src={media.url}
                    className="h-full w-full object-cover transition duration-500 group-hover/thumb:scale-105"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">

                    <span className="text-lg font-black text-white">
                      ▶
                    </span>

                  </div>

                </>

              ) : (

                <img
                  src={media.url}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover/thumb:scale-105"
                />

              )}

            </button>

          ))}

        </div>

      )}

    </article>

  );
}