"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/image/slide1.jpg.jpg",
    title: "slide1",
    link: "/anmeldung",
  },
  {
    image: "/image/slide2.jpg.jpg",
    title: "slide2",
    link: "courses",
  },
  {
    image: "/image/slide3..jpg.jpg",
    title: "slide3",
    link: null,
  },
  {
    image: "/image/slide4.jpg.jpg",
    title: "slide4",
    link: "/anmeldung",
  },
];

export default function HeroSlider() {
  const t = useTranslations("HeroSlider");
  const locale = useLocale();

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % slides.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  function previousSlide() {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + slides.length) % slides.length
    );
  }

  function nextSlide() {
    setCurrentSlide(
      (prev) => (prev + 1) % slides.length
    );
  }

  function handleSlideButton(path: string) {
    if (path === "courses") {
      window.dispatchEvent(
        new Event("open-courses-mega-menu")
      );
      return;
    }

    window.location.assign(`/${locale}${path}`);
  }

  return (
    <section
      className="
        relative
        flex
        w-full
        justify-center
        px-4
        pb-0
        pt-0
        sm:px-6
        sm:pb-0
      "
    >
      <div
        className="
          relative
          h-[165px]
          w-full
          max-w-5xl
          overflow-hidden
          rounded-xl
          bg-white/5
          shadow-[0_12px_35px_rgba(0,0,0,0.16)]
          sm:h-[205px]
          sm:rounded-2xl
          lg:h-[240px]
        "
      >
        {/* پس‌زمینه اصلی */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/image/a.jpg.jpg"
            alt=""
            fill
            sizes="100vw"
            className="
              object-cover
              object-center
            "
          />
        </div>

        {/* لایه شیشه‌ای */}
        <div
          className="
            absolute
            inset-0
            z-[1]
            bg-white/5
            backdrop-blur-[2px]
          "
        />

        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`
              absolute
              inset-0
              transition-opacity
              duration-700
              ${
                index === currentSlide
                  ? "z-10 opacity-100"
                  : "z-0 opacity-0"
              }
            `}
          >
            {/* تصویر اسلاید */}
            <Image
              src={slide.image}
              alt={t(`${slide.title}.title`)}
              fill
              priority={index === 0}
              sizes="
                (max-width: 640px) 100vw,
                (max-width: 1024px) 90vw,
                1024px
              "
              className="
                object-cover
                object-center
                opacity-50
              "
            />

            {/* لایه شیشه‌ای */}
            <div
              className="
                absolute
                inset-0
                bg-white/5
                backdrop-blur-[1px]
              "
            />

            {/* لایه مورب */}
            <div
              className="
                absolute
                inset-y-0
                left-0
                z-10
                w-[58%]
                bg-black/35
                [clip-path:polygon(0_0,78%_0,100%_100%,0_100%)]
              "
            />

            {/* سایه نرم */}
            <div
              className="
                absolute
                inset-0
                z-[5]
                bg-gradient-to-r
                from-black/15
                via-transparent
                to-transparent
              "
            />

            {/* متن */}
            <div
              className="
                absolute
                inset-0
                z-20
                flex
                items-center
                pl-16
                pr-7
                text-left
                text-white
                sm:pl-20
                sm:pr-10
                lg:pl-24
                lg:pr-14
              "
            >
              <div className="max-w-md">
                <h2
                  className="
                    mb-2
                    text-xl
                    font-bold
                    leading-tight
                    drop-shadow-lg
                    sm:text-2xl
                    lg:text-3xl
                  "
                >
                  {t(`${slide.title}.title`)}
                </h2>

                <p
                  className="
                    mb-4
                    text-xs
                    leading-5
                    text-white/95
                    drop-shadow-md
                    sm:text-sm
                    sm:leading-6
                    lg:text-base
                  "
                >
                  {t(`${slide.title}.description`)}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (slide.link) {
                      handleSlideButton(slide.link);
                    }
                  }}
                  className="
                    rounded-md
                    bg-white
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-gray-900
                    shadow-md
                    transition
                    hover:-translate-y-0.5
                    hover:bg-gray-100
                    sm:px-5
                    sm:py-2.5
                    sm:text-sm
                  "
                >
                  {t(`${slide.title}.button`)}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* فلش قبلی */}
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="
            absolute
            left-3
            top-1/2
            z-30
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-black/25
            text-2xl
            text-white
            backdrop-blur-sm
            transition
            hover:bg-black/50
            sm:h-10
            sm:w-10
          "
        >
          ‹
        </button>

        {/* فلش بعدی */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="
            absolute
            right-3
            top-1/2
            z-30
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-black/25
            text-2xl
            text-white
            backdrop-blur-sm
            transition
            hover:bg-black/50
            sm:h-10
            sm:w-10
          "
        >
          ›
        </button>

        {/* نقاط */}
        <div
          className="
            absolute
            bottom-3
            left-1/2
            z-30
            flex
            -translate-x-1/2
            gap-2
            rounded-full
            bg-black/20
            px-3
            py-1.5
            backdrop-blur-sm
          "
        >
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                rounded-full
                transition-all
                duration-300
                ${
                  index === currentSlide
                    ? "h-2 w-6 bg-white"
                    : "h-2 w-2 bg-white/50"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}