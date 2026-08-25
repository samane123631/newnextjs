import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../../../lib/prisma";

async function checkAdmin() {
  const cookieStore = await cookies();

  const adminSession = cookieStore.get("admin_session")?.value;

  return adminSession === "authenticated";
}

export async function GET() {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "دسترسی غیرمجاز.",
        },
        { status: 403 }
      );
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("ADMIN CONTACT GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت پیام‌ها.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "دسترسی غیرمجاز.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه پیام نامعتبر است.",
        },
        { status: 400 }
      );
    }

    const updatedMessage =
      await prisma.contactMessage.update({
        where: {
          id,
        },
        data: {
          isRead: true,
        },
      });

    return NextResponse.json({
      success: true,
      message: updatedMessage,
    });
  } catch (error) {
    console.error("ADMIN CONTACT PUT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در تغییر وضعیت پیام.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "دسترسی غیرمجاز.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه پیام نامعتبر است.",
        },
        { status: 400 }
      );
    }

    await prisma.contactMessage.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "پیام با موفقیت حذف شد.",
    });
  } catch (error) {
    console.error("ADMIN CONTACT DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف پیام.",
      },
      { status: 500 }
    );
  }
}