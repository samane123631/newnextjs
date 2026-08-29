"use client";

import { useState } from "react";

type Props = {
  locale: string;
  classId: number;
};

export default function PaymentReceiptForm({
  locale,
  classId,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!file) {
      setMessage(
        locale === "fa"
          ? "لطفاً تصویر فیش را انتخاب کنید."
          : locale === "de"
            ? "Bitte wählen Sie einen Zahlungsbeleg aus."
            : "Please select a payment receipt."
      );

      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("classId", String(classId));

      const response = await fetch("/api/payment/receipt", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Upload failed"
        );
      }

      setMessage(
        locale === "fa"
          ? "فیش پرداخت با موفقیت ارسال شد."
          : locale === "de"
            ? "Der Zahlungsbeleg wurde erfolgreich gesendet."
            : "The payment receipt was sent successfully."
      );

      // پاک کردن فایل انتخاب‌شده
      setFile(null);

    } catch (error) {
      console.error("Receipt upload error:", error);

      setMessage(
        locale === "fa"
          ? "ارسال فیش با خطا مواجه شد."
          : locale === "de"
            ? "Beim Senden des Zahlungsbelegs ist ein Fehler aufgetreten."
            : "An error occurred while sending the payment receipt."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6"
    >
      <label className="block text-sm font-semibold text-gray-700">
        {locale === "fa"
          ? "تصویر فیش پرداخت"
          : locale === "de"
            ? "Zahlungsbeleg"
            : "Payment Receipt"}
      </label>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={(event) => {
          setFile(
            event.target.files?.[0] || null
          );
        }}
        className="mt-2 block w-full rounded-lg border border-gray-300 p-3"
      />

      {file && (
        <p className="mt-2 text-sm text-gray-600">
          {file.name}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-lg bg-blue-700 py-3 text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? locale === "fa"
            ? "در حال ارسال..."
            : locale === "de"
              ? "Wird gesendet..."
              : "Sending..."
          : locale === "fa"
            ? "ارسال فیش پرداخت"
            : locale === "de"
              ? "Zahlungsbeleg senden"
              : "Send Payment Receipt"}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-gray-700">
          {message}
        </p>
      )}
    </form>
  );
}