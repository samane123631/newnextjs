import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const birthDate = body.birthDate;
    const level = body.level;

    // اعتبارسنجی سمت سرور
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !birthDate ||
      !level
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "تمام فیلدها الزامی هستند.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
        },
        { status: 400 }
      );
    }

    // بررسی سطح زبان
    if (!["A1", "A2", "B1", "B2", "C1"].includes(level)) {
      return NextResponse.json(
        {
          success: false,
          message: "سطح زبان انتخاب‌شده معتبر نیست.",
        },
        { status: 400 }
      );
    }

    // بررسی ایمیل تکراری
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "این ایمیل قبلاً ثبت‌نام کرده است.",
        },
        { status: 409 }
      );
    }

    // Hash کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 12);

    // ایجاد کاربر در PostgreSQL
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        birthDate: new Date(birthDate),
        level,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "ثبت‌نام با موفقیت انجام شد.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در ثبت‌نام رخ داد.",
      },
      { status: 500 }
    );
  }
}