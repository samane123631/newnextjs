"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function Login() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Login");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Login failed.");
        return;
      }

      setMessage(result.message);

      router.push(`/${locale}/profile`);
    } catch (error) {
      console.error("Login error:", error);
      setMessage("خطایی در ارتباط با سرور رخ داد.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-5 rounded-2xl bg-white p-7 shadow-xl ring-1 ring-gray-100"
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-blue-700">
              {t("title")}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {t("subtitle")}
            </p>
          </div>

          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
            placeholder={t("email")}
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 pr-12 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
              placeholder={t("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 transition hover:text-blue-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-700 p-3.5 font-semibold text-white shadow-md transition hover:bg-blue-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "..." : t("submit")}
          </button>

          {message && (
            <p className="rounded-xl bg-gray-50 p-3 text-center text-sm text-gray-700">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={() => router.push(`/${locale}`)}
            className="w-full rounded-xl border border-gray-300 p-3 text-gray-600 transition hover:bg-gray-100"
          >
            ← {t("back")}
          </button>
        </form>
      </div>
    </main>
  );
}