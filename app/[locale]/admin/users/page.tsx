"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  level: string;
  phone: string | null;
  phoneVerified: boolean;
  role: string;
  createdAt: string;
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  level: string;
  phone: string;
  role: string;
  phoneVerified: boolean;
};

const emptyForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  birthDate: "",
  level: "",
  phone: "",
  role: "USER",
  phoneVerified: false,
};

export default function AdminUsersPage() {
  const router = useRouter();
  const locale = useLocale();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  // =========================
  // دریافت کاربران
  // =========================

  async function loadUsers() {
    try {
      const response = await fetch("/api/auth/admin/users", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "خطا در دریافت کاربران"
        );
      }

      setUsers(data.users);
    } catch (error) {
      console.error("Load users error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "خطایی در دریافت کاربران رخ داد."
      );
    }
  }

  // =========================
  // بارگذاری اولیه کاربران
  // =========================

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      try {
        const response = await fetch(
          "/api/auth/admin/users",
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
          alert(
            data.message ||
              "خطا در دریافت کاربران"
          );

          setLoading(false);
          return;
        }

        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Initial users load error:",
          error
        );

        alert(
          "خطایی در دریافت کاربران رخ داد."
        );

        setLoading(false);
      }
    }

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================
  // تغییر فرم
  // =========================

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? (
              e.target as HTMLInputElement
            ).checked
          : value,
    }));
  }

  // =========================
  // Add User
  // =========================

  function handleAdd() {
    setEditingUser(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  // =========================
  // Edit User
  // =========================

  function handleEdit(user: User) {
    setEditingUser(user);

    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      birthDate: user.birthDate
        ? new Date(user.birthDate)
            .toISOString()
            .split("T")[0]
        : "",
      level: user.level,
      phone: user.phone || "",
      role: user.role,
      phoneVerified: user.phoneVerified,
    });

    setShowForm(true);
  }

  // =========================
  // Save User
  // =========================

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setSaving(true);

      const method = editingUser
        ? "PUT"
        : "POST";

      const body = editingUser
        ? {
            ...form,
            id: editingUser.id,
          }
        : form;

      const response = await fetch(
        "/api/auth/admin/users",
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "خطا در ذخیره کاربر"
        );
        return;
      }

      alert(
        editingUser
          ? "کاربر با موفقیت ویرایش شد."
          : "کاربر با موفقیت اضافه شد."
      );

      setShowForm(false);
      setEditingUser(null);
      setForm(emptyForm);

      await loadUsers();
    } catch (error) {
      console.error(
        "Save user error:",
        error
      );

      alert(
        "خطایی در ذخیره کاربر رخ داد."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // Delete User
  // =========================

  async function handleDelete(user: User) {
    const confirmed = window.confirm(
      `آیا مطمئن هستید که می‌خواهید کاربر "${user.firstName} ${user.lastName}" را حذف کنید؟`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        "/api/auth/admin/users",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "خطا در حذف کاربر"
        );
        return;
      }

      alert(
        "کاربر با موفقیت حذف شد."
      );

      await loadUsers();
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      alert(
        "خطایی در حذف کاربر رخ داد."
      );
    }
  }

  // =========================
  // صفحه
  // =========================

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Users
            </h1>

            <p className="mt-2 text-gray-600">
              Manage website users
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            {/* Add User */}

            <button
              type="button"
              onClick={handleAdd}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >
              + Add User
            </button>

            {/* Dashboard */}

            <button
              type="button"
              onClick={() =>
                router.push(`/${locale}/admin`)
              }
              className="rounded-lg bg-gray-700 px-5 py-2.5 font-semibold text-white transition hover:bg-gray-800"
            >
              ← Dashboard
            </button>

          </div>
        </div>

        {/* Add / Edit Form */}

        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-md">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-bold text-gray-800">
                {editingUser
                  ? "Edit User"
                  : "Add New User"}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                  setForm(emptyForm);
                }}
                className="text-3xl text-gray-500 transition hover:text-red-600"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 sm:grid-cols-2"
            >

              {/* First Name */}

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  First Name
                </label>

                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Last Name */}

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Last Name
                </label>

                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Password */}

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Password

                  {editingUser && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      (leave empty to keep current)
                    </span>
                  )}
                </label>

                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required={!editingUser}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Birth Date */}

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Birth Date
                </label>

                <input
                  name="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Level */}

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Level
                </label>

                <input
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  placeholder="A1 / A2 / B1..."
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Phone
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Role */}

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="USER">
                    USER
                  </option>

                  <option value="ADMIN">
                    ADMIN
                  </option>
                </select>
              </div>

              {/* Phone Verified */}

              <div className="flex items-center gap-3 sm:col-span-2">

                <input
                  id="phoneVerified"
                  name="phoneVerified"
                  type="checkbox"
                  checked={form.phoneVerified}
                  onChange={handleChange}
                  className="h-5 w-5"
                />

                <label
                  htmlFor="phoneVerified"
                  className="font-medium text-gray-700"
                >
                  Phone verified
                </label>

              </div>

              {/* Buttons */}

              <div className="flex flex-wrap gap-3 sm:col-span-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingUser
                    ? "Save Changes"
                    : "Add User"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                    setForm(emptyForm);
                  }}
                  className="rounded-lg bg-gray-300 px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-400"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* Loading */}

        {loading ? (

          <div className="rounded-xl bg-white p-10 text-center shadow-md">
            <p className="text-gray-600">
              Loading users...
            </p>
          </div>

        ) : (

          /* Users Table */

          <div className="overflow-x-auto rounded-xl bg-white shadow-md">

            <table className="min-w-[1200px] w-full text-left">

              <thead className="bg-gray-100">

                <tr>

                  <th className="px-4 py-4">
                    ID
                  </th>

                  <th className="px-4 py-4">
                    Name
                  </th>

                  <th className="px-4 py-4">
                    Email
                  </th>

                  <th className="px-4 py-4">
                    Phone
                  </th>

                  <th className="px-4 py-4">
                    Level
                  </th>

                  <th className="px-4 py-4">
                    Role
                  </th>

                  <th className="px-4 py-4">
                    Verified
                  </th>

                  <th className="px-4 py-4">
                    Created
                  </th>

                  <th className="px-4 py-4">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {users.length === 0 ? (

                  <tr>

                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      No users found.
                    </td>

                  </tr>

                ) : (

                  users.map((user) => (

                    <tr
                      key={user.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-4 py-4">
                        {user.id}
                      </td>

                      <td className="px-4 py-4 font-medium">
                        {user.firstName}{" "}
                        {user.lastName}
                      </td>

                      <td className="px-4 py-4">
                        {user.email}
                      </td>

                      <td className="px-4 py-4">
                        {user.phone || "-"}
                      </td>

                      <td className="px-4 py-4">
                        {user.level}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={
                            user.role === "ADMIN"
                              ? "font-bold text-red-600"
                              : "text-gray-700"
                          }
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {user.phoneVerified
                          ? "✓"
                          : "—"}
                      </td>

                      <td className="px-4 py-4">
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(user)
                            }
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(user)
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
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
        )}

      </div>
    </main>
  );
}