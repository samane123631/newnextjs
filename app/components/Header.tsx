"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import Navbar from "./Navbar";
import LanguageSwitcher from "./LanguageSwitcher";

type SearchItem = {
  id: string;
  keywords: string[];
  labels: {
    fa: string;
    de: string;
    en: string;
  };
  type: "page" | "mega";
  path?: string;
};

const searchItems: SearchItem[] = [
  {
    id: "courses",
    keywords: [
      "kur",
      "kurs",
      "kurse",
      "kursen",
      "course",
      "courses",
      "cours",
      "کورس",
      "کورس ها",
      "کلاس",
      "کلاس ها",
      "دوره",
      "دوره ها",
    ],
    labels: {
      fa: "کورس",
      de: "Kurse",
      en: "Courses",
    },
    type: "mega",
  },

  {
    id: "registration",
    keywords: [
      "anmeldung",
      "anmeld",
      "registrierung",
      "registration",
      "register",
      "reg",
      "ثبت",
      "ثبت نام",
      "ثبت‌نام",
      "نام نویسی",
      "نام‌نویسی",
    ],
    labels: {
      fa: "ثبت‌نام — Anmeldung",
      de: "Anmeldung",
      en: "Registration",
    },
    type: "page",
    path: "anmeldung",
  },

  {
    id: "contact",
    keywords: [
      "kontakt",
      "kont",
      "kon",
      "contact",
      "cont",
      "تماس",
      "تماس با ما",
      "ارتباط",
      "ارتباط با ما",
    ],
    labels: {
      fa: "تماس با ما — Kontakt",
      de: "Kontakt",
      en: "Contact",
    },
    type: "page",
    path: "contact",
  },

  {
    id: "news",
    keywords: [
      "news",
      "new",
      "neu",
      "nachrichten",
      "nach",
      "اخبار",
      "خبر",
      "اخب",
    ],
    labels: {
      fa: "اخبار — News",
      de: "Nachrichten",
      en: "News",
    },
    type: "page",
    path: "news",
  },

  {
    id: "login",
    keywords: [
      "login",
      "log",
      "einloggen",
      "ein",
      "signin",
      "sign",
      "ورود",
      "ورود به حساب",
    ],
    labels: {
      fa: "ورود — Login",
      de: "Login",
      en: "Login",
    },
    type: "page",
    path: "login",
  },

  {
    id: "profile",
    keywords: [
      "profile",
      "profil",
      "prof",
      "konto",
      "account",
      "پروفایل",
      "حساب",
      "حساب کاربری",
    ],
    labels: {
      fa: "پروفایل — Profile",
      de: "Profil",
      en: "Profile",
    },
    type: "page",
    path: "profile",
  },
];

export default function Header() {
  const t = useTranslations("Header");

  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const router = useRouter();
  const pathname = usePathname();

  function getLocale() {
    const firstPart = pathname.split("/")[1];

    if (
      firstPart === "fa" ||
      firstPart === "de" ||
      firstPart === "en"
    ) {
      return firstPart;
    }

    return "de";
  }

  function normalize(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/ي/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/\s+/g, " ");
  }

  function getSuggestions() {
    const query = normalize(search);

    if (!query) {
      return [];
    }

    return searchItems.filter((item) => {
      return item.keywords.some((keyword) =>
        normalize(keyword).includes(query)
      );
    });
  }

  function openSearchItem(item: SearchItem) {
    const locale = getLocale();

    setSearch("");
    setShowSuggestions(false);

    if (item.type === "mega") {
      window.dispatchEvent(
        new CustomEvent("open-courses-mega-menu")
      );

      return;
    }

    if (item.path) {
      router.push(`/${locale}/${item.path}`);
    }
  }

  function handleSearchKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key !== "Enter") {
      return;
    }

    alert("ENTER WORKS");

    const suggestions = getSuggestions();

    if (suggestions.length > 0) {
      openSearchItem(suggestions[0]);
    }
  }

  function openAdminLogin() {
    const locale = getLocale();

    router.push(`/${locale}/admin-login`);
  }

  const suggestions = getSuggestions();

  return (
    <header className="sticky top-0 z-50 bg-white/95">
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

        {/* Navigation + Search + Admin + Language */}
        <div className="relative z-50 flex w-full items-center justify-between gap-2 sm:w-auto sm:gap-6">

          {/* Navbar */}
          <Navbar />

          {/* Search */}
          <div className="relative">
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
                onChange={(event) => {
                  setSearch(event.target.value);
                  setShowSuggestions(
                    event.target.value.trim().length > 0
                  );
                }}
                onFocus={() => {
                  if (search.trim()) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={handleSearchKeyDown}
                className="
                  w-20
                  bg-transparent
                  text-xs
                  outline-none
                  sm:w-32
                  sm:text-sm
                "
              />

              {/* Search Button */}
              <button
                type="button"
                onClick={() => {
                  alert("SEARCH CLICKED");

                  const suggestions = getSuggestions();

                  alert(`RESULTS: ${suggestions.length}`);

                  if (suggestions.length > 0) {
                    openSearchItem(suggestions[0]);
                  }
                }}
                className="
                  shrink-0
                  text-blue-700
                  transition
                  hover:scale-110
                "
                aria-label="Search"
              >
                🔍
              </button>
            </div>

            {/* Suggestions */}
            {showSuggestions &&
              search.trim() &&
              suggestions.length > 0 && (
                <div
                  className="
                    absolute
                    left-0
                    top-full
                    z-[100]
                    mt-2
                    w-64
                    overflow-hidden
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    shadow-xl
                  "
                >
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        openSearchItem(item);
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-4
                        py-3
                        text-left
                        transition
                        hover:bg-blue-50
                        hover:text-blue-700
                      "
                    >
                      <span className="text-lg">
                        {item.type === "mega"
                          ? "📚"
                          : item.id === "contact"
                          ? "📞"
                          : item.id === "news"
                          ? "📰"
                          : item.id === "registration"
                          ? "📝"
                          : item.id === "login"
                          ? "🔐"
                          : "👤"}
                      </span>

                      <span className="font-medium">
                        {item.labels[getLocale()]}
                      </span>
                    </button>
                  ))}
                </div>
              )}

            {/* No result */}
            {showSuggestions &&
              search.trim() &&
              suggestions.length === 0 && (
                <div
                  className="
                    absolute
                    left-0
                    top-full
                    z-[100]
                    mt-2
                    w-64
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-gray-500
                    shadow-xl
                  "
                >
                  No results found
                </div>
              )}
          </div>

          {/* Admin */}
          <button
            type="button"
            onClick={openAdminLogin}
            className="
              shrink-0
              whitespace-nowrap
              rounded-lg
              bg-blue-700
              px-2.5
              py-1.5
              text-[11px]
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-blue-800
              sm:px-4
              sm:py-2
              sm:text-sm
            "
          >
            Admin
          </button>

          {/* Language */}
          <div className="relative z-50 shrink-0">
            <LanguageSwitcher />
          </div>

        </div>
      </div>
    </header>
  );
}