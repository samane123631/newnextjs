"use client";

import Image from "next/image";
import { useState } from "react";

type NewsImageProps = {
  src: string;
  alt: string;
};

export default function NewsImage({
  src,
  alt,
}: NewsImageProps) {
  const [zoom, setZoom] = useState(false);

  if (!src || src.trim() === "") {
    return null;
  }

  return (
    <>
      <div className="relative mb-6 flex h-56 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:h-72">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          unoptimized
        />

        <button
          type="button"
          onClick={() => setZoom(true)}
          className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-2xl shadow-md transition hover:scale-105"
          aria-label="بزرگ کردن تصویر"
        >
          🔍
        </button>
      </div>

      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setZoom(false)}
        >
          <div
            className="relative flex max-h-[90vh] max-w-[95vw] items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1200}
              className="max-h-[85vh] w-auto max-w-[90vw] object-contain"
              unoptimized
            />

            <button
              type="button"
              onClick={() => setZoom(false)}
              className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl shadow-lg"
              aria-label="بستن"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}