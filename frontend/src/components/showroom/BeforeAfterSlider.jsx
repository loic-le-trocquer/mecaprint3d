// ================= IMPORTS =================
import { useState } from "react";

// ================= BEFORE / AFTER =================
export default function BeforeAfterSlider({
  before,
  after,
  title = "",
  category = "",
}) {
  const [position, setPosition] = useState(50);

  const updatePosition = (clientX, target) => {
    const rect = target.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, percent)));
  };

  const handleMove = (e) => {
    updatePosition(e.clientX, e.currentTarget);
  };

  const handleTouch = (e) => {
    updatePosition(e.touches[0].clientX, e.currentTarget);
  };

  return (
    <div className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div
        className="relative h-[520px] w-full cursor-ew-resize overflow-hidden"
        onMouseMove={handleMove}
        onTouchMove={handleTouch}
      >
        {/* AFTER */}
        <img
          src={after}
          alt="Après"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* BEFORE */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={before}
            alt="Avant"
            className="h-full w-full object-cover"
          />
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* LABELS */}
        <div className="absolute left-6 top-6 z-30 rounded-full border border-white/10 bg-black/60 px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-white backdrop-blur-xl">
          AVANT
        </div>

        <div className="absolute right-6 top-6 z-30 rounded-full border border-orange-500/20 bg-orange-500/80 px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-white shadow-[0_0_20px_rgba(249,115,22,0.25)] backdrop-blur-xl">
          APRÈS
        </div>

        {/* LINE */}
        <div
          className="absolute inset-y-0 z-20 w-[3px] -translate-x-1/2 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-300 shadow-[0_0_25px_rgba(249,115,22,0.8)]"
          style={{ left: `${position}%` }}
        />

        {/* HANDLE */}
        <div
          className="absolute top-1/2 z-30 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-orange-300/40 bg-black/70 backdrop-blur-xl shadow-[0_0_35px_rgba(249,115,22,0.45)]"
          style={{ left: `${position}%` }}
        >
          <div className="absolute inset-0 rounded-full border border-orange-400/20 animate-ping" />

          <div className="flex items-center gap-1 text-orange-300">
            <span className="text-xl font-black">‹</span>
            <span className="h-6 w-[2px] bg-orange-300/40" />
            <span className="text-xl font-black">›</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-10">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-orange-300">
            {category}
          </p>

          <h3 className="mt-4 text-4xl font-black text-white drop-shadow-2xl">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}