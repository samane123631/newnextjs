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

type Evaluation = {
  id: number;
  grammar: number;
  speaking: number;
  writing: number;
  listening: number;
  createdAt: string;
};

export default function Profile() {
  const t = useTranslations("Profile");

  const [user, setUser] = useState<UserProfile | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileResponse, evaluationResponse] =
          await Promise.all([
            fetch("/api/auth/profile", {
              cache: "no-store",
            }),
            fetch("/api/student/evaluations", {
              cache: "no-store",
            }),
          ]);

        if (profileResponse.ok) {
          const profileResult = await profileResponse.json();

          if (profileResult.success) {
            setUser(profileResult.user);
          }
        }

        if (evaluationResponse.ok) {
          const evaluationResult =
            await evaluationResponse.json();

          if (evaluationResult.success) {
            setEvaluations(
              evaluationResult.evaluations ?? []
            );
          }
        }
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const latestEvaluation =
    evaluations.length > 0
      ? evaluations[evaluations.length - 1]
      : null;

  const currentAverage = latestEvaluation
    ? (
        (
          latestEvaluation.grammar +
          latestEvaluation.speaking +
          latestEvaluation.writing +
          latestEvaluation.listening
        ) /
        4
      ) * 100
    : null;

  const termAverage =
    evaluations.length > 0
      ? (evaluations.reduce(
          (sum, evaluation) =>
            sum +
            (
              evaluation.grammar +
              evaluation.speaking +
              evaluation.writing +
              evaluation.listening
            ) /
              4,
          0
        ) /
          evaluations.length) *
        100
      : null;

  const formatScore = (score: number | null) => {
    if (score === null) {
      return "—";
    }

    return `${Math.round(score)}%`;
  };

  return (
    <main className="flex min-h-screen w-full justify-center bg-slate-100 px-4 py-12">
      <div className="flex w-full max-w-4xl flex-col items-center">
        {/* Page Header */}
        <div className="mb-8 w-full text-center">
          <h1 className="text-4xl font-bold text-indigo-700">
            {t("title")}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {t("subtitle")}
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] w-full items-center justify-center">
            <p className="text-slate-500">
              {t("loading")}
            </p>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-8">
            {/* Personal Information */}
            <section className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-indigo-100">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-6 text-center text-white">
                <h2 className="text-xl font-bold">
                  {t("personalInformation")}
                </h2>

                <p className="mt-1 text-sm text-indigo-100">
                  {t("accountDetails")}
                </p>
              </div>

              <div className="flex w-full justify-center p-6">
                <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-indigo-100">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-indigo-100">
                        <td className="w-1/2 bg-indigo-50 px-5 py-4 text-left font-semibold text-indigo-700">
                          {t("firstName")}
                        </td>

                        <td className="px-5 py-4 text-left font-medium text-slate-700">
                          {user?.firstName || "—"}
                        </td>
                      </tr>

                      <tr className="border-b border-indigo-100">
                        <td className="w-1/2 bg-blue-50 px-5 py-4 text-left font-semibold text-blue-700">
                          {t("lastName")}
                        </td>

                        <td className="px-5 py-4 text-left font-medium text-slate-700">
                          {user?.lastName || "—"}
                        </td>
                      </tr>

                      <tr className="border-b border-indigo-100">
                        <td className="w-1/2 bg-indigo-50 px-5 py-4 text-left font-semibold text-indigo-700">
                          {t("email")}
                        </td>

                        <td className="px-5 py-4 text-left font-medium text-slate-700">
                          {user?.email || "—"}
                        </td>
                      </tr>

                      <tr className="border-b border-indigo-100">
                        <td className="w-1/2 bg-blue-50 px-5 py-4 text-left font-semibold text-blue-700">
                          {t("birthDate")}
                        </td>

                        <td className="px-5 py-4 text-left font-medium text-slate-700">
                          {user?.birthDate
                            ? new Date(
                                user.birthDate
                              ).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>

                      <tr>
                        <td className="w-1/2 bg-indigo-50 px-5 py-4 text-left font-semibold text-indigo-700">
                          {t("level")}
                        </td>

                        <td className="px-5 py-4 text-left font-medium text-slate-700">
                          {user?.level || "—"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Evaluation */}
            <section className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-indigo-100">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-6 text-center text-white">
                <h2 className="text-xl font-bold">
                  {t("evaluation")}
                </h2>

                <p className="mt-1 text-sm text-indigo-100">
                  {t("evaluationDescription")}
                </p>
              </div>

              <div className="flex w-full justify-center p-6">
                {evaluations.length === 0 ? (
                  <div className="w-full max-w-2xl rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-8 text-center text-slate-500">
                    {t("noEvaluations")}
                  </div>
                ) : (
                  <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-indigo-100">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr className="border-b border-indigo-100">
                          <td className="w-1/2 bg-indigo-50 px-5 py-4 text-left font-semibold text-indigo-700">
                            {t("currentAverage")}
                          </td>

                          <td className="px-5 py-4 text-left font-bold text-slate-700">
                            {formatScore(currentAverage)}
                          </td>
                        </tr>

                        <tr className="border-b border-indigo-100">
                          <td className="w-1/2 bg-blue-50 px-5 py-4 text-left font-semibold text-blue-700">
                            {t("termAverage")}
                          </td>

                          <td className="px-5 py-4 text-left font-bold text-slate-700">
                            {formatScore(termAverage)}
                          </td>
                        </tr>

                        <tr className="border-b border-indigo-100">
                          <td className="w-1/2 bg-indigo-50 px-5 py-4 text-left font-semibold text-indigo-700">
                            {t("grammar")}
                          </td>

                          <td className="px-5 py-4 text-left font-medium text-slate-700">
                            {formatScore(
                              latestEvaluation
                                ? latestEvaluation.grammar * 100
                                : null
                            )}
                          </td>
                        </tr>

                        <tr className="border-b border-indigo-100">
                          <td className="w-1/2 bg-blue-50 px-5 py-4 text-left font-semibold text-blue-700">
                            {t("speaking")}
                          </td>

                          <td className="px-5 py-4 text-left font-medium text-slate-700">
                            {formatScore(
                              latestEvaluation
                                ? latestEvaluation.speaking * 100
                                : null
                            )}
                          </td>
                        </tr>

                        <tr className="border-b border-indigo-100">
                          <td className="w-1/2 bg-indigo-50 px-5 py-4 text-left font-semibold text-indigo-700">
                            {t("writing")}
                          </td>

                          <td className="px-5 py-4 text-left font-medium text-slate-700">
                            {formatScore(
                              latestEvaluation
                                ? latestEvaluation.writing * 100
                                : null
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td className="w-1/2 bg-blue-50 px-5 py-4 text-left font-semibold text-blue-700">
                            {t("listening")}
                          </td>

                          <td className="px-5 py-4 text-left font-medium text-slate-700">
                            {formatScore(
                              latestEvaluation
                                ? latestEvaluation.listening * 100
                                : null
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}