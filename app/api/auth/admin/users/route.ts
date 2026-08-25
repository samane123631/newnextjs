import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "../../../../../lib/prisma";

function isAdmin(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";

  const match = cookieHeader.match(
    /(?:^|;\s*)admin_session=([^;]+)/
  );

  return match?.[1] === "authenticated";
}

// GET - دریافت کاربران
export async function GET(request: Request) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "دسترسی غیرمجاز.",
        },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        level: true,
        phone: true,
        phoneVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در دریافت کاربران رخ داد.",
      },
      { status: 500 }
    );
  }
}

// POST - اضافه کردن کاربر
export async function POST(request: Request) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "دسترسی غیرمجاز.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const birthDate = body.birthDate;
    const level = body.level?.trim();
    const phone = body.phone?.trim() || null;
    const role = body.role === "ADMIN" ? "ADMIN" : "USER";

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
          message: "لطفاً تمام فیلدهای الزامی را پر کنید.",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "این ایمیل قبلاً ثبت شده است.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        birthDate: new Date(birthDate),
        level,
        phone,
        role,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        level: true,
        phone: true,
        phoneVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "کاربر با موفقیت اضافه شد.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در ایجاد کاربر رخ داد.",
      },
      { status: 500 }
    );
  }
}

// PUT - ویرایش کاربر
export async function PUT(request: Request) {
  try {
    if (!isAdmin(request)) {
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
          message: "شناسه کاربر نامعتبر است.",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر پیدا نشد.",
        },
        { status: 404 }
      );
    }

    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "ایمیل الزامی است.",
        },
        { status: 400 }
      );
    }

    const duplicateEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id,
        },
      },
    });

    if (duplicateEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "این ایمیل قبلاً استفاده شده است.",
        },
        { status: 409 }
      );
    }

    const data: {
      firstName: string;
      lastName: string;
      email: string;
      birthDate: Date;
      level: string;
      phone: string | null;
      role: string;
      phoneVerified: boolean;
      password?: string;
    } = {
      firstName: body.firstName?.trim(),
      lastName: body.lastName?.trim(),
      email,
      birthDate: new Date(body.birthDate),
      level: body.level?.trim(),
      phone: body.phone?.trim() || null,
      role: body.role === "ADMIN" ? "ADMIN" : "USER",
      phoneVerified: Boolean(body.phoneVerified),
    };

    if (
      !data.firstName ||
      !data.lastName ||
      !data.level ||
      !body.birthDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "فیلدهای ضروری را کامل کنید.",
        },
        { status: 400 }
      );
    }

    // اگر Password وارد شده باشد، آن را تغییر می‌دهیم.
    if (body.password?.trim()) {
      data.password = await bcrypt.hash(
        body.password.trim(),
        10
      );
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        level: true,
        phone: true,
        phoneVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "کاربر با موفقیت ویرایش شد.",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در ویرایش کاربر رخ داد.",
      },
      { status: 500 }
    );
  }
}

// DELETE - حذف کاربر
export async function DELETE(request: Request) {
  try {
    if (!isAdmin(request)) {
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
          message: "شناسه کاربر نامعتبر است.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
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

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "کاربر با موفقیت حذف شد.",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در حذف کاربر رخ داد.",
      },
      { status: 500 }
    );
  }
}