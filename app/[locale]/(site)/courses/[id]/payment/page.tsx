import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function CoursePaymentPage({
  params,
}: Props) {
  const { locale: routeLocale, id } = await params;

  const locale = await getLocale();
  const t = await getTranslations("Courses");

  const classId = Number(id);

  if (!Number.isInteger(classId)) {
    notFound();
  }

  const classItem = await prisma.class.findUnique({
    where: {
      id: classId,
    },
  });

  if (classItem === null) {
    notFound();
  }

  const title =
    locale === "fa"
      ? classItem.titleFa ||
        classItem.titleDe ||
        classItem.titleEn ||
        classItem.title ||
        "-"
      : locale === "de"
        ? classItem.titleDe ||
          classItem.titleEn ||
          classItem.titleFa ||
          classItem.title ||
          "-"
        : classItem.titleEn ||
          classItem.titleDe ||
          classItem.titleFa ||
          classItem.title ||
          "-";

  const format =
    classItem.format === "Online"
      ? locale === "fa"
        ? "آنلاین"
        : "Online"
      : classItem.format === "Präsenz"
        ? locale === "fa"
          ? "حضوری"
          : locale === "de"
            ? "Präsenz"
            : "In-person"
        : classItem.format || "-";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          <h1 className="text-3xl font-bold text-blue-700">
            {locale === "fa"
              ? "پرداخت"
              : locale === "de"
                ? "Zahlung"
                : "Payment"}
          </h1>

          <h2 className="mt-6 text-xl font-bold text-gray-800">
            {title}
          </h2>

          <div className="mt-6 rounded-xl bg-gray-50 p-5">
            <div className="space-y-3 text-gray-700">

              <p>
                <strong>{t("time")}:</strong>{" "}
                {classItem.day}{" "}
                {classItem.startTime} - {classItem.endTime}
              </p>

              <p>
                <strong>{t("format")}:</strong>{" "}
                {format}
              </p>

              <p>
                <strong>{t("capacity")}:</strong>{" "}
                {classItem.maxStudents}
              </p>

            </div>
          </div>

          <div className="mt-8 rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-lg font-semibold text-gray-800">
              {locale === "fa"
                ? "هزینه ثبت‌نام"
                : locale === "de"
                  ? "Teilnahmegebühr"
                  : "Registration Fee"}
            </p>

            <p className="mt-3 text-2xl font-bold text-blue-700">
              € 0
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {locale === "fa"
                ? "مبلغ پرداختی بعداً از بخش مدیریت تعیین می‌شود."
                : locale === "de"
                  ? "Der Preis wird später im Admin-Bereich festgelegt."
                  : "The price will be set later in the admin panel."}
            </p>
          </div>

          <button
            type="button"
            className="mt-8 w-full rounded-lg bg-blue-700 py-3 text-white transition hover:bg-blue-800"
          >
            {locale === "fa"
              ? "پرداخت"
              : locale === "de"
                ? "Bezahlen"
                : "Pay Now"}
          </button>

          <Link
            href={`/${routeLocale}/courses/${classItem.id}/register`}
            className="mt-4 block text-center text-gray-600 hover:text-blue-700"
          >
            {locale === "fa"
              ? "بازگشت به ثبت‌نام"
              : locale === "de"
                ? "Zurück zur Anmeldung"
                : "Back to Registration"}
          </Link>

        </div>
      </div>
    </main>
  );
}