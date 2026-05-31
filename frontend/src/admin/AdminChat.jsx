// =====================================================
// IMPORTS
// =====================================================
import { useEffect, useRef, useState } from "react";
import AdminLayout from "./AdminLayout";
import { API_URL } from "../lib/api";
import { Paperclip, File, X } from "lucide-react";

// =====================================================
// ADMIN CHAT
// =====================================================
export default function AdminChat() {
  // =====================================================
  // STATES
  // =====================================================
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [adminFiles, setAdminFiles] = useState([]);
  // =====================================================
  // REFS
  // =====================================================
  const messagesEndRef = useRef(null);
  const previousUnreadRef = useRef(0);

  // =====================================================
  // LOAD CONVERSATIONS
  // =====================================================
  const loadConversations = async () => {
    try {
      const token = localStorage.getItem("mecaprint3d_admin_token");

      const response = await fetch(
        `${API_URL}/api/chat/admin?archived=${showArchived}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) return;

      const list = data.conversations || [];

      setConversations(list);

      // Évite le bug de superposition entre deux conversations
      setSelected((currentSelected) => {
        if (!currentSelected) return null;

        const updated = list.find(
          (item) => item._id === currentSelected._id
        );

        return updated || currentSelected;
      });
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
  }, [selected?._id, showArchived]);

  // =====================================================
  // SEND REPLY
  // =====================================================
  const sendReply = async () => {
  if ((!reply.trim() && adminFiles.length === 0) || !selected) return;

  try {
    setSending(true);

    const token = localStorage.getItem("mecaprint3d_admin_token");

    const formData = new FormData();
    formData.append("message", reply.trim());

    adminFiles.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(
      `${API_URL}/api/chat/admin/${selected._id}/reply`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.success) return;

    setReply("");
    setAdminFiles([]);
    setSelected(data.conversation);

    await loadConversations();
  } catch (error) {
    console.error(error);
  } finally {
    setSending(false);
  }
};
// =====================================================
// HANDLE ADMIN FILES
// =====================================================
const handleAdminFiles = (
  event
) => {

  setAdminFiles(
    Array.from(
      event.target.files || []
    )
  );

};

// =====================================================
// REMOVE ADMIN FILE
// =====================================================
const removeAdminFile = (
  index
) => {

  setAdminFiles(
    (current) =>

      current.filter(
        (_, i) =>
          i !== index
      )
  );

};
  // =====================================================
  // ARCHIVE CONVERSATION
  // =====================================================
  const archiveConversation = async () => {
    if (!selected) return;

    try {
      const token = localStorage.getItem("mecaprint3d_admin_token");

      const response = await fetch(
        `${API_URL}/api/chat/admin/${selected._id}/archive`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) return;

      setSelected(null);
      await loadConversations();
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================================
  // MARK AS READ
  // =====================================================
  const markAsRead = async (conversation) => {
    try {
      const token = localStorage.getItem("mecaprint3d_admin_token");

      const response = await fetch(
        `${API_URL}/api/chat/admin/${conversation._id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) return;

      setSelected(data.conversation);
      await loadConversations();
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================================
  // SELECT CONVERSATION CLEANLY
  // =====================================================
  const selectConversation = async (conversation) => {
    setSelected(null);
    setReply("");
    await markAsRead(conversation);
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
  // AUTO SCROLL
  // =====================================================
  useEffect(() => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [selected]);

  // =====================================================
  // SOUND NOTIFICATION
  // =====================================================
  useEffect(() => {
    const unreadCount = conversations.reduce((total, conversation) => {
      return (
        total +
        (conversation.messages || []).filter(
          (message) =>
            message.from === "client" &&
            message.readByAdmin !== true
        ).length
      );
    }, 0);

    if (unreadCount > previousUnreadRef.current) {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }

    previousUnreadRef.current = unreadCount;
  }, [conversations]);

  // =====================================================
  // RENDER FILES
  // =====================================================
  const renderFiles = (message) => {
    if (!message.files?.length) return null;

    return (
      <div className="mt-3 space-y-2">
        {message.files.map((file, fileIndex) => {
          const fileUrl = `${API_URL}/${file.path.replaceAll("\\", "/")}`;

          return (
            <a
              key={fileIndex}
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-black/10 bg-black/10 px-3 py-2 text-xs font-bold underline"
            >
              📎 {file.originalName || "Fichier joint"}
            </a>
          );
        })}
      </div>
    );
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

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-black text-orange-300">
                  {conversations.length}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setShowArchived((value) => !value);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    showArchived
                      ? "bg-orange-500 text-white"
                      : "bg-white/10 text-zinc-300"
                  }`}
                >
                  {showArchived ? "Archives" : "Actifs"}
                </button>
              </div>
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
                    onClick={() => selectConversation(conversation)}
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
                        {message.text && <p>{message.text}</p>}

                        {renderFiles(message)}
                      </div>
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
                </div>

                <button
                  type="button"
                  onClick={archiveConversation}
                  className="mx-5 mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-black text-red-300 hover:bg-red-500/20"
                >
                  Archiver la conversation
                </button>

                <div className="border-t border-white/10 p-4">

  {/* =====================================================
      ADMIN FILES PREVIEW
  ===================================================== */}
  {adminFiles.length > 0 && (

    <div className="mb-3 flex flex-wrap gap-2">

      {adminFiles.map(
        (file, index) => (

          <div
            key={index}

            className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-zinc-300"
          >

            <File size={14} />

            <span className="max-w-[160px] truncate">

              {file.name}

            </span>

            <button
              type="button"

              onClick={() =>
                removeAdminFile(index)
              }

              className="text-red-400 hover:text-red-300"
            >

              <X size={14} />

            </button>

          </div>

        )
      )}

    </div>

  )}

  {/* =====================================================
      INPUT ROW
  ===================================================== */}
  <div className="flex gap-3">

    {/* =====================================================
        FILE BUTTON
    ===================================================== */}
    <label className="flex h-[56px] w-[56px] cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-zinc-300 transition hover:border-orange-500 hover:text-white">

      <Paperclip size={18} />

      <input
        type="file"

        multiple

        onChange={handleAdminFiles}

        className="hidden"
      />

    </label>

    {/* =====================================================
        TEXT INPUT
    ===================================================== */}
    <input
      value={reply}

      onChange={(e) =>
        setReply(e.target.value)
      }

      onKeyDown={(e) => {

        if (e.key === "Enter") {

          sendReply();

        }

      }}

      placeholder="Répondre au client..."

      className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-zinc-500 focus:border-orange-500"
    />

    {/* =====================================================
        SEND BUTTON
    ===================================================== */}
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