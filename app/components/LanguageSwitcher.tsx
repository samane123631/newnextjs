"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const locales = ["de", "en", "fa"];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const segments = pathname.split("/").filter(Boolean);

  const currentLang =
    segments.length > 0 && locales.includes(segments[0])
      ? segments[0]
      : "de";

  const changeLang = (newLocale: string) => {
    if (!locales.includes(newLocale)) {
      return;
    }

    const pathWithoutLocale =
      segments.length > 0 && locales.includes(segments[0])
        ? segments.slice(1)
        : segments;

    const newPath =
      pathWithoutLocale.length > 0
        ? `/${newLocale}/${pathWithoutLocale.join("/")}`
        : `/${newLocale}`;

    router.push(newPath);
    setOpen(false);
  };

  const toggleLanguage = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      {/* Language Button */}
      <button
        type="button"
        onClick={toggleLanguage}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          bg-blue-700
          text-sm
          font-bold
          text-white
          shadow-lg
          transition
          hover:scale-110
          hover:bg-blue-800
        "
        aria-label="Change language"
        aria-expanded={open}
      >
        {currentLang.toUpperCase()}
      </button>

      {/* Language Menu */}
      {open && (
        <div
          className="
            absolute
            right-0
            z-50
            mt-3
            w-32
            rounded-xl
            border
            bg-white
            p-2
            shadow-xl
          "
        >
          <button
            type="button"
            onClick={() => changeLang("de")}
            className="block w-full rounded-lg px-3 py-2 text-left hover:bg-blue-50"
          >
            🇩🇪 DE
          </button>

          <button
            type="button"
            onClick={() => changeLang("en")}
            className="block w-full rounded-lg px-3 py-2 text-left hover:bg-blue-50"
          >
            🇬🇧 EN
          </button>

          <button
            type="button"
            onClick={() => changeLang("fa")}
            className="block w-full rounded-lg px-3 py-2 text-left hover:bg-blue-50"
          >
            🇮🇷 FA
          </button>
        </div>
      )}
    </div>
  );
}