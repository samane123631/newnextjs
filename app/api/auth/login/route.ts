import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // اعتبارسنجی
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "ایمیل و رمز عبور الزامی است.",
        },
        { status: 400 }
      );
    }

    // پیدا کردن کاربر در PostgreSQL
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // کاربر پیدا نشد
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "ایمیل یافت نشد.",
        },
        { status: 404 }
      );
    }

    // بررسی رمز عبور
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    // رمز اشتباه
    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "رمز عبور اشتباه است.",
        },
        { status: 401 }
      );
    }

    // ساخت Session
    const sessionId = crypto.randomUUID();

    // Session به مدت 7 روز معتبر است
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        expiresAt,
      },
    });

    // ساخت پاسخ
    const response = NextResponse.json(
      {
        success: true,
        message: "ورود با موفقیت انجام شد.",
      },
      { status: 200 }
    );

    // ذخیره Session ID در Cookie امن
    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در ورود رخ داد.",
      },
      { status: 500 }
    );
  }
}