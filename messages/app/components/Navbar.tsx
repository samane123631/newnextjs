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

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:flex items-center gap-8">
        <Link
          href="/"
          className="font-medium text-gray-700 transition hover:text-blue-700"
        >
          {t("home")}
        </Link>

        <MegaMenu />

        <Link
          href="/pruefungen"
          className="font-medium text-gray-700 transition hover:text-blue-700"
        >
          {t("exams")}
        </Link>

        <Link
          href="/ueber-uns"
          className="font-medium text-gray-700 transition hover:text-blue-700"
        >
          {t("about")}
        </Link>

        <Link
          href="/blog"
          className="font-medium text-gray-700 transition hover:text-blue-700"
        >
          {t("blog")}
        </Link>

        <Link
          href="/kontakt"
          className="font-medium text-gray-700 transition hover:text-blue-700"
        >
          {t("contact")}
        </Link>

        <Link href={`/${locale}/anmeldung`}>
          {t("register")}
        </Link>
      </nav>

      {/* Mobile Navbar */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={toggleMenu}
          onTouchEnd={(event) => {
            event.preventDefault();
            toggleMenu();
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-xl text-gray-700"
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          ☰
        </button>

        {isOpen && (
          <div className="absolute left-4 right-4 top-20 z-50 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex flex-col gap-4">

              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700"
              >
                {t("home")}
              </Link>

              {/* Kurse */}
              <div>
                <button
                  type="button"
                  onClick={toggleCourses}
                  onTouchEnd={(event) => {
                    event.preventDefault();
                    toggleCourses();
                  }}
                  className="flex w-full items-center justify-between font-medium text-gray-700"
                >
                  <span>Kurse</span>
                  <span>{coursesOpen ? "−" : "+"}</span>
                </button>

                {coursesOpen && (
                  <div className="mt-3 flex flex-col gap-3 border-l-2 border-blue-200 pl-4">
                    {courses.map((course) => (
                      <Link
                        key={course}
                        href="#"
                        onClick={() => setIsOpen(false)}
                        className="text-sm text-gray-600 hover:text-blue-700"
                      >
                        {course}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/pruefungen"
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700"
              >
                {t("exams")}
              </Link>

              <Link
                href="/ueber-uns"
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700"
              >
                {t("about")}
              </Link>

              <Link
                href="/blog"
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700"
              >
                {t("blog")}
              </Link>

              <Link
                href="/kontakt"
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700"
              >
                {t("contact")}
              </Link>

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