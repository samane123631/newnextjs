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

  day: string;
  startTime: string;
  endTime: string;
  format: string | null;

  startDate: string | null;
  endDate: string | null;

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

  function getDescription(item: ClassItem) {
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

  function getDay(item: ClassItem) {
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

    if (item.format === "Online") {
      if (locale === "fa") {
        return "آنلاین";
      }

      return "Online";
    }

    if (item.format === "Präsenz") {
      if (locale === "fa") {
        return "حضوری";
      }

      if (locale === "de") {
        return "Präsenz";
      }

      return "In-person";
    }

    return item.format;
  }

  function getDuration(item: ClassItem) {
    if (!item.startDate || !item.endDate) {
      return "-";
    }

    const start = new Date(item.startDate);
    const end = new Date(item.endDate);

    const difference =
      end.getTime() - start.getTime();

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

    if (locale === "en") {
      return `${weeks} weeks`;
    }

    return `${weeks} Wochen`;
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
        className="font-medium hover:text-blue-700"
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
            className="absolute left-0 top-10 z-50 w-[850px] rounded-xl bg-white p-8 shadow-2xl"
          >
            <div className="grid grid-cols-3 gap-8">

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
                      className="cursor-pointer py-2 hover:text-blue-700"
                    >
                      {getTitle(item)}
                    </div>
                  ))
                )}
              </div>

              <div className="col-span-2 rounded-xl bg-gray-50 p-6">

                {activeClass ? (
                  <>
                    <h3 className="text-xl font-bold text-blue-700">
                      {getTitle(activeClass)}
                    </h3>

                    <ul className="mt-4 space-y-3">

                      <li>
                        👨‍🏫{" "}
                        {t("teacher")}:{" "}
                        {getDescription(activeClass)}
                      </li>

                      <li>
                        🕒{" "}
                        {t("time")}:{" "}
                        {getDay(activeClass)}{" "}
                        {activeClass.startTime}{" "}
                        -{" "}
                        {activeClass.endTime}
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
                      className="mt-5 block rounded-lg bg-blue-700 py-2 text-center text-white"
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