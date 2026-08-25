import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");

    const sessionMatch = cookieHeader?.match(
      /(?:^|;\s*)session=([^;]+)/
    );

    const sessionId = sessionMatch?.[1];

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر وارد نشده است.",
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
          message: "نشست منقضی شده است.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        email: session.user.email,
        birthDate: session.user.birthDate,
        level: session.user.level,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در دریافت اطلاعات کاربر رخ داد.",
      },
      { status: 500 }
    );
  }
}