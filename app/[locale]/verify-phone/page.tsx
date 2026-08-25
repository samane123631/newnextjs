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

      // رفتن به پروفایل همان زبان
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
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          {t("title")}
        </h1>

        <p className="mb-6 text-gray-600">
          {t("subtitle")}
        </p>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, ""))
          }
          placeholder={t("codePlaceholder")}
          className="w-full border rounded-lg px-4 py-3 text-center text-xl tracking-[0.5em]"
          disabled={loading || success}
        />

        <button
          type="button"
          onClick={handleVerify}
          disabled={loading || success}
          className="mt-4 w-full rounded-lg bg-black text-white py-3 disabled:opacity-50"
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