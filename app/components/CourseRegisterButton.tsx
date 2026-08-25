"use client";

import { useRouter } from "next/navigation";

type Props = {
  locale: string;
  classId: number;
};

export default function CourseRegisterButton({
  locale,
  classId,
}: Props) {
  const router = useRouter();

  function handleRegister() {
    router.push(
      `/${locale}/courses/${classId}/register`
    );
  }

  return (
    <button
      type="button"
      onClick={handleRegister}
      className="mt-8 w-full rounded-lg bg-blue-700 py-3 text-white transition hover:bg-blue-800"
    >
      ثبت‌نام
    </button>
  );
}