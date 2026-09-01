"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function Anmeldung() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Anmeldung");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      birthDate: formData.get("birthDate"),
      level: formData.get("level"),
    };

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Registration failed.");
        return;
      }

      if (!result.userId) {
        setMessage("User ID not found.");
        return;
      }

      if (!result.verificationCode) {
        setMessage("Verification code not found.");
        return;
      }

      router.push(
        `/${locale}/verify-phone?userId=${result.userId}&code=${result.verificationCode}`
      );
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("خطایی در ارتباط با سرور رخ داد.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-10">
      <div className="flex w-full items-center justify-center">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-7 shadow-xl ring-1 ring-gray-200"
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-blue-700">
              {t("title")}
            </h1>

            <p className="mt-2 text-sm font-medium text-gray-600">
              {t("subtitle")}
            </p>
          </div>

          <input
            name="firstName"
            type="text"
            required
            className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 p-3 font-semibold text-gray-900 outline-none transition placeholder:font-normal placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
            placeholder={t("firstName")}
          />

          <input
            name="lastName"
            type="text"
            required
            className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 p-3 font-semibold text-gray-900 outline-none transition placeholder:font-normal placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
            placeholder={t("lastName")}
          />

          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 p-3 font-semibold text-gray-900 outline-none transition placeholder:font-normal placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
            placeholder={t("email")}
          />

          <input
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 p-3 font-semibold text-gray-900 outline-none transition placeholder:font-normal placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
            placeholder={t("phone")}
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 p-3 pr-12 font-semibold text-gray-900 outline-none transition placeholder:font-normal placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
              placeholder={t("password")}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-600 transition hover:text-blue-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <input
            name="birthDate"
            type="date"
            required
            className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 p-3 font-semibold text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

          <select
            name="level"
            required
            defaultValue="A1"
            className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 p-3 font-semibold text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            <option value="A1">{t("level.a1")}</option>
            <option value="A2">{t("level.a2")}</option>
            <option value="B1">{t("level.b1")}</option>
            <option value="B2">{t("level.b2")}</option>
            <option value="C1">{t("level.c1")}</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-700 p-3.5 font-bold text-white shadow-md transition hover:bg-blue-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "..." : t("submit")}
          </button>

          {message && (
            <p className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center text-sm font-semibold text-gray-800">
              {message}
            </p>
          )}

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-xs font-bold text-gray-500">
              OR
            </span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <button
            type="button"
            onClick={() => router.push(`/${locale}/login`)}
            className="w-full rounded-xl border-2 border-blue-700 p-3.5 font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => router.push(`/${locale}`)}
            className="w-full rounded-xl border-2 border-gray-300 p-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            ← {t("back")}
          </button>
        </form>
      </div>
    </main>
  );
}