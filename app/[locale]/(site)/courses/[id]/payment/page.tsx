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
    <main className="min-h-screen w-full bg-gray-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">

      <div className="flex w-full justify-center">

        <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-lg sm:p-8">

          {/* Page Title */}
          <h1 className="text-center text-2xl font-bold text-blue-700 sm:text-3xl">
            {locale === "fa"
              ? "پرداخت"
              : locale === "de"
                ? "Zahlung"
                : "Payment"}
          </h1>

          {/* Course Title */}
          <h2 className="mt-5 text-center text-lg font-bold leading-7 text-gray-800 sm:text-xl">
            {title}
          </h2>

          {/* Course Information */}
          <div className="mt-6 rounded-xl bg-gray-50 p-4 sm:p-5">

            <div className="space-y-3 text-sm leading-6 text-gray-700 sm:text-base">

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
          <div className="mt-6 rounded-xl border border-gray-200 p-4 text-center sm:mt-8 sm:p-5">

            <p className="text-base font-semibold text-gray-800 sm:text-lg">
              {locale === "fa"
                ? "هزینه ثبت‌نام"
                : locale === "de"
                  ? "Teilnahmegebühr"
                  : "Registration Fee"}
            </p>

            <p className="mt-3 text-xl font-bold text-blue-700 sm:text-2xl">
              {price} {currency}
            </p>

          </div>

          {/* Bank Information */}
          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:mt-6 sm:p-5">

            <h3 className="text-base font-bold text-gray-800 sm:text-lg">
              {locale === "fa"
                ? "اطلاعات پرداخت"
                : locale === "de"
                  ? "Zahlungsinformationen"
                  : "Payment Information"}
            </h3>

            <div className="mt-4 space-y-5 text-gray-700">

              {/* Card Number */}
              <div>

                <p className="text-xs text-gray-500 sm:text-sm">
                  {locale === "fa"
                    ? "شماره کارت"
                    : locale === "de"
                      ? "Kartennummer"
                      : "Card Number"}
                </p>

                <p
                  dir="ltr"
                  className="mt-1 break-all text-base font-bold tracking-wider sm:text-lg"
                >
                  5047 0610 3440 9710
                </p>

              </div>

              {/* Card Holder */}
              <div>

                <p className="text-xs text-gray-500 sm:text-sm">
                  {locale === "fa"
                    ? "به نام"
                    : locale === "de"
                      ? "Kontoinhaber"
                      : "Card Holder"}
                </p>

                <p className="mt-1 text-sm font-semibold sm:text-base">
                  الهه آزادی
                </p>

              </div>

            </div>

            <p className="mt-5 text-sm leading-7 text-gray-600">
              {locale === "fa"
                ? "لطفاً مبلغ بالا را به شماره کارت زیر واریز کنید و سپس تصویر فیش پرداخت را ارسال کنید."
                : locale === "de"
                  ? "Bitte überweisen Sie den oben genannten Betrag auf die folgende Karte und senden Sie anschließend einen Zahlungsbeleg."
                  : "Please transfer the amount shown above to the following card and then send your payment receipt."}
            </p>

          </div>

          {/* Payment Receipt */}
          <div className="mt-6 w-full">
            <PaymentReceiptForm
              locale={locale}
              classId={classItem.id}
            />
          </div>

          {/* Back to Registration */}
          <Link
            href={`/${routeLocale}/courses/${classItem.id}/register`}
            className="mt-5 block text-center text-sm text-gray-600 transition hover:text-blue-700"
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