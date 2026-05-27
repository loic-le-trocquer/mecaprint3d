// ================= IMPORTS =================
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import normalizeMedia from "./normalizeMedia";
import MediaPreview from "./MediaPreview";

// ================= SETTINGS =================
const SLIDE_DURATION = 3500;

// ================= REALISATION CARD =================
export default function RealisationCard({ item, onOpen }) {
  const mediaList = useMemo(() => normalizeMedia(item), [item]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const activeMedia = mediaList[activeIndex];

  // ================= AUTO SLIDER =================
  useEffect(() => {
    if (mediaList.length <= 1) return;
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev + 1 >= mediaList.length ? 0 : prev + 1
      );
      setProgressKey((prev) => prev + 1);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [mediaList.length, isHovered]);

  // ================= MANUAL CHANGE =================
  function handleSelectMedia(index) {
    setActiveIndex(index);
    setProgressKey((prev) => prev + 1);
  }

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="break-inside-avoid group relative mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-[0_0_50px_rgba(249,115,22,0.15)]"
    >
      {/* ================= MAIN MEDIA ================= */}
      {activeMedia && (
        <button
          type="button"
          onClick={() => onOpen(item, activeIndex)}
          className="relative block h-[420px] w-full overflow-hidden bg-black text-left"
        >
          {/* MEDIA AVEC EFFET CINÉMATIQUE */}
          <div
            key={activeMedia.url}
            className="absolute inset-0 animate-[fadeIn_700ms_ease-out]"
          >
            <MediaPreview
              media={activeMedia}
              title={item.title}
              className="h-full w-full object-cover transition duration-[3500ms] ease-out group-hover:scale-110"
            />
          </div>

          {/* EFFET LUMIÈRE */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-orange-500/10 opacity-0 transition duration-700 group-hover:opacity-100" />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

          {/* TOP BADGES */}
          <div className="absolute left-5 top-5 flex items-center gap-3">
            <div className="rounded-full border border-orange-500/20 bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-300 backdrop-blur-xl">
              {item.category || "Projet"}
            </div>

            <div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl">
              {activeMedia.type === "video" ? "Vidéo" : "Galerie"}
            </div>
          </div>

          {/* CONTENT */}
          <div className="absolute inset-x-0 bottom-0 p-8">
            <h3 className="text-3xl font-black text-white drop-shadow-xl">
              {item.title}
            </h3>

            <p className="mt-3 max-w-2xl text-zinc-200 drop-shadow-lg">
              {item.description}
            </p>

            <div className="mt-6 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-orange-300 transition duration-300 group-hover:translate-x-1">
              Voir le projet
              <span className="transition duration-300 group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>

          {/* ================= PROGRESS BAR ================= */}
          {mediaList.length > 1 && !isHovered && (
            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
              <div
                key={progressKey}
                className="h-full bg-orange-400"
                style={{
                  animation: `progress ${SLIDE_DURATION}ms linear forwards`,
                }}
              />
            </div>
          )}

          {/* ================= DOTS ================= */}
          {mediaList.length > 1 && (
            <div className="absolute bottom-5 right-5 flex gap-2">
              {mediaList.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-8 bg-orange-400"
                      : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </button>
      )}

      {/* ================= THUMBNAILS ================= */}
      {mediaList.length > 1 && (
        <div className="flex gap-3 overflow-x-auto border-t border-white/10 bg-black/40 p-4">
          {mediaList.map((media, mediaIndex) => (
            <button
              key={`${media.url}-${mediaIndex}`}
              type="button"
              onMouseEnter={() => handleSelectMedia(mediaIndex)}
              onClick={() => handleSelectMedia(mediaIndex)}
              className={`group/thumb relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border transition duration-300 ${
                mediaIndex === activeIndex
                  ? "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                  : "border-white/10 hover:border-orange-400"
              }`}
            >
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
                    <span className="text-lg font-black text-white">▶</span>
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

      {/* ================= LOCAL ANIMATIONS ================= */}
      <style>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(1.03);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </article>
  );
}