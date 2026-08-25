import { prisma } from "../../../../lib/prisma";

type Locale = "de" | "en" | "fa";

type NewsPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function NewsPage({
  params,
}: NewsPageProps) {
  const { locale } = await params;

  const news = await prisma.news.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      titleFa: true,
      contentFa: true,
      titleDe: true,
      contentDe: true,
      titleEn: true,
      contentEn: true,
      createdAt: true,
    },
  });

  const translations = {
    de: {
      title: "Nachrichten",
      empty: "Keine Nachrichten verfügbar.",
      date: "Veröffentlicht am",
    },
    en: {
      title: "News",
      empty: "No news available.",
      date: "Published on",
    },
    fa: {
      title: "اخبار",
      empty: "خبری برای نمایش وجود ندارد.",
      date: "تاریخ انتشار",
    },
  };

  const t = translations[locale] || translations.de;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700 sm:text-4xl">
            {t.title}
          </h1>
        </div>

        {/* News List */}
        {news.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-md">
            <p className="text-gray-500">
              {t.empty}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item) => {
              let title = item.titleDe;
              let content = item.contentDe;

              if (locale === "en") {
                title = item.titleEn;
                content = item.contentEn;
              }

              if (locale === "fa") {
                title = item.titleFa;
                content = item.contentFa;
              }

              return (
                <article
                  key={item.id}
                  className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg sm:p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800">
                    {title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {t.date}{" "}
                    {new Date(item.createdAt).toLocaleDateString(
                      locale === "fa"
                        ? "fa-IR"
                        : locale === "de"
                          ? "de-DE"
                          : "en-US"
                    )}
                  </p>

                  <div className="mt-5 whitespace-pre-wrap leading-8 text-gray-700">
                    {content}
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}