// =====================================================
// IMPORTS
// =====================================================
import {
  useEffect,
  useRef,
  useState,
} from "react";

import AdminLayout from "./AdminLayout";

import { API_URL } from "../lib/api";

// =====================================================
// ADMIN CHAT
// =====================================================
export default function AdminChat() {

  // =====================================================
  // STATES
  // =====================================================
  const [
    conversations,
    setConversations,
  ] = useState([]);

  const [
    selected,
    setSelected,
  ] = useState(null);

  const [
    reply,
    setReply,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    showArchived,
    setShowArchived,
  ] = useState(false);

  // =====================================================
  // AUTO SCROLL
  // =====================================================
  const messagesEndRef =
    useRef(null);

  // =====================================================
  // PREVIOUS UNREAD COUNT
  // =====================================================
  const previousUnreadRef =
    useRef(0);

  // =====================================================
  // LOAD CONVERSATIONS
  // =====================================================
  const loadConversations =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "mecaprint3d_admin_token"
          );

        const response =
          await fetch(
            `${API_URL}/api/chat/admin?archived=${showArchived}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!data.success) return;

        setConversations(
          data.conversations || []
        );

        // =====================================================
        // UPDATE SELECTED
        // =====================================================
        if (selected) {

          const updated =
            data.conversations.find(
              (item) =>
                item._id === selected._id
            );

          if (updated) {
            setSelected(updated);
          }

        }

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  // =====================================================
  // POLLING
  // =====================================================
  useEffect(() => {

    loadConversations();

    const interval =
      setInterval(() => {

        loadConversations();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, [selected?._id, showArchived]);

  // =====================================================
  // SEND REPLY
  // =====================================================
  const sendReply =
    async () => {

      if (
        !reply.trim() ||
        !selected
      ) {
        return;
      }

      try {

        setSending(true);

        const token =
          localStorage.getItem(
            "mecaprint3d_admin_token"
          );

        const response =
          await fetch(
            `${API_URL}/api/chat/admin/${selected._id}/reply`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                message:
                  reply.trim(),
              }),
            }
          );

        const data =
          await response.json();

        if (!data.success) return;

        // =====================================================
        // RESET INPUT
        // =====================================================
        setReply("");

        // =====================================================
        // UPDATE SELECTED
        // =====================================================
        setSelected(
          data.conversation
        );

        // =====================================================
        // RELOAD
        // =====================================================
        await loadConversations();

      } catch (error) {

        console.error(error);

      } finally {

        setSending(false);

      }

    };

  // =====================================================
  // ARCHIVE CONVERSATION
  // =====================================================
  const archiveConversation =
    async () => {

      if (!selected) return;

      try {

        const token =
          localStorage.getItem(
            "mecaprint3d_admin_token"
          );

        const response =
          await fetch(
            `${API_URL}/api/chat/admin/${selected._id}/archive`,
            {
              method: "PUT",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!data.success) return;

        // =====================================================
        // RESET SELECTED
        // =====================================================
        setSelected(null);

        // =====================================================
        // RELOAD
        // =====================================================
        await loadConversations();

      } catch (error) {

        console.error(error);

      }

    };

  // =====================================================
  // MARK CONVERSATION AS READ
  // =====================================================
  const markAsRead =
    async (conversation) => {

      try {

        const token =
          localStorage.getItem(
            "mecaprint3d_admin_token"
          );

        const response =
          await fetch(
            `${API_URL}/api/chat/admin/${conversation._id}/read`,
            {
              method: "PUT",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!data.success) return;

        // =====================================================
        // UPDATE SELECTED
        // =====================================================
        setSelected(
          data.conversation
        );

        // =====================================================
        // RELOAD
        // =====================================================
        await loadConversations();

      } catch (error) {

        console.error(error);

      }

    };

  // =====================================================
  // UNREAD COUNT
  // =====================================================
  const getUnreadCount =
    (conversation) => {

      return (
        conversation.messages || []
      ).filter(
        (message) =>
          message.from === "client" &&
          message.readByAdmin !== true
      ).length;

    };

  // =====================================================
  // AUTO SCROLL TO BOTTOM
  // =====================================================
  useEffect(() => {

    if (!messagesEndRef.current) {
      return;
    }

    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
    });

  }, [selected]);

  // =====================================================
  // SOUND NOTIFICATION
  // =====================================================
  useEffect(() => {

    const unreadCount =
      conversations.reduce(
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

    // =====================================================
    // NEW MESSAGE SOUND
    // =====================================================
    if (
      unreadCount >
      previousUnreadRef.current
    ) {

      const audio =
        new Audio(
          "/notification.mp3"
        );

      audio.volume = 0.4;

      audio.play().catch(() => {});

    }

    previousUnreadRef.current =
      unreadCount;

  }, [conversations]);

  // =====================================================
  // RENDER
  // =====================================================
  return (

    <AdminLayout title="Conversations">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="mb-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-6 shadow-2xl shadow-black/30">

        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">
          Chat client
        </p>

        <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Conversations MecaPrint3D
        </h1>

        <p className="mt-3 max-w-3xl text-sm text-zinc-400">
          Répondez aux visiteurs du site directement depuis le back-office.
        </p>

      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}
      {loading && (

        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-10 text-center text-zinc-400">
          Chargement des conversations...
        </div>

      )}

      {/* =====================================================
          CONTENT
      ===================================================== */}
      {!loading && (

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">

          {/* =====================================================
              LEFT PANEL
          ===================================================== */}
          <div className="rounded-[28px] border border-white/10 bg-zinc-900/70 p-4">

            {/* HEADER */}
            <div className="mb-4 flex items-center justify-between">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-400">
                Discussions
              </p>

              <div className="flex items-center gap-2">

                <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-black text-orange-300">
                  {conversations.length}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setShowArchived(
                      (value) => !value
                    )
                  }
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    showArchived
                      ? "bg-orange-500 text-white"
                      : "bg-white/10 text-zinc-300"
                  }`}
                >
                  {showArchived
                    ? "Archives"
                    : "Actifs"}
                </button>

              </div>

            </div>

            {/* =====================================================
                CONVERSATIONS LIST
            ===================================================== */}
            <div className="grid max-h-[650px] gap-3 overflow-y-auto pr-1">

              {conversations.length === 0 && (

                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-zinc-500">
                  Aucune conversation.
                </div>

              )}

              {conversations.map(
                (conversation) => {

                  const active =
                    selected?._id ===
                    conversation._id;

                  const unread =
                    getUnreadCount(
                      conversation
                    );

                  const lastMessage =
                    conversation.messages?.[
                      conversation.messages.length - 1
                    ];

                  return (

                    <button
                      key={
                        conversation._id
                      }

                      type="button"

                      onClick={() =>
                        markAsRead(
                          conversation
                        )
                      }

                      className={`rounded-2xl border p-4 text-left transition hover:border-orange-500/50 ${
                        active
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-white/10 bg-black/30"
                      }`}
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="font-black text-white">
                            {conversation.visitorName ||
                              "Visiteur"}
                          </p>

                          <p className="mt-1 text-xs text-zinc-400">
                            {conversation.visitorEmail ||
                              "Email non renseigné"}
                          </p>

                        </div>

                        {unread > 0 && (

                          <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-black text-white">
                            {unread}
                          </span>

                        )}

                      </div>

                      <p className="mt-3 line-clamp-2 text-sm text-zinc-400">
                        {lastMessage?.text ||
                          "Aucun message"}
                      </p>

                    </button>

                  );

                }
              )}

            </div>

          </div>

          {/* =====================================================
              CHAT PANEL
          ===================================================== */}
          <div className="rounded-[28px] border border-white/10 bg-zinc-900/70">

            {!selected ? (

              <div className="flex min-h-[650px] items-center justify-center p-10 text-center text-zinc-500">
                Sélectionnez une conversation.
              </div>

            ) : (

              <div className="flex min-h-[650px] flex-col">

                {/* HEADER */}
                <div className="border-b border-white/10 p-5">

                  <p className="text-xl font-black text-white">
                    {selected.visitorName ||
                      "Visiteur"}
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">

                    {selected.visitorEmail ||
                      "Email non renseigné"}

                    {selected.visitorPhone
                      ? ` • ${selected.visitorPhone}`
                      : ""}

                  </p>

                </div>

                {/* =====================================================
                    MESSAGES
                ===================================================== */}
                <div className="flex-1 space-y-3 overflow-y-auto p-5">

                  {(selected.messages || []).map(
                    (
                      message,
                      index
                    ) => (

                      <div
                        key={index}

                        className={`flex ${
                          message.from === "admin"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >

                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            message.from === "admin"
                              ? "bg-orange-500 text-white"
                              : "bg-white text-zinc-900"
                          }`}
                        >

                          {message.text}

                        </div>

                      </div>

                    )
                  )}

                  {/* AUTO SCROLL TARGET */}
                  <div ref={messagesEndRef} />

                </div>

                {/* =====================================================
                    ARCHIVE BUTTON
                ===================================================== */}
                <button
                  type="button"
                  onClick={archiveConversation}
                  className="mx-5 mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-black text-red-300 hover:bg-red-500/20"
                >
                  Archiver la conversation
                </button>

                {/* =====================================================
                    REPLY INPUT
                ===================================================== */}
                <div className="border-t border-white/10 p-4">

                  <div className="flex gap-3">

                    <input
                      value={reply}

                      onChange={(e) =>
                        setReply(
                          e.target.value
                        )
                      }

                      onKeyDown={(e) => {

                        if (
                          e.key ===
                          "Enter"
                        ) {

                          sendReply();

                        }

                      }}

                      placeholder="Répondre au client..."

                      className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-zinc-500 focus:border-orange-500"
                    />

                    <button
                      type="button"

                      onClick={
                        sendReply
                      }

                      disabled={sending}

                      className="rounded-2xl bg-orange-500 px-6 py-4 font-black text-white hover:bg-orange-400 disabled:opacity-50"
                    >

                      Envoyer

                    </button>

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </AdminLayout>

  );

}