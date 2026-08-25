"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

export default function ContactPage() {
  const locale = useLocale();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const translations = {
    de: {
      title: "Kontakt",
      description: "Senden Sie uns Ihre Nachricht.",
      name: "Ihr Name",
      namePlaceholder: "Ihr Name",
      message: "Nachricht",
      messagePlaceholder: "Schreiben Sie Ihre Nachricht...",
      send: "Nachricht senden",
      sending: "Wird gesendet...",
      enterName: "Bitte geben Sie Ihren Namen ein.",
      enterMessage: "Bitte geben Sie Ihre Nachricht ein.",
      sendFailed: "Nachricht konnte nicht gesendet werden.",
      success: "Ihre Nachricht wurde erfolgreich gesendet.",
    },

    en: {
      title: "Contact",
      description: "Send us your message.",
      name: "Your Name",
      namePlaceholder: "Your name",
      message: "Message",
      messagePlaceholder: "Write your message...",
      send: "Send Message",
      sending: "Sending...",
      enterName: "Please enter your name.",
      enterMessage: "Please enter your message.",
      sendFailed: "Failed to send message.",
      success: "Your message was sent successfully.",
    },

    fa: {
      title: "تماس با ما",
      description: "پیام خود را برای ما ارسال کنید.",
      name: "نام شما",
      namePlaceholder: "نام خود را وارد کنید",
      message: "پیام",
      messagePlaceholder: "پیام خود را بنویسید...",
      send: "ارسال پیام",
      sending: "در حال ارسال...",
      enterName: "لطفاً نام خود را وارد کنید.",
      enterMessage: "لطفاً پیام خود را وارد کنید.",
      sendFailed: "ارسال پیام ناموفق بود.",
      success: "پیام شما با موفقیت ارسال شد.",
    },
  };

  const t =
    translations[locale as keyof typeof translations] ||
    translations.de;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!name.trim()) {
      setError(t.enterName);
      return;
    }

    if (!message.trim()) {
      setError(t.enterMessage);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || t.sendFailed);
      }

      setName("");
      setMessage("");

      setSuccess(t.success);
    } catch (err) {
      console.error("CONTACT ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : t.sendFailed
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">

          <h1 className="text-3xl font-bold text-blue-700">
            {t.title}
          </h1>

          <p className="mt-2 text-gray-600">
            {t.description}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block font-semibold text-gray-700"
              >
                {t.name}
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder={t.namePlaceholder}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block font-semibold text-gray-700"
              >
                {t.message}
              </label>

              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder={t.messagePlaceholder}
                rows={7}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-green-600">
                {success}
              </div>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t.sending : t.send}
            </button>

          </form>

        </div>

      </div>
    </main>
  );
}