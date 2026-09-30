"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

type ClassItem = {
  id: number;

  title: string | null;
  description: string | null;

  titleFa: string | null;
  titleDe: string | null;
  titleEn: string | null;

  descriptionFa: string | null;
  descriptionDe: string | null;
  descriptionEn: string | null;

  teacher: string | null;

  day: string | null;
  startTime: string | null;
  endTime: string | null;
  format: string | null;

  numberOfSessions: number | null;

  createdAt: string;
  updatedAt: string;
};

export default function MegaMenu() {
  const t = useTranslations("MegaMenu");
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadClasses() {
      try {
        setLoading(true);

        const response = await fetch("/api/classes", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "خطا در دریافت کلاس‌ها."
          );
        }

        setClasses(
          Array.isArray(data.classes)
            ? data.classes
            : []
        );
      } catch (error) {
        console.error(
          "MEGA MENU CLASSES ERROR:",
          error
        );

        if (!cancelled) {
          setClasses([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadClasses();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleOpenCourses = () => {
      setOpen(true);
    };

    window.addEventListener(
      "open-courses-mega-menu",
      handleOpenCourses
    );

    return () => {
      window.removeEventListener(
        "open-courses-mega-menu",
        handleOpenCourses
      );
    };
  }, []);

  function getTitle(item: ClassItem) {
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

  function getDay(item: ClassItem) {
    if (!item.day) {
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

    const day = days[item.day];

    if (!day) {
      return item.day;
    }

    if (locale === "fa") {
      return day.fa;
    }

    if (locale === "en") {
      return day.en;
    }

    return day.de;
  }

  function getFormat(item: ClassItem) {
    if (!item.format) {
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

    const selectedFormat = formats[item.format];

    if (!selectedFormat) {
      return item.format;
    }

    if (locale === "fa") {
      return selectedFormat.fa;
    }

    if (locale === "de") {
      return selectedFormat.de;
    }

    return selectedFormat.en;
  }

  function getDuration(item: ClassItem) {
    if (
      item.numberOfSessions === null ||
      item.numberOfSessions === undefined
    ) {
      return "-";
    }

    if (locale === "fa") {
      return `${item.numberOfSessions} جلسه`;
    }

    if (locale === "en") {
      return `${item.numberOfSessions} sessions`;
    }

    return `${item.numberOfSessions} Sitzungen`;
  }

  const activeIndex =
    classes.length > 0
      ? Math.min(
          active,
          classes.length - 1
        )
      : 0;

  const activeClass =
    classes.length > 0
      ? classes[activeIndex]
      : null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="font-medium text-gray-700 transition hover:text-blue-700"
      >
        {t("title")}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 15,
            }}
            className="absolute left-0 top-10 z-[9999] w-[850px] rounded-xl border border-gray-200 bg-white p-8 shadow-2xl"
            style={{
              backgroundColor: "#ffffff",
              backgroundImage: "none",
              opacity: 1,
              backdropFilter: "none",
              WebkitBackdropFilter: "none",
            }}
          >
            <div className="grid grid-cols-3 gap-8">

              {/* Courses */}
              <div>
                <h3 className="mb-4 font-bold text-blue-700">
                  {t("courses")}
                </h3>

                {loading ? (
                  <div className="py-2 text-gray-500">
                    {t("loading")}
                  </div>
                ) : classes.length === 0 ? (
                  <div className="py-2 text-gray-500">
                    {t("noClasses")}
                  </div>
                ) : (
                  classes.map((item, index) => (
                    <div
                      key={item.id}
                      onMouseEnter={() =>
                        setActive(index)
                      }
                      className="cursor-pointer py-2 text-gray-800 transition hover:text-blue-700"
                    >
                      {getTitle(item)}
                    </div>
                  ))
                )}
              </div>

              {/* Details */}
              <div
                className="col-span-2 rounded-xl bg-gray-50 p-6"
                style={{
                  backgroundColor: "#f9fafb",
                  backgroundImage: "none",
                }}
              >
                {activeClass ? (
                  <>
                    <h3 className="text-xl font-bold text-blue-700">
                      {getTitle(activeClass)}
                    </h3>

                    <ul className="mt-4 space-y-3 text-gray-800">

                      <li>
                        👨‍🏫{" "}
                        {t("teacher")}:{" "}
                        {getTeacher(
                          activeClass.teacher
                        )}
                      </li>

                      <li>
                        🕒{" "}
                        {t("time")}:{" "}
                        {getDay(activeClass)}{" "}
                        {activeClass.startTime || ""}{" "}
                        {activeClass.startTime &&
                        activeClass.endTime
                          ? "-"
                          : ""}{" "}
                        {activeClass.endTime || ""}
                      </li>

                      <li>
                        📅{" "}
                        {t("duration")}:{" "}
                        {getDuration(activeClass)}
                      </li>

                      <li>
                        📍{" "}
                        {t("format")}:{" "}
                        {getFormat(activeClass)}
                      </li>

                    </ul>

                    <Link
                      href={`/${locale}/courses`}
                      className="mt-5 block rounded-lg bg-blue-700 py-2 text-center text-white transition hover:bg-blue-800"
                    >
                      {t("more")}
                    </Link>
                  </>
                ) : (
                  <div className="text-gray-500">
                    {t("noClassToDisplay")}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}