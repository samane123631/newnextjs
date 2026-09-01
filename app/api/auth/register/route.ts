import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const password = body.password;
    const birthDate = body.birthDate;
    const level = body.level;

    // اعتبارسنجی
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
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
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "این ایمیل قبلاً ثبت‌نام کرده است.",
        },
        { status: 409 }
      );
    }

    // بررسی شماره موبایل تکراری
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone,
      },
    });

    if (existingPhone) {
      return NextResponse.json(
        {
          success: false,
          message: "این شماره موبایل قبلاً ثبت‌نام کرده است.",
        },
        { status: 409 }
      );
    }

    // Hash رمز عبور
    const hashedPassword = await bcrypt.hash(password, 12);

    // تولید کد ۶ رقمی
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // اعتبار کد: ۱۰ دقیقه
    const verificationExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // ایجاد کاربر
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        birthDate: new Date(birthDate),
        level,

        phoneVerified: false,
        verificationCode,
        verificationExpiresAt,
      },
    });

    // در Local برای تست در Terminal نمایش داده می‌شود
    console.log(
      `PHONE VERIFICATION CODE for ${phone}: ${verificationCode}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "ثبت‌نام با موفقیت انجام شد.",
        userId: user.id,

        // فعلاً برای تست
        verificationCode,
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