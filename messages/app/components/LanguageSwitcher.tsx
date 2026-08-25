"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const pathLang = pathname.split("/")[1];

  const currentLang = ["de", "en", "fa"].includes(pathLang)
    ? pathLang
    : "de";

  const changeLang = (newLocale: string) => {
    const segments = pathname.split("/");

    if (["de", "en", "fa"].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    router.push("/" + segments.slice(1).join("/"));
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
        onTouchEnd={(event) => {
          event.preventDefault();
          toggleLanguage();
        }}
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
            mt-3
            w-32
            rounded-xl
            border
            bg-white
            p-2
            shadow-xl
            z-50
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