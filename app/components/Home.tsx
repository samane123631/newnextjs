import { useTranslations, useLocale } from "next-intl";
import HeroSlider from "@/app/components/HeroSlider";

export default function Home() {
  const t = useTranslations("Home");
  const locale = useLocale();

  console.log("CURRENT LOCALE:", locale);

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/image/a.jpg.jpg')",
      }}
    >
      {/* Description */}
      <section
        className="
          flex
          min-h-[360px]
          w-full
          items-center
          justify-center
          px-4
          pt-32
          pb-10
        "
      >
        <div
          className="
            rounded-xl
            bg-black/40
            p-8
            text-center
            text-white
          "
        >
          <h1 className="mb-4 text-5xl font-bold">
            {t("title")}
          </h1>

          <p className="text-xl">
            {t("description")}
          </p>

          <h2>
            {t("title")}
          </h2>
        </div>
      </section>

      {/* Hero Slider */}
      <section
        className="
          -mt-[400px]
          flex
          w-full
          justify-center
          px-4
          pb-16
        "
      >
        <HeroSlider />
      </section>
    </main>
  );
}