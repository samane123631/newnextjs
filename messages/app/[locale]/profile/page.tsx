"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  level: string;
};

export default function Profile() {
  const t = useTranslations("Profile");

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/auth/profile");

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const result = await response.json();

        if (result.success) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div className="w-full">

          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-indigo-700">
              {t("title")}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {t("subtitle")}
            </p>
          </div>

          <div className="w-full overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-indigo-100">

            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-6 text-white">
              <h2 className="text-xl font-bold">
                {t("personalInformation")}
              </h2>

              <p className="mt-1 text-sm text-indigo-100">
                {t("accountDetails")}
              </p>
            </div>

            <div className="w-full p-6">

              {loading ? (
                <div className="py-10 text-center text-slate-500">
                  {t("loading")}
                </div>
              ) : (
                <div className="w-full overflow-hidden rounded-2xl border border-indigo-100">

                  <table className="profile-table w-full border-collapse">
                    <tbody>

                      <tr className="border-b border-indigo-100">
                        <td className="w-1/3 bg-indigo-50 px-5 py-4 text-left font-semibold text-indigo-700">
                          {t("firstName")}
                        </td>

                        <td className="px-5 py-4 text-left font-medium text-slate-700">
                          {user?.firstName || "—"}
                        </td>
                      </tr>

                      <tr className="border-b border-indigo-100">
                        <td className="w-1/3 bg-blue-50 px-5 py-4 text-left font-semibold text-blue-700">
                          {t("lastName")}
                        </td>

                        <td className="px-5 py-4 text-left font-medium text-slate-700">
                          {user?.lastName || "—"}
                        </td>
                      </tr>

                      <tr className="border-b border-indigo-100">
                        <td className="w-1/3 bg-indigo-50 px-5 py-4 text-left font-semibold text-indigo-700">
                          {t("email")}
                        </td>

                        <td className="px-5 py-4 text-left font-medium text-slate-700">
                          {user?.email || "—"}
                        </td>
                      </tr>

                      <tr className="border-b border-indigo-100">
                        <td className="w-1/3 bg-blue-50 px-5 py-4 text-left font-semibold text-blue-700">
                          {t("birthDate")}
                        </td>

                        <td className="px-5 py-4 text-left font-medium text-slate-700">
                          {user?.birthDate
                            ? new Date(user.birthDate).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>

                      <tr>
                        <td className="w-1/3 bg-indigo-50 px-5 py-4 text-left font-semibold text-indigo-700">
                          {t("level")}
                        </td>

                        <td className="px-5 py-4 text-left font-medium text-slate-700">
                          {user?.level || "—"}
                        </td>
                      </tr>

                    </tbody>
                  </table>

                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}