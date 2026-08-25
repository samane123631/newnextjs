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

export default async function CourseDetailsPage({ params }: Props) {
  const { locale: routeLocale, id } = await params;

  const locale = await getLocale();
  const t = await getTranslations("Courses");

  const classId = Number(id);

  if (!Number.isInteger(classId)) {
    notFound();
  }

  const result = await prisma.class.findUnique({
    where: {
      id: classId,
    },
  });

  if (!result) {
    notFound();
  }

  const classItem = result;

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

  const description =
    locale === "fa"
      ? classItem.descriptionFa ||
        classItem.descriptionDe ||
        classItem.descriptionEn ||
        classItem.description ||
        "-"
      : locale === "de"
        ? classItem.descriptionDe ||
          classItem.descriptionEn ||
          classItem.descriptionFa ||
          classItem.description ||
          "-"
        : classItem.descriptionEn ||
          classItem.descriptionDe ||
          classItem.descriptionFa ||
          classItem.description ||
          "-";

  function getDay(day: string) {
    const days: Record<
      string,
      {
        fa: string;
        de: string;
        en: string;
      }
    > = {
      Monday: {
        fa: "دوشنبه",
        de: "Montag",
        en: "Monday",
      },
      Tuesday: {
        fa: "سه‌شنبه",
        de: "Dienstag",
        en: "Tuesday",
      },
      Wednesday: {
        fa: "چهارشنبه",
        de: "Mittwoch",
        en: "Wednesday",
      },
      Thursday: {
        fa: "پنجشنبه",
        de: "Donnerstag",
        en: "Thursday",
      },
      Friday: {
        fa: "جمعه",
        de: "Freitag",
        en: "Friday",
      },
      Saturday: {
        fa: "شنبه",
        de: "Samstag",
        en: "Saturday",
      },
      Sunday: {
        fa: "یکشنبه",
        de: "Sonntag",
        en: "Sunday",
      },
    };

    const selectedDay = days[day];

    if (!selectedDay) {
      return day;
    }

    if (locale === "fa") {
      return selectedDay.fa;
    }

    if (locale === "de") {
      return selectedDay.de;
    }

    return selectedDay.en;
  }

  function getFormat(format: string | null) {
    if (!format) {
      return "-";
    }

    if (format === "Online") {
      if (locale === "fa") {
        return "آنلاین";
      }

      return "Online";
    }

    if (format === "Präsenz") {
      if (locale === "fa") {
        return "حضوری";
      }

      if (locale === "de") {
        return "Präsenz";
      }

      return "In-person";
    }

    return format;
  }

  function getDuration(
    startDate: Date | null,
    endDate: Date | null
  ) {
    if (!startDate || !endDate) {
      return "-";
    }

    const difference =
      endDate.getTime() - startDate.getTime();

    const weeks = Math.ceil(
      difference / (1000 * 60 * 60 * 24 * 7)
    );

    if (weeks <= 0) {
      return "-";
    }

    if (locale === "fa") {
      return `${weeks} هفته`;
    }

    if (locale === "de") {
      return `${weeks} Wochen`;
    }

    return `${weeks} weeks`;
  }

  const registerUrl = `/${routeLocale}/courses/${classItem.id}/register`;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          <h1 className="text-3xl font-bold text-blue-700">
            {title}
          </h1>

          <p className="mt-4 text-gray-600">
            {description}
          </p>

          <div className="mt-8 space-y-4 text-gray-700">

            <div>
              🕒{" "}
              <strong>{t("time")}:</strong>{" "}
              {getDay(classItem.day)}{" "}
              {classItem.startTime} - {classItem.endTime}
            </div>

            <div>
              📅{" "}
              <strong>{t("duration")}:</strong>{" "}
              {getDuration(
                classItem.startDate,
                classItem.endDate
              )}
            </div>

            <div>
              📍{" "}
              <strong>{t("format")}:</strong>{" "}
              {getFormat(classItem.format)}
            </div>

            <div>
              👥{" "}
              <strong>{t("capacity")}:</strong>{" "}
              {classItem.maxStudents}
            </div>

          </div>

          <Link
            href={registerUrl}
            className="mt-8 block w-full rounded-lg bg-blue-700 py-3 text-center text-white transition hover:bg-blue-800"
          >
            {t("register")}
          </Link>

        </div>
      </div>
    </main>
  );
}