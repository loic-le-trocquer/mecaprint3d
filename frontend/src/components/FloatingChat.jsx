// =====================================================
// IMPORTS
// =====================================================
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MessageCircle,
  Send,
  X,
  Paperclip,
  File,
  Image as ImageIcon,
} from "lucide-react";

import { API_URL } from "../lib/api";

// =====================================================
// FLOATING CHAT
// =====================================================
export default function FloatingChat() {

  // =====================================================
  // STATES
  // =====================================================
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState([]);

  const [text, setText] =
    useState("");

  const [conversationId, setConversationId] =
    useState(null);

  const [files, setFiles] =
    useState([]);

  // =====================================================
  // AUTO SCROLL
  // =====================================================
  const messagesEndRef =
    useRef(null);

  // =====================================================
  // LOAD EXISTING CONVERSATION
  // =====================================================
  useEffect(() => {

    const storedId =
      localStorage.getItem(
        "mecaprint3d_chat_id"
      );

    if (!storedId) return;

    setConversationId(storedId);

    loadConversation(storedId);

  }, []);

  // =====================================================
  // AUTO SCROLL
  // =====================================================
  useEffect(() => {

    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // =====================================================
  // LOAD CONVERSATION
  // =====================================================
  const loadConversation =
    async (id) => {

      try {

        const response =
          await fetch(
            `${API_URL}/api/chat/${id}`
          );

        const data =
          await response.json();

        if (!data.success) return;

        setMessages(
          data.conversation.messages || []
        );

      } catch (error) {

        console.error(error);

      }

    };

  // =====================================================
  // FILE SELECT
  // =====================================================
  const handleFiles =
    (event) => {

      const selectedFiles =
        Array.from(
          event.target.files || []
        );

      setFiles((current) => [
        ...current,
        ...selectedFiles,
      ]);

    };

  // =====================================================
  // REMOVE FILE
  // =====================================================
  const removeFile =
    (index) => {

      setFiles((current) =>
        current.filter(
          (_, i) => i !== index
        )
      );

    };

  // =====================================================
  // SEND MESSAGE
  // =====================================================
  const sendMessage =
    async () => {

      if (
        !text.trim() &&
        files.length === 0
      ) {
        return;
      }

      try {

        setLoading(true);

        // =====================================================
        // FORM DATA
        // =====================================================
        const formData =
          new FormData();

        formData.append(
          "conversationId",
          conversationId || ""
        );

        formData.append(
          "message",
          text
        );

        // =====================================================
        // OPTIONAL INFOS
        // =====================================================
        formData.append(
          "name",
          ""
        );

        formData.append(
          "email",
          ""
        );

        formData.append(
          "phone",
          ""
        );

        // =====================================================
        // FILES
        // =====================================================
        files.forEach((file) => {

          formData.append(
            "files",
            file
          );

        });

        // =====================================================
        // SEND REQUEST
        // =====================================================
        const response =
          await fetch(
            `${API_URL}/api/chat`,
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        if (!data.success) {
          return;
        }

        // =====================================================
        // STORE CONVERSATION ID
        // =====================================================
        if (
          data.conversationId
        ) {

          localStorage.setItem(
            "mecaprint3d_chat_id",
            data.conversationId
          );

          setConversationId(
            data.conversationId
          );

        }

        // =====================================================
        // UPDATE MESSAGES
        // =====================================================
        setMessages(
          data.conversation.messages || []
        );

        // =====================================================
        // RESET
        // =====================================================
        setText("");

        setFiles([]);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  // =====================================================
  // FILE ICON
  // =====================================================
  const getFileIcon =
    (file) => {

      if (
        file.mimetype?.startsWith(
          "image/"
        )
      ) {
        return (
          <ImageIcon
            size={16}
          />
        );
      }

      return (
        <File size={16} />
      );

    };

  // =====================================================
  // RENDER
  // =====================================================
  return (

    <>
      {/* =====================================================
          FLOATING BUTTON
      ===================================================== */}
      <button
        type="button"

        onClick={() =>
          setOpen(
            (value) => !value
          )
        }

        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-2xl shadow-orange-500/30 transition hover:scale-105"
      >

        {open ? (
          <X size={28} />
        ) : (
          <MessageCircle size={28} />
        )}

      </button>

      {/* =====================================================
          CHAT WINDOW
      ===================================================== */}
      {open && (

        <div className="fixed bottom-24 right-6 z-50 flex h-[700px] w-[400px] flex-col overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950 shadow-2xl shadow-black/40">

          {/* =====================================================
              HEADER
          ===================================================== */}
          <div className="border-b border-white/10 bg-gradient-to-r from-orange-500 to-orange-400 p-5">

            <h2 className="text-lg font-black text-white">
              Chat MecaPrint3D
            </h2>

            <p className="mt-1 text-sm text-white/80">
              Envoyez vos fichiers STL, STEP, images ou PDF.
            </p>

          </div>

          {/* =====================================================
              MESSAGES
          ===================================================== */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5">

            {messages.map(
              (message, index) => (

                <div
                  key={index}
                  className={`flex ${
                    message.from === "client"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      message.from === "client"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-zinc-900"
                    }`}
                  >

                    {/* TEXT */}
                    {message.text && (
                      <p>
                        {message.text}
                      </p>
                    )}

                    {/* FILES */}
                    {message.files?.length > 0 && (

                      <div className="mt-3 space-y-2">

                        {message.files.map(
                          (file, fileIndex) => (

                            <a
                              key={fileIndex}

                              href={`${API_URL}/${file.path.replaceAll(
                                "\\",
                                "/"
                              )}`}

                              target="_blank"

                              rel="noreferrer"

                              className="flex items-center gap-2 rounded-xl bg-black/10 px-3 py-2 text-xs hover:bg-black/20"
                            >

                              {getFileIcon(
                                file
                              )}

                              <span className="truncate">
                                {
                                  file.originalName
                                }
                              </span>

                            </a>

                          )
                        )}

                      </div>

                    )}

                  </div>

                </div>

              )
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* =====================================================
              FILES PREVIEW
          ===================================================== */}
          {files.length > 0 && (

            <div className="border-t border-white/10 p-3">

              <div className="flex flex-wrap gap-2">

                {files.map(
                  (file, index) => (

                    <div
                      key={index}

                      className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-zinc-300"
                    >

                      <File size={14} />

                      <span className="max-w-[140px] truncate">
                        {file.name}
                      </span>

                      <button
                        type="button"

                        onClick={() =>
                          removeFile(
                            index
                          )
                        }

                        className="text-red-400"
                      >
                        ✕
                      </button>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

          {/* =====================================================
              INPUT
          ===================================================== */}
          <div className="border-t border-white/10 p-4">

            <div className="flex items-end gap-2">

              {/* FILE BUTTON */}
              <label className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-white/5 text-zinc-300 hover:bg-white/10">

                <Paperclip
                  size={20}
                />

                <input
                  type="file"

                  multiple

                  onChange={
                    handleFiles
                  }

                  className="hidden"
                />

              </label>

              {/* TEXT INPUT */}
              <textarea
                value={text}

                onChange={(e) =>
                  setText(
                    e.target.value
                  )
                }

                placeholder="Votre message..."

                rows={1}

                className="max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500"
              />

              {/* SEND */}
              <button
                type="button"

                onClick={
                  sendMessage
                }

                disabled={loading}

                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white hover:bg-orange-400 disabled:opacity-50"
              >

                <Send size={18} />

              </button>

            </div>

          </div>

        </div>

      )}
    </>

  );

}