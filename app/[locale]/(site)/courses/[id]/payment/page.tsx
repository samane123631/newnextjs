import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import PaymentReceiptForm from "@/app/components/PaymentReceiptForm";

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

  const price =
    classItem.price !== null &&
    classItem.price !== undefined
      ? classItem.price.toLocaleString()
      : "-";

  const currency = classItem.currency || "";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          {/* Page title */}
          <h1 className="text-3xl font-bold text-blue-700">
            {locale === "fa"
              ? "پرداخت"
              : locale === "de"
                ? "Zahlung"
                : "Payment"}
          </h1>

          {/* Course title */}
          <h2 className="mt-6 text-xl font-bold text-gray-800">
            {title}
          </h2>

          {/* Course information */}
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

          {/* Price */}
          <div className="mt-8 rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-lg font-semibold text-gray-800">
              {locale === "fa"
                ? "هزینه ثبت‌نام"
                : locale === "de"
                  ? "Teilnahmegebühr"
                  : "Registration Fee"}
            </p>

            <p className="mt-3 text-2xl font-bold text-blue-700">
              {price} {currency}
            </p>
          </div>

          {/* Bank information */}
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">

            <h3 className="text-lg font-bold text-gray-800">
              {locale === "fa"
                ? "اطلاعات پرداخت"
                : locale === "de"
                  ? "Zahlungsinformationen"
                  : "Payment Information"}
            </h3>

            <div className="mt-4 space-y-4 text-gray-700">

              {/* Card number */}
              <div>
                <p className="text-sm text-gray-500">
                  {locale === "fa"
                    ? "شماره کارت"
                    : locale === "de"
                      ? "Kartennummer"
                      : "Card Number"}
                </p>

                <p
                  dir="ltr"
                  className="mt-1 text-lg font-bold tracking-wider"
                >
                  5047 0610 3440 9710
                </p>
              </div>

              {/* Card holder */}
              <div>
                <p className="text-sm text-gray-500">
                  {locale === "fa"
                    ? "به نام"
                    : locale === "de"
                      ? "Kontoinhaber"
                      : "Card Holder"}
                </p>

                <p className="mt-1 font-semibold">
                  الهه آزادی
                </p>
              </div>

            </div>

            <p className="mt-5 text-sm text-gray-600">
              {locale === "fa"
                ? "لطفاً مبلغ بالا را به شماره کارت زیر واریز کنید و سپس تصویر فیش پرداخت را ارسال کنید."
                : locale === "de"
                  ? "Bitte überweisen Sie den oben genannten Betrag auf die folgende Karte und senden Sie anschließend einen Zahlungsbeleg."
                  : "Please transfer the amount shown above to the following card and then send your payment receipt."}
            </p>

          </div>

          {/* Payment receipt upload */}
          <PaymentReceiptForm
            locale={locale}
            classId={classItem.id}
          />

          {/* Back to registration */}
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