import { prisma } from "@/lib/prisma";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const locale = await getLocale();
  const t = await getTranslations("Courses");

  const classes = await prisma.class.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  function getTitle(item: (typeof classes)[number]) {
    if (locale === "fa") {
      return (
        item.titleFa ||
        item.titleDe ||
        item.titleEn ||
        item.title ||
        "-"
      );
    }

    if (locale === "de") {
      return (
        item.titleDe ||
        item.titleEn ||
        item.titleFa ||
        item.title ||
        "-"
      );
    }

    return (
      item.titleEn ||
      item.titleDe ||
      item.titleFa ||
      item.title ||
      "-"
    );
  }

  function getDescription(item: (typeof classes)[number]) {
    if (locale === "fa") {
      return (
        item.descriptionFa ||
        item.descriptionDe ||
        item.descriptionEn ||
        item.description ||
        "-"
      );
    }

    if (locale === "de") {
      return (
        item.descriptionDe ||
        item.descriptionEn ||
        item.descriptionFa ||
        item.description ||
        "-"
      );
    }

    return (
      item.descriptionEn ||
      item.descriptionDe ||
      item.descriptionFa ||
      item.description ||
      "-"
    );
  }

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
      difference /
        (1000 * 60 * 60 * 24 * 7)
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

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-10 text-center text-3xl font-bold text-blue-700">
          {t("title")}
        </h1>

        {classes.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
            {t("noClasses")}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {classes.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white p-6 shadow-md"
              >
                <h2 className="mb-3 text-xl font-bold text-blue-700">
                  {getTitle(item)}
                </h2>

                <p className="mb-5 text-gray-600">
                  {getDescription(item)}
                </p>

                <div className="space-y-3 text-sm text-gray-700">

                  <div>
                    👨‍🏫{" "}
                    <strong>
                      {t("teacher")}:
                    </strong>{" "}
                    {getDescription(item)}
                  </div>

                  <div>
                    🕒{" "}
                    <strong>
                      {t("time")}:
                    </strong>{" "}
                    {getDay(item.day)}{" "}
                    {item.startTime} -{" "}
                    {item.endTime}
                  </div>

                  <div>
                    📅{" "}
                    <strong>
                      {t("duration")}:
                    </strong>{" "}
                    {getDuration(
                      item.startDate,
                      item.endDate
                    )}
                  </div>

                  <div>
                    📍{" "}
                    <strong>
                      {t("format")}:
                    </strong>{" "}
                    {getFormat(item.format)}
                  </div>

                  <div>
                    👥{" "}
                    <strong>
                      {t("capacity")}:
                    </strong>{" "}
                    {item.maxStudents}
                  </div>

                </div>

                <Link
                  href={`/${locale}/courses/${item.id}`}
                  className="mt-6 block w-full rounded-lg bg-blue-700 py-3 text-center text-white transition hover:bg-blue-800"
                >
                  {t("register")}
                </Link>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}