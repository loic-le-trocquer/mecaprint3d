import { useEffect, useState } from "react";
import { API_URL } from "../lib/api";

// =====================================================
// ADMIN LAYOUT
// =====================================================

export default function AdminLayout({
  title,
  children,
}) {
// =====================================================
// STATES
// =====================================================
const [quotesCount, setQuotesCount] =
  useState(0);

const [chatCount, setChatCount] =
  useState(0);

const [qontoStatus, setQontoStatus] =
  useState("loading");
  // =====================================================
// LOAD COUNTS
// =====================================================
useEffect(() => {

  const loadCounts = async () => {

    try {

      const token =
        localStorage.getItem(
          "mecaprint3d_admin_token"
        );

      // ================= QUOTES =================
      const quotesResponse =
        await fetch(
          `${API_URL}/api/quotes`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const quotesData =
        await quotesResponse.json();

      if (quotesData.success) {

        const activeQuotes =
          (quotesData.quotes || []).filter(
            (quote) =>
              quote.status !==
              "archive"
          );

        setQuotesCount(
          activeQuotes.length
        );

      }

      // ================= CHAT =================
      const chatResponse =
        await fetch(
          `${API_URL}/api/chat/admin`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const chatData =
        await chatResponse.json();

      if (chatData.success) {

        const unread =
          (chatData.conversations || []).reduce(
            (
              total,
              conversation
            ) => {

              return (
                total +
                (
                  conversation.messages || []
                ).filter(
                  (message) =>
                    message.from === "client" &&
                    message.readByAdmin !== true
                ).length
              );

            },
            0
          );

        setChatCount(unread);

      }

      const qontoResponse = await fetch(
        `${API_URL}/api/qonto/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const qontoData = await qontoResponse.json();
      setQontoStatus(qontoData.connected ? "connected" : "disconnected");

    } catch (error) {

      console.error(error);

    }

  };

  const connectQonto = async () => {
    const token = localStorage.getItem("mecaprint3d_admin_token");
    const response = await fetch(`${API_URL}/api/qonto/authorization-url`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok || !data.url) {
      window.alert(data.error || "Connexion Qonto impossible.");
      return;
    }
    window.location.href = data.url;
  };

  loadCounts();

  const interval =
    setInterval(
      loadCounts,
      10000
    );

  return () =>
    clearInterval(interval);

}, []);

  // =====================================================
  // LOGOUT
  // =====================================================
  const logout = () => {

    localStorage.removeItem(
      "mecaprint3d_admin_token"
    );

    window.location.href =
      "/admin";

  };

  // =====================================================
  // RENDER
  // =====================================================
  return (

    <div className="min-h-screen bg-zinc-950 text-white">

      <div className="flex min-h-screen">

        {/* =====================================================
            SIDEBAR
        ===================================================== */}
        <aside
          className="
            w-72
            border-r
            border-white/10
            bg-black/40
            p-6
          "
        >

          {/* =====================================================
              LOGO
          ===================================================== */}
          <div className="mb-10">

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
              MECAPRINT3D
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Backoffice
            </h1>

          </div>

          {/* =====================================================
              NAVIGATION
          ===================================================== */}
          <nav className="space-y-3">

            <button
              type="button"
              onClick={connectQonto}
              className="w-full rounded-2xl border border-white/10 px-5 py-4 text-left font-bold text-zinc-300 transition hover:border-orange-500 hover:text-white"
            >
              {qontoStatus === "connected"
                ? "Qonto connecté ✓"
                : "Connecter Qonto"}
            </button>

            {/* =====================================================
                SITE CONTENT
            ===================================================== */}
            <a
              href="/admin"
              className="
                block rounded-2xl
                border border-white/10
                px-5 py-4
                font-bold text-zinc-300
                transition
                hover:border-orange-500
                hover:text-white
              "
            >
              Contenu du site
            </a>

            {/* =====================================================
                QUOTES
            ===================================================== */}
           <a
  href="/admin/quotes"
  className="
    flex items-center justify-between
    rounded-2xl
    border border-white/10
    px-5 py-4
    font-bold text-zinc-300
    transition
    hover:border-orange-500
    hover:text-white
  "
>
  <span>
    Demandes de devis
  </span>

  {quotesCount > 0 && (
    <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-black text-white">
      {quotesCount}
    </span>
  )}
</a>

            {/* =====================================================
                CHAT
            ===================================================== */}
            <a
  href="/admin/chat"
  className="
    flex items-center justify-between
    rounded-2xl
    border border-white/10
    px-5 py-4
    font-bold text-zinc-300
    transition
    hover:border-orange-500
    hover:text-white
  "
>
  <span>
    Conversations clients
  </span>

  {chatCount > 0 && (
    <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-black text-white">
      {chatCount}
    </span>
  )}
</a>

{/* =====================================================
    MATERIALS
===================================================== */}
<a
  href="/admin/materials"
  className="
    block rounded-2xl
    border border-white/10
    px-5 py-4
    font-bold text-zinc-300
    transition
    hover:border-orange-500
    hover:text-white
  "
>
  Matériaux
</a>

            {/* =====================================================
                WEBSITE
            ===================================================== */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="
                block rounded-2xl
                border border-white/10
                px-5 py-4
                font-bold text-zinc-300
                transition
                hover:border-orange-500
                hover:text-white
              "
            >
              Voir le site
            </a>

          </nav>

          {/* =====================================================
              LOGOUT
          ===================================================== */}
          <button
            onClick={logout}
            className="
              mt-10
              w-full
              rounded-2xl
              border border-red-500/20
              px-5 py-4
              font-bold text-red-300
              transition
              hover:bg-red-500/10
            "
          >
            Déconnexion
          </button>

        </aside>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <main className="flex-1 p-8">

          <div className="mx-auto max-w-7xl">

            {/* =====================================================
                PAGE TITLE
            ===================================================== */}
            <div className="mb-10">

              <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
                Administration
              </p>

              <h2 className="mt-3 text-5xl font-black">
                {title}
              </h2>

            </div>

            {/* =====================================================
                PAGE CONTENT
            ===================================================== */}
            {children}

          </div>

        </main>

      </div>

    </div>

  );

}
