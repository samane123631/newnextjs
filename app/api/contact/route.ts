import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const message = body.message?.trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "نام وارد نشده است.",
        },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "پیام وارد نشده است.",
        },
        { status: 400 }
      );
    }

    const cookieHeader = request.headers.get("cookie");

    const sessionMatch = cookieHeader?.match(
      /(?:^|;\s*)session=([^;]+)/
    );

    const sessionId = sessionMatch?.[1];

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: "برای ارسال پیام ابتدا وارد حساب خود شوید.",
        },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "نشست کاربر پیدا نشد.",
        },
        { status: 401 }
      );
    }

    if (session.expiresAt < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "نشست شما منقضی شده است.",
        },
        { status: 401 }
      );
    }

    const contactMessage =
      await prisma.contactMessage.create({
        data: {
          name,
          email: session.user.email,
          message,
        },
      });

    return NextResponse.json(
      {
        success: true,
        message: "پیام با موفقیت ارسال شد.",
        contactMessage: {
          id: contactMessage.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CONTACT API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در ارسال پیام رخ داد.",
      },
      { status: 500 }
    );
  }
}