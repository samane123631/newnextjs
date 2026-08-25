"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminContactPage() {
  const router = useRouter();
  const locale = useLocale();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      try {
        const response = await fetch(
          "/api/auth/admin/contact",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "خطا در دریافت پیام‌ها."
          );
        }

        setMessages(data.messages);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "LOAD CONTACT MESSAGES ERROR:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "خطا در دریافت پیام‌ها."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, []);

  async function markAsRead(id: number) {
    try {
      const response = await fetch(
        "/api/auth/admin/contact",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "خطا در تغییر وضعیت پیام."
        );
      }

      setMessages((previous) =>
        previous.map((message) =>
          message.id === id
            ? {
                ...message,
                isRead: true,
              }
            : message
        )
      );
    } catch (error) {
      console.error(
        "MARK CONTACT MESSAGE ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "خطا در تغییر وضعیت پیام."
      );
    }
  }

  async function deleteMessage(id: number) {
    const confirmed = window.confirm(
      "آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        "/api/auth/admin/contact",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "خطا در حذف پیام."
        );
      }

      setMessages((previous) =>
        previous.filter(
          (message) => message.id !== id
        )
      );
    } catch (error) {
      console.error(
        "DELETE CONTACT MESSAGE ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "خطا در حذف پیام."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Contact Messages
            </h1>

            <p className="mt-2 text-gray-600">
              Messages sent by website users
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(`/${locale}/admin`)
            }
            className="rounded-lg bg-gray-700 px-5 py-2.5 font-semibold text-white hover:bg-gray-800"
          >
            ← Dashboard
          </button>
        </div>

        {/* Messages Table */}
        <div className="overflow-x-auto rounded-xl bg-white shadow-md">

          <table className="min-w-[1000px] w-full text-left">

            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-4">
                  Name
                </th>

                <th className="px-4 py-4">
                  Email
                </th>

                <th className="px-4 py-4">
                  Message
                </th>

                <th className="px-4 py-4">
                  Date
                </th>

                <th className="px-4 py-4">
                  Status
                </th>

                <th className="px-4 py-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Loading messages...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((message) => (
                  <tr
                    key={message.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-4 py-4 font-semibold">
                      {message.name}
                    </td>

                    <td className="px-4 py-4">
                      {message.email}
                    </td>

                    <td className="max-w-md whitespace-pre-wrap px-4 py-4">
                      {message.message}
                    </td>

                    <td className="px-4 py-4">
                      {new Date(
                        message.createdAt
                      ).toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      {message.isRead ? (
                        <span className="font-semibold text-green-600">
                          Read
                        </span>
                      ) : (
                        <span className="font-semibold text-red-600">
                          New
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">

                        {!message.isRead && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsRead(message.id)
                            }
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Read
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteMessage(message.id)
                          }
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}