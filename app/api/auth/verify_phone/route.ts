import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const userId = Number(body.userId);
    const verificationCode = body.verificationCode?.trim();

    // بررسی ورودی‌ها
    if (!userId || !verificationCode) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کاربر و کد تأیید الزامی هستند.",
        },
        { status: 400 }
      );
    }

    // کد باید دقیقاً ۶ رقم باشد
    if (!/^\d{6}$/.test(verificationCode)) {
      return NextResponse.json(
        {
          success: false,
          message: "کد تأیید باید ۶ رقمی باشد.",
        },
        { status: 400 }
      );
    }

    // پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر پیدا نشد.",
        },
        { status: 404 }
      );
    }

    // اگر قبلاً تأیید شده باشد
    if (user.phoneVerified) {
      return NextResponse.json(
        {
          success: true,
          message: "شماره موبایل قبلاً تأیید شده است.",
        },
        { status: 200 }
      );
    }

    // بررسی وجود کد و تاریخ انقضا
    if (!user.verificationCode || !user.verificationExpiresAt) {
      return NextResponse.json(
        {
          success: false,
          message: "کد تأیید وجود ندارد یا منقضی شده است.",
        },
        { status: 400 }
      );
    }

    // بررسی انقضای کد
    if (new Date() > user.verificationExpiresAt) {
      return NextResponse.json(
        {
          success: false,
          message: "کد تأیید منقضی شده است.",
        },
        { status: 400 }
      );
    }

    // بررسی درست بودن کد
    if (user.verificationCode !== verificationCode) {
      return NextResponse.json(
        {
          success: false,
          message: "کد تأیید اشتباه است.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // 1. تأیید شماره موبایل
    // 2. حذف کد تأیید
    // =====================================================

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        phoneVerified: true,
        verificationCode: null,
        verificationExpiresAt: null,
      },
    });

    // =====================================================
    // Session جدید برای همین کاربر بساز
    // =====================================================

    const sessionId = crypto.randomUUID();

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

    // =====================================================
    // پاسخ
    // =====================================================

    const response = NextResponse.json(
      {
        success: true,
        message: "شماره موبایل با موفقیت تأیید شد.",
      },
      { status: 200 }
    );

    // =====================================================
    // Session جدید را در Cookie ذخیره کن
    // =====================================================

    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify phone error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در تأیید شماره موبایل رخ داد.",
      },
      { status: 500 }
    );
  }
}