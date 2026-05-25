// ================= IMPORTS =================
import { useState } from "react";

// ================= BEFORE / AFTER =================
export default function BeforeAfterSlider({
  before,
  after,
  title = "",
  category = "",
}) {

  // ================= SLIDER =================
  const [position, setPosition] =
    useState(50);

  // ================= MOVE =================
  const handleMove = (e) => {

    const rect =
      e.currentTarget.getBoundingClientRect();

    const x =
      e.clientX - rect.left;

    const percent =
      (x / rect.width) * 100;

    setPosition(
      Math.max(0, Math.min(100, percent))
    );

  };

  // ================= TOUCH =================
  const handleTouch = (e) => {

    const rect =
      e.currentTarget.getBoundingClientRect();

    const x =
      e.touches[0].clientX - rect.left;

    const percent =
      (x / rect.width) * 100;

    setPosition(
      Math.max(0, Math.min(100, percent))
    );

  };

  // ================= RENDER =================
  return (

    <div className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl">

      {/* ================= IMAGE CONTAINER ================= */}
      <div
        className="relative h-[520px] w-full cursor-ew-resize overflow-hidden"
        onMouseMove={handleMove}
        onTouchMove={handleTouch}
      >

        {/* ================= AFTER ================= */}
        <img
          src={after}
          alt="Après"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* ================= BEFORE ================= */}
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

        {/* ================= OVERLAY ================= */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* ================= DIVIDER ================= */}
        <div
          className="absolute inset-y-0 z-20"
          style={{ left: `${position}%` }}
        >

          {/* LINE */}
          <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]" />

          {/* HANDLE */}
          <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-orange-500 text-xl font-black text-white shadow-[0_0_30px_rgba(249,115,22,0.45)] backdrop-blur-xl">

            ↔

          </div>

        </div>

        {/* ================= LABELS ================= */}
        <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/60 px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-white backdrop-blur-xl">

          AVANT

        </div>

        <div className="absolute right-6 top-6 rounded-full border border-orange-500/20 bg-orange-500/80 px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-white shadow-[0_0_20px_rgba(249,115,22,0.25)] backdrop-blur-xl">

          APRÈS

        </div>

        {/* ================= CONTENT ================= */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-10">

          {/* CATEGORY */}
          <p className="text-sm font-black uppercase tracking-[0.35em] text-orange-300">

            {category}

          </p>

          {/* TITLE */}
          <h3 className="mt-4 text-4xl font-black text-white drop-shadow-2xl">

            {title}

          </h3>

        </div>

      </div>

    </div>

  );
}