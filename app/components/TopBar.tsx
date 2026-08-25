"use client";

import {useTranslations} from "next-intl";

export default function TopBar() {
  const t = useTranslations("TopBar");

  return (
    <div className="w-full overflow-hidden bg-black text-white h-10 flex items-center">
      <div className="animate-marquee whitespace-nowrap text-sm font-medium">

        {t("course")} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;

        {t("goethe")} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;

        {t("testdaf")} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;

        {t("online")} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;

        {t("register")}

      </div>
    </div>
  );
}