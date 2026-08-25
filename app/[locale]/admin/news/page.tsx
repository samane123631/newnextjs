"use client";

import { useEffect, useState } from "react";

type NewsItem = {
  id: number;
  titleFa: string;
  contentFa: string;
  titleDe: string;
  contentDe: string;
  titleEn: string;
  contentEn: string;
  published: boolean;
  createdAt: string;
};

type FormData = {
  titleFa: string;
  contentFa: string;
  titleDe: string;
  contentDe: string;
  titleEn: string;
  contentEn: string;
  published: boolean;
};

const emptyForm: FormData = {
  titleFa: "",
  contentFa: "",
  titleDe: "",
  contentDe: "",
  titleEn: "",
  contentEn: "",
  published: false,
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      try {
        const response = await fetch("/api/news", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "خطا در دریافت خبرها."
          );
        }

        if (!cancelled) {
          setNews(data.news || []);
          setLoading(false);
        }
      } catch (error) {
        console.error("LOAD NEWS ERROR:", error);

        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "خطا در دریافت خبرها."
          );

          setLoading(false);
        }
      }
    }

    void loadNews();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadNewsAfterAction() {
    try {
      const response = await fetch("/api/news", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "خطا در دریافت خبرها."
        );
      }

      setNews(data.news || []);
    } catch (error) {
      console.error("RELOAD NEWS ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "خطا در دریافت خبرها."
      );
    }
  }

  function handleChange(
    field: keyof FormData,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function startEdit(item: NewsItem) {
    setEditingId(item.id);

    setForm({
      titleFa: item.titleFa,
      contentFa: item.contentFa,
      titleDe: item.titleDe,
      contentDe: item.contentDe,
      titleEn: item.titleEn,
      contentEn: item.contentEn,
      published: item.published,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.titleFa.trim() ||
      !form.contentFa.trim() ||
      !form.titleDe.trim() ||
      !form.contentDe.trim() ||
      !form.titleEn.trim() ||
      !form.contentEn.trim()
    ) {
      setError(
        "لطفاً عنوان و متن هر سه زبان را کامل وارد کنید."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/news", {
        method: editingId === null ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: editingId,
          titleFa: form.titleFa.trim(),
          contentFa: form.contentFa.trim(),
          titleDe: form.titleDe.trim(),
          contentDe: form.contentDe.trim(),
          titleEn: form.titleEn.trim(),
          contentEn: form.contentEn.trim(),
          published: form.published,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "ذخیره خبر ناموفق بود."
        );
      }

      setSuccess(
        editingId === null
          ? "خبر با موفقیت اضافه شد."
          : "خبر با موفقیت ویرایش شد."
      );

      setEditingId(null);
      setForm(emptyForm);

      await loadNewsAfterAction();
    } catch (error) {
      console.error("SAVE NEWS ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "ذخیره خبر ناموفق بود."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteNews(id: number) {
    const confirmed = window.confirm(
      "آیا مطمئن هستید که می‌خواهید این خبر را حذف کنید؟"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch("/api/news", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "حذف خبر ناموفق بود."
        );
      }

      setSuccess("خبر با موفقیت حذف شد.");

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      await loadNewsAfterAction();
    } catch (error) {
      console.error("DELETE NEWS ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "حذف خبر ناموفق بود."
      );
    }
  }

  async function togglePublished(item: NewsItem) {
    try {
      setError("");
      setSuccess("");

      const response = await fetch("/api/news", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: item.id,
          titleFa: item.titleFa,
          contentFa: item.contentFa,
          titleDe: item.titleDe,
          contentDe: item.contentDe,
          titleEn: item.titleEn,
          contentEn: item.contentEn,
          published: !item.published,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "تغییر وضعیت انتشار ناموفق بود."
        );
      }

      setSuccess(
        item.published
          ? "خبر از حالت انتشار خارج شد."
          : "خبر منتشر شد."
      );

      await loadNewsAfterAction();
    } catch (error) {
      console.error(
        "TOGGLE NEWS PUBLISHED ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "تغییر وضعیت انتشار ناموفق بود."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            مدیریت اخبار
          </h1>

          <p className="mt-2 text-gray-600">
            افزودن، ویرایش، حذف و انتشار خبرها
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-green-600">
            {success}
          </div>
        )}

        {/* Form */}
        <section className="mb-10 rounded-2xl bg-white p-6 shadow-md sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            {editingId === null
              ? "افزودن خبر جدید"
              : "ویرایش خبر"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Persian */}
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="mb-5 text-xl font-bold text-gray-800">
                🇮🇷 فارسی
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    عنوان فارسی
                  </label>

                  <input
                    type="text"
                    value={form.titleFa}
                    onChange={(event) =>
                      handleChange(
                        "titleFa",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    متن فارسی
                  </label>

                  <textarea
                    rows={6}
                    value={form.contentFa}
                    onChange={(event) =>
                      handleChange(
                        "contentFa",
                        event.target.value
                      )
                    }
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>

            {/* German */}
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="mb-5 text-xl font-bold text-gray-800">
                🇩🇪 Deutsch
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Deutscher Titel
                  </label>

                  <input
                    type="text"
                    value={form.titleDe}
                    onChange={(event) =>
                      handleChange(
                        "titleDe",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Deutscher Text
                  </label>

                  <textarea
                    rows={6}
                    value={form.contentDe}
                    onChange={(event) =>
                      handleChange(
                        "contentDe",
                        event.target.value
                      )
                    }
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>

            {/* English */}
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="mb-5 text-xl font-bold text-gray-800">
                🇬🇧 English
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    English Title
                  </label>

                  <input
                    type="text"
                    value={form.titleEn}
                    onChange={(event) =>
                      handleChange(
                        "titleEn",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    English Text
                  </label>

                  <textarea
                    rows={6}
                    value={form.contentEn}
                    onChange={(event) =>
                      handleChange(
                        "contentEn",
                        event.target.value
                      )
                    }
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>

            {/* Published */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) =>
                  handleChange(
                    "published",
                    event.target.checked
                  )
                }
                className="h-5 w-5"
              />

              <span className="font-semibold text-gray-700">
                انتشار خبر
              </span>
            </label>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "در حال ذخیره..."
                  : editingId === null
                    ? "افزودن خبر"
                    : "ذخیره تغییرات"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white transition hover:bg-gray-600"
                >
                  انصراف
                </button>
              )}
            </div>
          </form>
        </section>

        {/* News List */}
        <section className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            خبرهای موجود
          </h2>

          {loading ? (
            <p className="text-gray-500">
              در حال دریافت خبرها...
            </p>
          ) : news.length === 0 ? (
            <p className="text-gray-500">
              هنوز خبری ثبت نشده است.
            </p>
          ) : (
            <div className="space-y-5">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-gray-800">
                        {item.titleFa}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-gray-600">
                        {item.contentFa}
                      </p>

                      <div className="mt-3">
                        {item.published ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                            منتشر شده
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
                            منتشر نشده
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                      >
                        ویرایش
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          togglePublished(item)
                        }
                        className={`rounded-lg px-4 py-2 font-semibold text-white transition ${
                          item.published
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {item.published
                          ? "عدم انتشار"
                          : "انتشار"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteNews(item.id)
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}