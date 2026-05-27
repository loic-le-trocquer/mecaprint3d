// ================= IMPORTS =================
import { useEffect, useMemo, useState } from "react";
import normalizeMedia from "./normalizeMedia";
import MediaPreview from "./MediaPreview";

// ================= PROJECT MODAL =================
export default function ProjectModal({ project, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const mediaList = useMemo(() => {
    return project ? normalizeMedia(project) : [];
  }, [project]);

  const activeMedia = mediaList[activeIndex];

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();

      if (event.key === "ArrowRight") {
        setActiveIndex((prev) =>
          prev + 1 >= mediaList.length ? 0 : prev + 1
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) =>
          prev - 1 < 0 ? mediaList.length - 1 : prev - 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, mediaList.length, onClose]);

  if (!project) return null;

  const previousMedia = () => {
    setActiveIndex((prev) =>
      prev - 1 < 0 ? mediaList.length - 1 : prev - 1
    );
  };

  const nextMedia = () => {
    setActiveIndex((prev) =>
      prev + 1 >= mediaList.length ? 0 : prev + 1
    );
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-2xl">
      {/* CLOSE BACKDROP */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        aria-label="Fermer"
      />

      {/* MODAL */}
      <div className="relative z-10 grid max-h-[92vh] w-full max-w-7xl overflow-hidden rounded-[34px] border border-white/10 bg-zinc-950 shadow-[0_0_80px_rgba(0,0,0,0.65)] lg:grid-cols-[1.4fr_0.8fr]">
        {/* MEDIA */}
        <div className="relative flex min-h-[420px] items-center justify-center bg-black lg:min-h-[720px]">
          {activeMedia && (
            <MediaPreview
              key={activeMedia.url}
              media={activeMedia}
              title={project.title}
              className="h-full max-h-[720px] w-full object-contain animate-[modalFade_500ms_ease-out]"
            />
          )}

          {/* NAV */}
          {mediaList.length > 1 && (
            <>
              <button
                type="button"
                onClick={previousMedia}
                className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-2xl font-black text-white backdrop-blur-xl transition hover:border-orange-500 hover:bg-orange-500"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={nextMedia}
                className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-2xl font-black text-white backdrop-blur-xl transition hover:border-orange-500 hover:bg-orange-500"
              >
                ›
              </button>
            </>
          )}

          {/* COUNTER */}
          {mediaList.length > 1 && (
            <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl">
              {activeIndex + 1} / {mediaList.length}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col overflow-y-auto border-l border-white/10 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">
                {project.category || "Réalisation"}
              </p>

              <h3 className="mt-3 text-3xl font-black text-white">
                {project.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl font-black text-white transition hover:border-red-500 hover:bg-red-500"
            >
              ×
            </button>
          </div>

          <p className="mt-6 leading-relaxed text-zinc-300">
            {project.description || "Aucune description disponible."}
          </p>

          {/* THUMBNAILS */}
          {mediaList.length > 1 && (
            <div className="mt-8">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                Médias du projet
              </p>

              <div className="grid grid-cols-3 gap-3">
                {mediaList.map((media, index) => (
                  <button
                    key={`${media.url}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`relative h-24 overflow-hidden rounded-2xl border transition ${
                      activeIndex === index
                        ? "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                        : "border-white/10 hover:border-orange-500/50"
                    }`}
                  >
                    {media.type === "video" ? (
                      <>
                        <video
                          src={media.url}
                          className="h-full w-full object-cover"
                          muted
                          loop
                          playsInline
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                          ▶
                        </div>
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
            </div>
          )}

          <div className="mt-auto pt-8">
            <div className="rounded-2xl border border-orange-500/10 bg-orange-500/5 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">
                Projet MecaPrint3D
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                Fabrication, personnalisation, rénovation ou covering selon le besoin client.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalFade {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}