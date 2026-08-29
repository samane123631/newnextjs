"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

type ClassItem = {
  id: number;

  titleFa: string | null;
  titleDe: string | null;
  titleEn: string | null;

  descriptionFa: string | null;
  descriptionDe: string | null;
  descriptionEn: string | null;

  day: string | null;
  startTime: string | null;
  endTime: string | null;
  format: string | null;

  startDate: string | null;
  endDate: string | null;

  maxStudents: number;

  price: number | null;
  currency: string | null;
};

type FormData = {
  titleFa: string;
  titleDe: string;
  titleEn: string;

  descriptionFa: string;
  descriptionDe: string;
  descriptionEn: string;

  day: string[];
  startTime: string;
  endTime: string;
  format: string;

  startDate: string;
  endDate: string;

  maxStudents: number;

  price: string;
  currency: string;
};

const emptyForm: FormData = {
  titleFa: "",
  titleDe: "",
  titleEn: "",

  descriptionFa: "",
  descriptionDe: "",
  descriptionEn: "",

  day: [],
  startTime: "",
  endTime: "",
  format: "",

  startDate: "",
  endDate: "",

  maxStudents: 7,

  price: "",
  currency: "EUR",
};

const days = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

export default function AdminClassesPage() {
  const router = useRouter();
  const locale = useLocale();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<FormData>(emptyForm);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialClasses() {
      try {
        const response = await fetch(
          "/api/auth/admin/classes",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "خطا در دریافت کلاس‌ها."
          );
        }

        setClasses(
          Array.isArray(data.classes)
            ? data.classes
            : []
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "LOAD CLASSES ERROR:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "خطا در دریافت کلاس‌ها."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitialClasses();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadClasses() {
    try {
      const response = await fetch(
        "/api/auth/admin/classes",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "خطا در دریافت کلاس‌ها."
        );
      }

      setClasses(
        Array.isArray(data.classes)
          ? data.classes
          : []
      );
    } catch (error) {
      console.error(
        "LOAD CLASSES ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "خطا در دریافت کلاس‌ها."
      );
    }
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value ?? "",
    }));
  }

  function handleDayChange(day: string) {
    setForm((previous) => {
      const alreadySelected =
        previous.day.includes(day);

      if (alreadySelected) {
        return {
          ...previous,
          day: previous.day.filter(
            (item) => item !== day
          ),
        };
      }

      return {
        ...previous,
        day: [...previous.day, day],
      };
    });
  }

  function handleAdd() {
    setEditingId(null);

    setForm({
      ...emptyForm,
      maxStudents: 7,
      price: "",
      currency: "EUR",
    });

    setShowForm(true);
  }

  function handleEdit(item: ClassItem) {
    setEditingId(item.id);

    const selectedDays = item.day
      ? item.day
          .split(",")
          .map((day) => day.trim())
          .filter(Boolean)
      : [];

    setForm({
      titleFa: item.titleFa ?? "",
      titleDe: item.titleDe ?? "",
      titleEn: item.titleEn ?? "",

      descriptionFa:
        item.descriptionFa ?? "",

      descriptionDe:
        item.descriptionDe ?? "",

      descriptionEn:
        item.descriptionEn ?? "",

      day: selectedDays,

      startTime:
        item.startTime ?? "",

      endTime:
        item.endTime ?? "",

      format:
        item.format ?? "",

      startDate: item.startDate
        ? String(item.startDate).substring(
            0,
            10
          )
        : "",

      endDate: item.endDate
        ? String(item.endDate).substring(
            0,
            10
          )
        : "",

      maxStudents:
        typeof item.maxStudents === "number"
          ? item.maxStudents
          : 7,

      price:
        item.price !== null &&
        item.price !== undefined
          ? String(item.price)
          : "",

      currency:
        item.currency ?? "EUR",
    });

    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);

    setForm({
      ...emptyForm,
      maxStudents: 7,
      price: "",
      currency: "EUR",
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !form.titleFa.trim() ||
      !form.titleDe.trim() ||
      !form.titleEn.trim() ||
      form.day.length === 0 ||
      !form.startTime ||
      !form.endTime
    ) {
      alert(
        "لطفاً عنوان کلاس را در هر سه زبان، حداقل یک روز و اطلاعات زمان‌بندی را کامل وارد کنید."
      );
      return;
    }

    if (
      !Number.isInteger(form.maxStudents) ||
      form.maxStudents < 1 ||
      form.maxStudents > 7
    ) {
      alert(
        "ظرفیت کلاس باید بین 1 تا 7 نفر باشد."
      );
      return;
    }

    const parsedPrice =
      form.price.trim() === ""
        ? null
        : Number(form.price);

    if (
      parsedPrice !== null &&
      (!Number.isFinite(parsedPrice) ||
        parsedPrice < 0)
    ) {
      alert("مبلغ کلاس معتبر نیست.");
      return;
    }

    try {
      setSaving(true);

      const method =
        editingId === null
          ? "POST"
          : "PUT";

      const body = {
        ...(editingId !== null
          ? { id: editingId }
          : {}),

        titleFa:
          form.titleFa.trim(),

        titleDe:
          form.titleDe.trim(),

        titleEn:
          form.titleEn.trim(),

        descriptionFa:
          form.descriptionFa.trim() ||
          null,

        descriptionDe:
          form.descriptionDe.trim() ||
          null,

        descriptionEn:
          form.descriptionEn.trim() ||
          null,

        day:
          form.day.join(", "),

        startTime:
          form.startTime,

        endTime:
          form.endTime,

        format:
          form.format || null,

        startDate:
          form.startDate || null,

        endDate:
          form.endDate || null,

        maxStudents:
          form.maxStudents,

        price:
          parsedPrice,

        currency:
          form.currency.trim().toUpperCase(),
      };

      const response = await fetch(
        "/api/auth/admin/classes",
        {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify(body),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "خطا در ذخیره کلاس."
        );
      }

      alert(
        editingId === null
          ? "کلاس با موفقیت اضافه شد."
          : "کلاس با موفقیت ویرایش شد."
      );

      handleCancel();

      await loadClasses();
    } catch (error) {
      console.error(
        "SAVE CLASS ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "خطا در ذخیره کلاس."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "آیا مطمئن هستید که می‌خواهید این کلاس را حذف کنید؟"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        "/api/auth/admin/classes",
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            id,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "خطا در حذف کلاس."
        );
      }

      alert(
        "کلاس با موفقیت حذف شد."
      );

      await loadClasses();
    } catch (error) {
      console.error(
        "DELETE CLASS ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "خطا در حذف کلاس."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Classes
            </h1>

            <p className="mt-2 text-gray-600">
              Manage courses and class schedules
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={handleAdd}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              + Add Class
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/${locale}/admin`
                )
              }
              className="rounded-lg bg-gray-700 px-5 py-2.5 font-semibold text-white hover:bg-gray-800"
            >
              ← Dashboard
            </button>

          </div>
        </div>

        {/* FORM */}

        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-md">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-bold text-gray-800">
                {editingId === null
                  ? "Add New Class"
                  : "Edit Class"}
              </h2>

              <button
                type="button"
                onClick={handleCancel}
                className="text-3xl text-gray-500 hover:text-red-600"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 sm:grid-cols-2"
            >

              {/* TITLE FA */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Class Name — فارسی
                </label>

                <input
                  type="text"
                  name="titleFa"
                  value={form.titleFa}
                  onChange={handleChange}
                  placeholder="آلمانی A1"
                  dir="rtl"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* TITLE DE */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Class Name — Deutsch
                </label>

                <input
                  type="text"
                  name="titleDe"
                  value={form.titleDe}
                  onChange={handleChange}
                  placeholder="Deutsch A1 Anfänger"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* TITLE EN */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Class Name — English
                </label>

                <input
                  type="text"
                  name="titleEn"
                  value={form.titleEn}
                  onChange={handleChange}
                  placeholder="German A1 Beginner"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* DESCRIPTION FA */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Teacher / Description — فارسی
                </label>

                <input
                  type="text"
                  name="descriptionFa"
                  value={form.descriptionFa}
                  onChange={handleChange}
                  placeholder="استاد آزادی"
                  dir="rtl"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* DESCRIPTION DE */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Teacher / Description — Deutsch
                </label>

                <input
                  type="text"
                  name="descriptionDe"
                  value={form.descriptionDe}
                  onChange={handleChange}
                  placeholder="Frau Azadi"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* DESCRIPTION EN */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Teacher / Description — English
                </label>

                <input
                  type="text"
                  name="descriptionEn"
                  value={form.descriptionEn}
                  onChange={handleChange}
                  placeholder="Ms. Azadi"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* DAYS */}

              <div className="sm:col-span-2">

                <label className="mb-3 block font-semibold text-gray-700">
                  Days
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                  {days.map((day) => {
                    const selected =
                      form.day.includes(
                        day.value
                      );

                    return (
                      <label
                        key={day.value}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 transition ${
                          selected
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >

                        <input
                          type="checkbox"
                          checked={
                            selected
                          }
                          onChange={() =>
                            handleDayChange(
                              day.value
                            )
                          }
                          className="h-4 w-4"
                        />

                        <span>
                          {day.label}
                        </span>

                      </label>
                    );
                  })}

                </div>

                {form.day.length > 0 && (
                  <p className="mt-3 text-sm text-gray-600">
                    Selected:{" "}
                    {form.day.join(", ")}
                  </p>
                )}

              </div>

              {/* FORMAT */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Format
                </label>

                <select
                  name="format"
                  value={form.format}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                >

                  <option value="">
                    Select format
                  </option>

                  <option value="Online">
                    Online
                  </option>

                  <option value="Präsenz">
                    Präsenz
                  </option>

                </select>
              </div>

              {/* MAX STUDENTS */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Maximum Students
                </label>

                <input
                  type="number"
                  name="maxStudents"
                  min={1}
                  max={7}
                  value={form.maxStudents}
                  onChange={(event) => {
                    const value =
                      Number(
                        event.target.value
                      );

                    setForm(
                      (previous) => ({
                        ...previous,
                        maxStudents:
                          value,
                      })
                    );
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />

                <p className="mt-2 text-sm text-gray-500">
                  Maximum allowed capacity: 7 students
                </p>
              </div>

              {/* PRICE */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="100"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* CURRENCY */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Currency
                </label>

                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="EUR">
                    EUR — Euro
                  </option>

                  <option value="USD">
                    USD — US Dollar
                  </option>

                  <option value="GBP">
                    GBP — British Pound
                  </option>

                  <option value="IRR">
                    IRR — Iranian Rial
                  </option>

                  <option value="AZN">
                    AZN — Azerbaijani Manat
                  </option>
                </select>
              </div>

              {/* START TIME */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Start Time
                </label>

                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* END TIME */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  End Time
                </label>

                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* START DATE */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* END DATE */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 sm:col-span-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId === null
                    ? "Add Class"
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg bg-gray-300 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-400"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* TABLE */}

        <div className="overflow-x-auto rounded-xl bg-white shadow-md">

          <table className="min-w-[1600px] w-full text-left">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-4 py-4">
                  ID
                </th>

                <th className="px-4 py-4">
                  فارسی
                </th>

                <th className="px-4 py-4">
                  Deutsch
                </th>

                <th className="px-4 py-4">
                  English
                </th>

                <th className="px-4 py-4">
                  Teacher
                </th>

                <th className="px-4 py-4">
                  Days
                </th>

                <th className="px-4 py-4">
                  Time
                </th>

                <th className="px-4 py-4">
                  Format
                </th>

                <th className="px-4 py-4">
                  Capacity
                </th>

                <th className="px-4 py-4">
                  Price
                </th>

                <th className="px-4 py-4">
                  Currency
                </th>

                <th className="px-4 py-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan={12}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Loading classes...
                  </td>

                </tr>

              ) : classes.length === 0 ? (

                <tr>

                  <td
                    colSpan={12}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No classes found.
                  </td>

                </tr>

              ) : (

                classes.map((item) => (

                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-4 py-4">
                      {item.id}
                    </td>

                    <td
                      dir="rtl"
                      className="px-4 py-4 font-semibold"
                    >
                      {item.titleFa ?? "-"}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {item.titleDe ?? "-"}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {item.titleEn ?? "-"}
                    </td>

                    <td className="px-4 py-4">
                      {item.descriptionDe ??
                        item.descriptionEn ??
                        item.descriptionFa ??
                        "-"}
                    </td>

                    <td className="px-4 py-4">
                      {item.day ?? "-"}
                    </td>

                    <td className="px-4 py-4">
                      {item.startTime ?? "-"}{" "}
                      -{" "}
                      {item.endTime ?? "-"}
                    </td>

                    <td className="px-4 py-4">
                      {item.format ?? "-"}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {item.maxStudents ?? 7}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {item.price !== null &&
                      item.price !== undefined
                        ? item.price
                        : "-"}
                    </td>

                    <td className="px-4 py-4">
                      {item.currency ?? "-"}
                    </td>

                    <td className="px-4 py-4">

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}