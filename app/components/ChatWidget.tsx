"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const t = useTranslations("ChatWidget");

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: trimmedMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "خطا در دریافت پاسخ."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("CHAT ERROR:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: "متأسفم، خطایی رخ داد.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      handleSend();
    }
  }

  return (
    <div className="fixed bottom-5 left-5 z-[100]">

      {/* Chat Box */}

      {open && (
        <div
          className="
            absolute
            bottom-16
            left-0
            mb-2
            flex
            h-[420px]
            w-80
            flex-col
            rounded-2xl
            bg-white
            shadow-2xl
            ring-1
            ring-gray-200
          "
        >

          {/* Header */}

          <div className="rounded-t-2xl bg-blue-700 px-4 py-3 text-white">
            <p className="font-semibold">
              {t("message")}
            </p>

            <p className="text-xs opacity-90">
              Deutsch Lernassistent
            </p>
          </div>

          {/* Messages */}

          <div className="flex-1 space-y-3 overflow-y-auto p-4">

            {messages.length === 0 && (
              <div className="rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                {t("message")}
              </div>
            )}

            {messages.map((item, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 text-sm ${
                  item.role === "user"
                    ? "ml-6 bg-blue-100 text-gray-800"
                    : "mr-6 bg-gray-100 text-gray-800"
                }`}
              >
                {item.content}
              </div>
            ))}

            {loading && (
              <div className="mr-6 rounded-lg bg-gray-100 p-3 text-sm text-gray-500">
                ...
              </div>
            )}

          </div>

          {/* Input */}

          <div className="border-t p-3">

            <div className="flex gap-2">

              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Schreibe deine Frage..."
                disabled={loading}
                className="
                  min-w-0
                  flex-1
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  text-sm
                  outline-none
                  focus:border-blue-500
                  disabled:bg-gray-100
                "
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={
                  loading || !message.trim()
                }
                className="
                  rounded-lg
                  bg-blue-700
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-blue-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? "..." : "Send"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Floating Button */}

      <button
        type="button"
        onClick={() =>
          setOpen((previous) => !previous)
        }
        aria-label="Chat"
        aria-expanded={open}
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-blue-700
          text-2xl
          text-white
          shadow-xl
          transition
          duration-300
          hover:scale-110
          hover:bg-blue-800
          animate-pulse
        "
      >
        {open ? "✕" : "💬"}
      </button>

    </div>
  );
}