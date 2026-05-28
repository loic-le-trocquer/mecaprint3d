import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Bonjour 👋 Je peux vous aider pour une demande de devis, une pièce à refaire ou un projet Cover Styl.",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      from: "user",
      text: input.trim(),
    };

    setMessages((current) => [
      ...current,
      userMessage,
      {
        from: "bot",
        text: "Merci pour votre message. Pour une étude précise, vous pouvez remplir le formulaire de devis ou nous envoyer un email.",
      },
    ]);

    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      {open && (
        <div className="mb-4 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 text-white shadow-2xl shadow-black/60">
          {/* HEADER */}
          <div className="flex items-center justify-between bg-orange-500 px-5 py-4">
            <div>
              <p className="text-sm font-black">MecaPrint3D</p>
              <p className="text-xs text-orange-100">
                Réponse rapide atelier
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
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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

          {/* QUICK ACTIONS */}
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

            {/* INPUT */}
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
                className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-400"
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