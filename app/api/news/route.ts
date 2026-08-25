import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../lib/prisma";

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

    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      news,
    });
  } catch (error) {
    console.error("GET NEWS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت خبرها.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const {
      titleFa,
      contentFa,
      titleDe,
      contentDe,
      titleEn,
      contentEn,
      published,
    } = body;

    if (
      !titleFa?.trim() ||
      !contentFa?.trim() ||
      !titleDe?.trim() ||
      !contentDe?.trim() ||
      !titleEn?.trim() ||
      !contentEn?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "عنوان و متن هر سه زبان الزامی است.",
        },
        { status: 400 }
      );
    }

    const news = await prisma.news.create({
      data: {
        titleFa: titleFa.trim(),
        contentFa: contentFa.trim(),
        titleDe: titleDe.trim(),
        contentDe: contentDe.trim(),
        titleEn: titleEn.trim(),
        contentEn: contentEn.trim(),
        published: Boolean(published),
      },
    });

    return NextResponse.json({
      success: true,
      news,
    });
  } catch (error) {
    console.error("CREATE NEWS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ایجاد خبر.",
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

    const {
      id,
      titleFa,
      contentFa,
      titleDe,
      contentDe,
      titleEn,
      contentEn,
      published,
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه خبر ارسال نشده است.",
        },
        { status: 400 }
      );
    }

    const news = await prisma.news.update({
      where: {
        id: Number(id),
      },
      data: {
        titleFa: titleFa.trim(),
        contentFa: contentFa.trim(),
        titleDe: titleDe.trim(),
        contentDe: contentDe.trim(),
        titleEn: titleEn.trim(),
        contentEn: contentEn.trim(),
        published: Boolean(published),
      },
    });

    return NextResponse.json({
      success: true,
      news,
    });
  } catch (error) {
    console.error("UPDATE NEWS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ویرایش خبر.",
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

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه خبر ارسال نشده است.",
        },
        { status: 400 }
      );
    }

    await prisma.news.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "خبر با موفقیت حذف شد.",
    });
  } catch (error) {
    console.error("DELETE NEWS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف خبر.",
      },
      { status: 500 }
    );
  }
}