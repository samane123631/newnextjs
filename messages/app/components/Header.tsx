"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import Navbar from "./Navbar";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("Header");

  const [search, setSearch] = useState("");

  return (
    <header className="relative z-50">
      <div className="relative z-50 mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-6 sm:py-0">

        {/* Logo */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg shadow-md sm:h-12 sm:w-12">
            <Image
              src="/image/logo.jpg"
              alt="Logo"
              width={48}
              height={48}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-blue-700 sm:text-xl">
              {t("title")}
            </h1>

            <p className="truncate text-[10px] text-gray-500 sm:text-xs">
              {t("subtitle")}
            </p>
          </div>

        </div>

        {/* Navigation + Search + Language */}
        <div className="relative z-50 flex w-full items-center justify-between gap-2 sm:w-auto sm:gap-6">

          <Navbar />

          {/* Search */}
          <div
            className="
              flex
              min-w-0
              items-center
              rounded-full
              border
              border-gray-300
              bg-white/80
              px-3
              py-1.5
              shadow-sm
              transition
              focus-within:ring-2
              focus-within:ring-blue-400
              sm:px-4
              sm:py-2
            "
          >
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-20
                bg-transparent
                text-xs
                outline-none
                sm:w-32
                sm:text-sm
              "
            />

            <button
              type="button"
              className="
                shrink-0
                text-blue-700
                transition
                hover:scale-110
              "
            >
              🔍
            </button>
          </div>

          {/* Language */}
          <div className="relative z-50 shrink-0">
            <LanguageSwitcher />
          </div>

        </div>

      </div>
    </header>
  );
}