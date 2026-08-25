"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="mt-20 bg-slate-900 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-4">

        <div>
          <h2 className="mb-4 text-xl font-bold text-blue-400">
            {t("title")}
          </h2>

          <p className="text-sm leading-7 text-gray-300">
            {t("description")}
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold">
            {t("about")}
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li>{t("school")}</li>
            <li>{t("teachers")}</li>
            <li>{t("career")}</li>
            <li>{t("blog")}</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold">
            {t("courses")}
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li>{t("a1")}</li>
            <li>{t("b1")}</li>
            <li>{t("speaking")}</li>
            <li>{t("osd")}</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold">
            {t("contact")}
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Tehran%2C%20Ayat%20North%20Street%2C%20Iran"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-blue-400 hover:underline"
              >
                {t("address")}
              </a>
            </li>

            <li>{t("phone")}</li>

            <li>{t("email")}</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 py-5 text-center text-sm text-gray-400">
        {t("copyright")}
      </div>
    </footer>
  );
}