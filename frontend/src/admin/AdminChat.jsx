// =====================================================
// IMPORTS
// =====================================================
import { useEffect, useState } from "react";

import AdminLayout from "./AdminLayout";
import { API_URL } from "../lib/api";

// =====================================================
// ADMIN CHAT
// =====================================================
export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // =====================================================
  // LOAD CONVERSATIONS
  // =====================================================
  const loadConversations = async () => {
    try {
      const token = localStorage.getItem("mecaprint3d_admin_token");

      const response = await fetch(`${API_URL}/api/chat/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) return;

      setConversations(data.conversations || []);

      if (selected) {
        const updated = data.conversations.find(
          (item) => item._id === selected._id
        );

        if (updated) setSelected(updated);
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

    const interval = setInterval(() => {
      loadConversations();
    }, 5000);

    return () => clearInterval(interval);
  }, [selected?._id]);

  // =====================================================
  // SEND REPLY
  // =====================================================
  const sendReply = async () => {
    if (!reply.trim() || !selected) return;

    try {
      setSending(true);

      const token = localStorage.getItem("mecaprint3d_admin_token");

      const response = await fetch(
        `${API_URL}/api/chat/admin/${selected._id}/reply`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: reply.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!data.success) return;

      setReply("");
      setSelected(data.conversation);

      await loadConversations();
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  // =====================================================
  // UNREAD COUNT
  // =====================================================
  const getUnreadCount = (conversation) => {
    return (conversation.messages || []).filter(
      (message) =>
        message.from === "client" &&
        message.readByAdmin !== true
    ).length;
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <AdminLayout title="Conversations">
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

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-10 text-center text-zinc-400">
          Chargement des conversations...
        </div>
      )}

      {!loading && (
        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          {/* LISTE CONVERSATIONS */}
          <div className="rounded-[28px] border border-white/10 bg-zinc-900/70 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-400">
                Discussions
              </p>

              <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-black text-orange-300">
                {conversations.length}
              </span>
            </div>

            <div className="grid max-h-[650px] gap-3 overflow-y-auto pr-1">
              {conversations.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-zinc-500">
                  Aucune conversation.
                </div>
              )}

              {conversations.map((conversation) => {
                const active = selected?._id === conversation._id;
                const unread = getUnreadCount(conversation);
                const lastMessage =
                  conversation.messages?.[conversation.messages.length - 1];

                return (
                  <button
                    key={conversation._id}
                    type="button"
                    onClick={() => setSelected(conversation)}
                    className={`rounded-2xl border p-4 text-left transition hover:border-orange-500/50 ${
                      active
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-white/10 bg-black/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-white">
                          {conversation.visitorName || "Visiteur"}
                        </p>

                        <p className="mt-1 text-xs text-zinc-400">
                          {conversation.visitorEmail || "Email non renseigné"}
                        </p>
                      </div>

                      {unread > 0 && (
                        <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-black text-white">
                          {unread}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm text-zinc-400">
                      {lastMessage?.text || "Aucun message"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FIL DE DISCUSSION */}
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
                    {selected.visitorName || "Visiteur"}
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    {selected.visitorEmail || "Email non renseigné"}
                    {selected.visitorPhone
                      ? ` • ${selected.visitorPhone}`
                      : ""}
                  </p>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 space-y-3 overflow-y-auto p-5">
                  {(selected.messages || []).map((message, index) => (
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
                  ))}
                </div>

                {/* REPLY */}
                <div className="border-t border-white/10 p-4">
                  <div className="flex gap-3">
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendReply();
                      }}
                      placeholder="Répondre au client..."
                      className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-zinc-500 focus:border-orange-500"
                    />

                    <button
                      type="button"
                      onClick={sendReply}
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