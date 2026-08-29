import { NextResponse } from "next/server";

import { prisma } from "../../../../../../lib/prisma";
import { supabaseAdmin } from "../../../../../../lib/supabaseAdmin";

function isAdmin(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";

  const match = cookieHeader.match(
    /(?:^|;\s*)admin_session=([^;]+)/
  );

  return match?.[1] === "authenticated";
}

export async function GET(request: Request) {
  try {
    // =========================
    // 1. بررسی Admin
    // =========================

    if (!isAdmin(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "دسترسی غیرمجاز.",
        },
        { status: 403 }
      );
    }

    // =========================
    // 2. دریافت userId
    // =========================

    const { searchParams } = new URL(request.url);

    const userIdValue = searchParams.get("userId");

    if (!userIdValue) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کاربر ارسال نشده است.",
        },
        { status: 400 }
      );
    }

    const userId = Number(userIdValue);

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کاربر نامعتبر است.",
        },
        { status: 400 }
      );
    }

    // =========================
    // 3. پیدا کردن آخرین Payment کاربر
    // =========================

    const payment = await prisma.payment.findFirst({
      where: {
        userId,
        receiptPath: {
          not: null,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!payment || !payment.receiptPath) {
      return NextResponse.json(
        {
          success: false,
          message: "فیش پرداختی برای این کاربر پیدا نشد.",
        },
        { status: 404 }
      );
    }

    // =========================
    // 4. ساخت Signed URL
    // =========================

    const { data, error } =
      await supabaseAdmin.storage
        .from("payment-receipts")
        .createSignedUrl(
          payment.receiptPath,
          60 * 10
        );

    if (error || !data?.signedUrl) {
      console.error(
        "Create receipt signed URL error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "امکان دریافت فیش وجود ندارد.",
        },
        { status: 500 }
      );
    }

    // =========================
    // 5. ارسال URL به Admin
    // =========================

    return NextResponse.json({
      success: true,
      receiptUrl: data.signedUrl,
      paymentId: payment.id,
      userId: payment.userId,
      classId: payment.classId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      createdAt: payment.createdAt,
    });
  } catch (error) {
    console.error(
      "Admin receipt API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در دریافت فیش پرداخت رخ داد.",
      },
      { status: 500 }
    );
  }
}