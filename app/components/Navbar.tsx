"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import MegaMenu from "./MegaMenu";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();

  const [isOpen, setIsOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);

  const courses = [
    "A1 Anfänger",
    "A2 Grundstufe",
    "B1 Mittelstufe",
    "B2 Oberstufe",
    "C1 Fortgeschritten",
  ];

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleCourses = () => {
    setCoursesOpen((prev) => !prev);
  };

  const newsLabel =
    locale === "fa"
      ? "اخبار"
      : locale === "en"
        ? "News"
        : "Nachrichten";

  const moreLabel =
    locale === "fa"
      ? "اطلاعات بیشتر"
      : locale === "en"
        ? "More information"
        : "Mehr Informationen";

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden items-center gap-5 lg:flex">
        <Link
          href={`/${locale}`}
          className="whitespace-nowrap font-medium text-gray-700 transition hover:text-blue-700"
        >
          {t("home")}
        </Link>

        <MegaMenu />

        <Link
          href={`/${locale}/pruefungen`}
          className="whitespace-nowrap font-medium text-gray-700 transition hover:text-blue-700"
        >
          {t("exams")}
        </Link>

        <Link
          href={`/${locale}/ueber-uns`}
          className="whitespace-nowrap font-medium text-gray-700 transition hover:text-blue-700"
        >
          {t("about")}
        </Link>

        <Link
          href={`/${locale}/blog`}
          className="whitespace-nowrap font-medium text-gray-700 transition hover:text-blue-700"
        >
          {t("blog")}
        </Link>

        {/* News */}
        <Link
          href={`/${locale}/news`}
          className="whitespace-nowrap font-medium text-gray-700 transition hover:text-blue-700"
        >
          {newsLabel}
        </Link>

        {/* Contact */}
        <Link
          href={`/${locale}/contact`}
          className="whitespace-nowrap font-medium text-gray-700 transition hover:text-blue-700"
        >
          {t("contact")}
        </Link>

        {/* Register */}
        <Link
          href={`/${locale}/anmeldung`}
          className="whitespace-nowrap font-medium text-gray-700 transition hover:text-blue-700"
        >
          {t("register")}
        </Link>
      </nav>

      {/* Mobile Navbar */}
      <div className="relative lg:hidden">
        <button
          type="button"
          onClick={toggleMenu}
          className="rounded-lg border border-gray-300 px-3 py-2 text-xl text-gray-700"
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          ☰
        </button>

        {isOpen && (
          <div className="absolute left-4 right-4 top-20 z-50 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex flex-col gap-4">

              {/* Home */}
              <Link
                href={`/${locale}`}
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700"
              >
                {t("home")}
              </Link>

              {/* Courses */}
              <div>
                <button
                  type="button"
                  onClick={toggleCourses}
                  className="flex w-full items-center justify-between font-medium text-gray-700"
                >
                  <span>
                    {locale === "fa"
                      ? "کلاس‌ها"
                      : locale === "en"
                        ? "Courses"
                        : "Kurse"}
                  </span>

                  <span>
                    {coursesOpen ? "−" : "+"}
                  </span>
                </button>

                {coursesOpen && (
                  <div className="mt-3 flex flex-col gap-3 border-l-2 border-blue-200 pl-4">

                    {courses.map((course) => (
                      <div
                        key={course}
                        className="text-sm text-gray-600"
                      >
                        {course}
                      </div>
                    ))}

                    {/* More Information */}
                    <Link
                      href={`/${locale}/courses`}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-blue-700 hover:text-blue-900"
                    >
                      {moreLabel}
                    </Link>

                  </div>
                )}
              </div>

              {/* Exams */}
              <Link
                href={`/${locale}/pruefungen`}
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700"
              >
                {t("exams")}
              </Link>

              {/* About */}
              <Link
                href={`/${locale}/ueber-uns`}
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700"
              >
                {t("about")}
              </Link>

              {/* Blog */}
              <Link
                href={`/${locale}/blog`}
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700"
              >
                {t("blog")}
              </Link>

              {/* News */}
              <Link
                href={`/${locale}/news`}
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700"
              >
                {newsLabel}
              </Link>

              {/* Contact */}
              <Link
                href={`/${locale}/contact`}
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700"
              >
                {t("contact")}
              </Link>

              {/* Register */}
              <Link
                href={`/${locale}/anmeldung`}
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700"
              >
                {t("register")}
              </Link>

            </div>
          </div>
        )}
      </div>
    </>
  );
}