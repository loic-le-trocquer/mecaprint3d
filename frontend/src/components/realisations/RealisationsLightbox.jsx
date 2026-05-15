import normalizeMedia from "./normalizeMedia";
import MediaPreview from "./MediaPreview";

export default function RealisationsLightbox({
  lightbox,
  onClose,
}) {
  if (!lightbox) return null;

  const activeMedia =
    normalizeMedia(lightbox.item)[lightbox.index];

  if (!activeMedia) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur">

      {/* CLOSE */}
      <button
        type="button"
        onClick={onClose}
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
  );
}