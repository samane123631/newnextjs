"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function VerifyPhonePage() {
  const t = useTranslations("VerifyPhone");

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const locale = params.locale as string;
  const userId = searchParams.get("userId");

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // کد موقت برای نمایش روی صفحه
  const [verificationCode] = useState(
    searchParams.get("code") || ""
  );

  async function handleVerify() {
    if (!userId) {
      setMessage(t("userNotFound"));
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setMessage(t("invalidCode"));
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/auth/verify_phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
          verificationCode: code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || t("error"));
        return;
      }

      setSuccess(true);
      setMessage(t("success"));

      setTimeout(() => {
        router.push(`/${locale}/profile`);
      }, 1000);
    } catch (error) {
      console.error("Verify phone error:", error);
      setMessage(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir={locale === "fa" ? "rtl" : "ltr"}
      className="flex min-h-screen items-center justify-center px-4"
    >
      <div className="w-full max-w-md text-center">

        <h1 className="mb-4 text-2xl font-bold">
          {t("title")}
        </h1>

        <p className="mb-6 text-gray-600">
          {t("subtitle")}
        </p>

        {/* نمایش کد تستی */}
        {verificationCode && (
          <div className="mb-6 rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
            <p className="mb-2 text-sm font-semibold text-gray-700">
              کد تأیید شما:
            </p>

            <p
              dir="ltr"
              className="text-3xl font-bold tracking-[0.4em] text-blue-700"
            >
              {verificationCode}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              این کد فعلاً برای تست روی صفحه نمایش داده می‌شود.
            </p>
          </div>
        )}

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, ""))
          }
          placeholder={t("codePlaceholder")}
          className="w-full rounded-lg border px-4 py-3 text-center text-xl tracking-[0.5em]"
          disabled={loading || success}
        />

        <button
          type="button"
          onClick={handleVerify}
          disabled={loading || success}
          className="mt-4 w-full rounded-lg bg-black py-3 text-white disabled:opacity-50"
        >
          {loading ? t("verifying") : t("verify")}
        </button>

        {message && (
          <p
            className={`mt-4 ${
              success ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}