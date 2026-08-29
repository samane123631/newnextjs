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
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-10">
      <div className="flex w-full items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="
            flex
            w-full
            max-w-md
            flex-col
            gap-5
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-7
            shadow-xl
            ring-1
            ring-gray-200
          "
        >
          {/* عنوان */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-blue-700">
              {t("title")}
            </h1>

            <p className="mt-2 text-sm font-medium text-gray-600">
              {t("subtitle")}
            </p>
          </div>

          {/* Email */}
          <input
            name="email"
            type="email"
            required
            className="
              w-full
              rounded-xl
              border-2
              border-gray-300
              bg-gray-50
              p-3
              font-semibold
              text-gray-900
              outline-none
              transition
              placeholder:font-normal
              placeholder:text-gray-400
              focus:border-blue-600
              focus:bg-white
              focus:ring-2
              focus:ring-blue-100
            "
            placeholder={t("email")}
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="
                w-full
                rounded-xl
                border-2
                border-gray-300
                bg-gray-50
                p-3
                pr-12
                font-semibold
                text-gray-900
                outline-none
                transition
                placeholder:font-normal
                placeholder:text-gray-400
                focus:border-blue-600
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
              "
              placeholder={t("password")}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-xl
                text-gray-600
                transition
                hover:text-blue-700
              "
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-blue-700
              p-3.5
              font-bold
              text-white
              shadow-md
              transition
              hover:bg-blue-800
              hover:shadow-lg
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? "..." : t("submit")}
          </button>

          {/* Message */}
          {message && (
            <p
              className="
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                p-3
                text-center
                text-sm
                font-semibold
                text-gray-800
              "
            >
              {message}
            </p>
          )}

          {/* Back */}
          <button
            type="button"
            onClick={() => router.push(`/${locale}`)}
            className="
              w-full
              rounded-xl
              border-2
              border-gray-300
              p-3
              font-semibold
              text-gray-700
              transition
              hover:bg-gray-100
            "
          >
            ← {t("back")}
          </button>
        </form>
      </div>
    </main>
  );
}