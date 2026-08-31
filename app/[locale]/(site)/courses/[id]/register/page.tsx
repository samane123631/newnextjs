import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function CourseRegisterPage({
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

  if (!classItem) {
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

  async function continueRegistration() {
    "use server";

    const session = await prisma.session.findFirst({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!session) {
      redirect(`/${routeLocale}/login`);
    }

    redirect(`/${routeLocale}/courses/${classId}/payment`);
  }

  return (
    <main className="min-h-screen w-full bg-gray-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="flex w-full justify-center">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-lg sm:p-8">

          <h1 className="text-center text-2xl font-bold leading-8 text-blue-700 sm:text-3xl">
            {title}
          </h1>

          <p className="mt-4 text-center text-sm leading-7 text-gray-600 sm:text-base">
            {locale === "fa"
              ? "برای ثبت‌نام در این کلاس آماده‌اید؟"
              : locale === "de"
                ? "Möchten Sie sich für diesen Kurs anmelden?"
                : "Would you like to register for this course?"}
          </p>

          <div className="mt-7 rounded-xl bg-gray-50 p-4 sm:mt-8 sm:p-5">
            <div className="space-y-3 text-sm leading-6 text-gray-700 sm:text-base">

              <p>
                <strong>{t("time")}:</strong>{" "}
                {classItem.day}{" "}
                {classItem.startTime} -{" "}
                {classItem.endTime}
              </p>

              <p>
                <strong>{t("capacity")}:</strong>{" "}
                {classItem.maxStudents}
              </p>

            </div>
          </div>

          <form action={continueRegistration}>
            <button
              type="submit"
              className="mt-7 w-full rounded-lg bg-blue-700 py-3.5 text-sm font-medium text-white transition hover:bg-blue-800 sm:mt-8"
            >
              {locale === "fa"
                ? "ادامه ثبت‌نام"
                : locale === "de"
                  ? "Registrierung fortsetzen"
                  : "Continue Registration"}
            </button>
          </form>

          <Link
            href={`/${routeLocale}/courses/${classItem.id}`}
            className="mt-4 block text-center text-sm text-gray-600 transition hover:text-blue-700"
          >
            {locale === "fa"
              ? "بازگشت به کلاس"
              : locale === "de"
                ? "Zurück zum Kurs"
                : "Back to Course"}
          </Link>

        </div>
      </div>
    </main>
  );
}