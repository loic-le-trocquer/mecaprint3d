// =====================================================
// IMPORTS
// =====================================================
import { useEffect, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

import { API_URL } from "../lib/api";

// =====================================================
// FLOATING CHAT
// =====================================================
export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  const [conversationId, setConversationId] = useState(
    localStorage.getItem("mecaprint3d_conversation_id") || ""
  );

  const [visitor, setVisitor] = useState({
    name: localStorage.getItem("mecaprint3d_chat_name") || "",
    email: localStorage.getItem("mecaprint3d_chat_email") || "",
    phone: localStorage.getItem("mecaprint3d_chat_phone") || "",
  });

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Bonjour 👋 Indiquez votre nom, email puis votre message. Nous vous répondrons directement ici.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD CONVERSATION
  // =====================================================
  const loadConversation = async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(
        `${API_URL}/api/chat/${conversationId}`
      );

      const data = await response.json();

      if (!data.success || !data.conversation) return;

      const formattedMessages =
        data.conversation.messages.map((msg) => ({
          from: msg.from === "admin" ? "bot" : "user",
          text: msg.text,
        }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================================
  // POLLING
  // =====================================================
  useEffect(() => {
    if (!open || !conversationId) return;

    loadConversation();

    const interval = setInterval(() => {
      loadConversation();
    }, 5000);

    return () => clearInterval(interval);
  }, [open, conversationId]);

  // =====================================================
  // UPDATE VISITOR
  // =====================================================
  const updateVisitor = (key, value) => {
    const next = {
      ...visitor,
      [key]: value,
    };

    setVisitor(next);

    localStorage.setItem(
      `mecaprint3d_chat_${key}`,
      value
    );
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================
  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input.trim();

    if (!visitor.name.trim() || !visitor.email.trim()) {
      setMessages((current) => [
        ...current,
        {
          from: "bot",
          text: "Merci de renseigner votre nom et votre email avant d’envoyer un message.",
        },
      ]);
      return;
    }

    const userMessage = {
      from: "user",
      text,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          conversationId,
          name: visitor.name,
          email: visitor.email,
          phone: visitor.phone,
          message: text,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Erreur chat");
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);

        localStorage.setItem(
          "mecaprint3d_conversation_id",
          data.conversationId
        );
      }

      setMessages((current) => [
        ...current,
        {
          from: "bot",
          text:
            data.reply ||
            "Merci 👌 Votre message a bien été transmis.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          from: "bot",
          text: "Une erreur est survenue. Vous pouvez aussi nous contacter par email.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      {open && (
        <div className="mb-4 flex h-[620px] w-[370px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 text-white shadow-2xl shadow-black/60">
          {/* HEADER */}
          <div className="flex items-center justify-between bg-orange-500 px-5 py-4">
            <div>
              <p className="text-sm font-black">MecaPrint3D</p>
              <p className="text-xs text-orange-100">
                Chat atelier
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/15 p-2 hover:bg-white/25"
            >
              <X size={18} />
            </button>
          </div>

          {/* VISITOR INFO */}
          {!conversationId && (
            <div className="grid gap-2 border-b border-white/10 bg-zinc-950 p-3">
              <input
                value={visitor.name}
                onChange={(e) =>
                  updateVisitor("name", e.target.value)
                }
                placeholder="Votre nom"
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
              />

              <input
                type="email"
                value={visitor.email}
                onChange={(e) =>
                  updateVisitor("email", e.target.value)
                }
                placeholder="Votre email"
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
              />

              <input
                value={visitor.phone}
                onChange={(e) =>
                  updateVisitor("phone", e.target.value)
                }
                placeholder="Téléphone optionnel"
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
              />
            </div>
          )}

          {/* MESSAGES */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-zinc-900 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.from === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.from === "user"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-zinc-900"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="border-t border-white/10 bg-zinc-950 p-3">
            <div className="mb-3 flex gap-2">
              <a
                href="#devis"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-orange-500 px-3 py-2 text-center text-xs font-black text-white hover:bg-orange-400"
              >
                Devis
              </a>

              <a
                href="mailto:contact@mecaprint3d.fr?subject=Demande%20MecaPrint3D"
                className="flex-1 rounded-full border border-white/10 px-3 py-2 text-center text-xs font-black text-zinc-200 hover:border-orange-500"
              >
                Email
              </a>
            </div>

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Écrire un message..."
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={loading}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-400 disabled:opacity-50"
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_0_35px_rgba(249,115,22,0.45)] transition hover:scale-110 hover:bg-orange-400"
      >
        {open ? <X size={28} /> : <MessageCircle size={30} />}
      </button>
    </div>
  );
}