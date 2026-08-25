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
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          <h1 className="text-3xl font-bold text-blue-700">
            {title}
          </h1>

          <p className="mt-4 text-gray-600">
            {locale === "fa"
              ? "برای ثبت‌نام در این کلاس آماده‌اید؟"
              : locale === "de"
                ? "Möchten Sie sich für diesen Kurs anmelden?"
                : "Would you like to register for this course?"}
          </p>

          <div className="mt-8 rounded-xl bg-gray-50 p-5">
            <p className="text-gray-700">
              <strong>{t("time")}:</strong>{" "}
              {classItem.day} {classItem.startTime} -{" "}
              {classItem.endTime}
            </p>

            <p className="mt-3 text-gray-700">
              <strong>{t("capacity")}:</strong>{" "}
              {classItem.maxStudents}
            </p>
          </div>

          <form action={continueRegistration}>
            <button
              type="submit"
              className="mt-8 w-full rounded-lg bg-blue-700 py-3 text-white transition hover:bg-blue-800"
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
            className="mt-4 block text-center text-gray-600 hover:text-blue-700"
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