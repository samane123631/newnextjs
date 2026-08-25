"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const locale = pathname.split("/")[1] || "de";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            (locale === "fa"
              ? "دسترسی مجاز نیست."
              : locale === "en"
                ? "Access denied."
                : "Zugriff verweigert.")
        );
        return;
      }

      router.push(`/${locale}/admin`);
      router.refresh();
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        locale === "fa"
          ? "خطایی در ورود رخ داد."
          : locale === "en"
            ? "An error occurred."
            : "Beim Login ist ein Fehler aufgetreten."
      );
    } finally {
      setLoading(false);
    }
  }

  const title =
    locale === "fa"
      ? "ورود مدیر"
      : locale === "en"
        ? "Admin Login"
        : "Admin-Login";

  const emailLabel =
    locale === "fa"
      ? "ایمیل"
      : locale === "en"
        ? "Email"
        : "E-Mail";

  const loginText =
    locale === "fa"
      ? "ورود به پنل مدیریت"
      : locale === "en"
        ? "Login to Admin Panel"
        : "Zum Admin-Bereich";

  const backText =
    locale === "fa"
      ? "← بازگشت به صفحه اصلی"
      : locale === "en"
        ? "← Back to Website"
        : "← Zur Startseite";

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">

        <h1 className="mb-6 text-center text-2xl font-bold text-blue-700 sm:text-3xl">
          {title}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {emailLabel}
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="example@email.com"
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-4
                py-3
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-200
              "
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-lg
              bg-blue-700
              px-4
              py-3
              font-semibold
              text-white
              shadow-md
              transition
              hover:bg-blue-800
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? "..." : loginText}
          </button>

          {/* Back to Website */}
          <button
            type="button"
            onClick={() => router.push(`/${locale}`)}
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-4
              py-3
              font-semibold
              text-gray-700
              transition
              hover:bg-gray-100
            "
          >
            {backText}
          </button>

        </form>
      </div>
    </main>
  );
}