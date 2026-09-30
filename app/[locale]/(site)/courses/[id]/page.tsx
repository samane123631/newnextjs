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

  const registeredCount = await prisma.payment.count({
    where: {
      classId: classId,
      status: "PENDING",
    },
  });

  const remainingCapacity = Math.max(
    0,
    classItem.maxStudents - registeredCount
  );

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

      Online: {
        fa: "آنلاین",
        de: "Online",
        en: "Online",
      },

      Präsenz: {
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

  const registerUrl =
    `/${routeLocale}/courses/${classItem.id}/register`;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-xl ring-1 ring-gray-200">

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-700">
              {title}
            </h1>

            <p className="mt-4 text-gray-600">
              {description}
            </p>
          </div>

          <div className="space-y-5 text-gray-700">

            <div>
              🕒{" "}
              <strong>{t("time")}:</strong>{" "}
              {getDay(classItem.day)}{" "}
              {classItem.startTime || ""}{" "}
              {classItem.startTime && classItem.endTime
                ? "-"
                : ""}{" "}
              {classItem.endTime || ""}
            </div>

            <div>
              📅{" "}
              <strong>{t("duration")}:</strong>{" "}
              {getDuration(classItem.numberOfSessions)}
            </div>

            <div>
              👨‍🏫{" "}
              <strong>{t("teacher")}:</strong>{" "}
              {getTeacher(classItem.teacher)}
            </div>

            <div>
              📍{" "}
              <strong>{t("format")}:</strong>{" "}
              {getFormat(classItem.format)}
            </div>

            <div>
              👥{" "}
              <strong>{t("capacity")}:</strong>{" "}
              {remainingCapacity}
            </div>

            <div>
              💰{" "}
              <strong>Price:</strong>{" "}
              {classItem.price !== null &&
              classItem.price !== undefined
                ? classItem.price.toLocaleString()
                : "-"}{" "}
              {classItem.currency || ""}
            </div>

          </div>

          <Link
            href={registerUrl}
            className="mt-8 block w-full rounded-xl bg-blue-700 p-3.5 text-center font-bold text-white shadow-md transition hover:bg-blue-800 hover:shadow-lg"
          >
            {t("register")}
          </Link>

        </div>
      </div>
    </main>
  );
}