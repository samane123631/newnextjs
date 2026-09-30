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
    include: {
      _count: {
        select: {
          payments: {
            where: {
              status: "PENDING",
            },
          },
        },
      },
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

  function getTeacher(teacher: string | null) {
    if (!teacher) {
      return "-";
    }

    const teachers: Record<
      string,
      {
        fa: string;
        de: string;
        en: string;
      }
    > = {
      "Herr Eftekharzadeh": {
        fa: "استاد افتخارزاده",
        de: "Herr Eftekharzadeh",
        en: "Mr. Eftekharzadeh",
      },

      "Mrs Azadi": {
        fa: "سرکار خانم آزادی",
        de: "Mrs Azadi",
        en: "Mrs Azadi",
      },
    };

    const selectedTeacher = teachers[teacher];

    if (!selectedTeacher) {
      return teacher;
    }

    if (locale === "fa") {
      return selectedTeacher.fa;
    }

    if (locale === "de") {
      return selectedTeacher.de;
    }

    return selectedTeacher.en;
  }

  function getDay(day: string | null) {
    if (!day) {
      return "-";
    }

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
        en: "Samstag",
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

    const formats: Record<
      string,
      {
        fa: string;
        de: string;
        en: string;
      }
    > = {
      "Online - Intensive": {
        fa: "آنلاین - فشرده",
        de: "Online - Intensiv",
        en: "Online - Intensive",
      },

      "Online - Normal": {
        fa: "آنلاین - عادی",
        de: "Online - Normal",
        en: "Online - Normal",
      },

      "Präsenz - Group": {
        fa: "حضوری - گروهی",
        de: "Präsenz - Gruppe",
        en: "In-person - Group",
      },

      "Präsenz - Private - Intensive": {
        fa: "حضوری - خصوصی - فشرده",
        de: "Präsenz - Privat - Intensiv",
        en: "In-person - Private - Intensive",
      },

      "Präsenz - Private - Normal": {
        fa: "حضوری - خصوصی - عادی",
        de: "Präsenz - Privat - Normal",
        en: "In-person - Private - Normal",
      },

      "Online": {
        fa: "آنلاین",
        de: "Online",
        en: "Online",
      },

      "Präsenz": {
        fa: "حضوری",
        de: "Präsenz",
        en: "In-person",
      },
    };

    const selectedFormat = formats[format];

    if (!selectedFormat) {
      return format;
    }

    if (locale === "fa") {
      return selectedFormat.fa;
    }

    if (locale === "de") {
      return selectedFormat.de;
    }

    return selectedFormat.en;
  }

  function getDuration(numberOfSessions: number | null) {
    if (
      numberOfSessions === null ||
      numberOfSessions === undefined
    ) {
      return "-";
    }

    if (locale === "fa") {
      return `${numberOfSessions} جلسه`;
    }

    if (locale === "de") {
      return `${numberOfSessions} Sitzungen`;
    }

    return `${numberOfSessions} sessions`;
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

            {classes.map((item) => {
              const remainingCapacity = Math.max(
                0,
                item.maxStudents - item._count.payments
              );

              return (
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
                      {getTeacher(item.teacher)}
                    </div>

                    <div>
                      🕒{" "}
                      <strong>
                        {t("time")}:
                      </strong>{" "}
                      {getDay(item.day)}{" "}
                      {item.startTime || ""}{" "}
                      {item.startTime && item.endTime
                        ? "-"
                        : ""}{" "}
                      {item.endTime || ""}
                    </div>

                    <div>
                      📅{" "}
                      <strong>
                        {t("duration")}:
                      </strong>{" "}
                      {getDuration(item.numberOfSessions)}
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
                      {remainingCapacity}
                    </div>

                  </div>

                  <Link
                    href={`/${locale}/courses/${item.id}`}
                    className="mt-6 block w-full rounded-lg bg-blue-700 py-3 text-center text-white transition hover:bg-blue-800"
                  >
                    {t("register")}
                  </Link>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}