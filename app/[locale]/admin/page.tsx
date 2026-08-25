"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const locale = pathname.split("/")[1] || "de";

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch("/api/auth/admin", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          router.replace(`/${locale}/admin-login`);
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("Admin check error:", error);
        router.replace(`/${locale}/admin-login`);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [router, locale]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your website
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            {/* Back to Website */}
            <button
              type="button"
              onClick={() => router.push(`/${locale}`)}
              className="
                rounded-lg
                bg-blue-600
                px-5
                py-2.5
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
              "
            >
              ← Back to Website
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={async () => {
                try {
                  await fetch("/api/auth/admin-logout", {
                    method: "POST",
                  });
                } catch (error) {
                  console.error("Admin logout error:", error);
                }

                router.replace(`/${locale}/admin-login`);
              }}
              className="
                rounded-lg
                bg-red-600
                px-5
                py-2.5
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-red-700
              "
            >
              Logout
            </button>

          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* Users */}
          <button
            type="button"
            onClick={() => router.push(`/${locale}/admin/users`)}
            className="
              rounded-xl
              bg-white
              p-6
              text-left
              shadow-md
              transition
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="mb-4 text-4xl">
              👥
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Users
            </h2>

            <p className="mt-2 text-gray-500">
              View, add and delete users.
            </p>
          </button>

          {/* News */}
          <button
            type="button"
            onClick={() => router.push(`/${locale}/admin/news`)}
            className="
              rounded-xl
              bg-white
              p-6
              text-left
              shadow-md
              transition
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="mb-4 text-4xl">
              📰
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              News
            </h2>

            <p className="mt-2 text-gray-500">
              Create and manage news in three languages.
            </p>
          </button>

          {/* Classes */}
          <button
            type="button"
            onClick={() => router.push(`/${locale}/admin/classes`)}
            className="
              rounded-xl
              bg-white
              p-6
              text-left
              shadow-md
              transition
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="mb-4 text-4xl">
              📚
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Classes
            </h2>

            <p className="mt-2 text-gray-500">
              Add and remove classes, days and schedules.
            </p>
          </button>

          {/* Contact */}
          <button
            type="button"
            onClick={() => router.push(`/${locale}/admin/contact`)}
            className="
              rounded-xl
              bg-white
              p-6
              text-left
              shadow-md
              transition
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="mb-4 text-4xl">
              💬
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Contact
            </h2>

            <p className="mt-2 text-gray-500">
              View messages sent by website users.
            </p>
          </button>

        </div>

      </div>
    </main>
  );
}