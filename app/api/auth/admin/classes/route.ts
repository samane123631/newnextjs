import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_ALLOWED_STUDENTS = 7;

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      classes,
    });
  } catch (error) {
    console.error("ADMIN CLASSES GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت کلاس‌ها.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      titleFa,
      titleDe,
      titleEn,
      descriptionFa,
      descriptionDe,
      descriptionEn,
      day,
      startTime,
      endTime,
      format,
      startDate,
      endDate,
      maxStudents,
      price,
      currency,
    } = body;

    if (
      !titleFa ||
      !titleDe ||
      !titleEn ||
      !day ||
      !startTime ||
      !endTime
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "اطلاعات اصلی کلاس کامل نیست.",
        },
        { status: 400 }
      );
    }

    const capacity =
      maxStudents === undefined ||
      maxStudents === null ||
      maxStudents === ""
        ? 7
        : Number(maxStudents);

    if (
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      capacity > MAX_ALLOWED_STUDENTS
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "ظرفیت کلاس باید بین 1 تا 7 نفر باشد.",
        },
        { status: 400 }
      );
    }

    const classPrice =
      price === undefined ||
      price === null ||
      price === ""
        ? null
        : Number(price);

    if (
      classPrice !== null &&
      (!Number.isFinite(classPrice) || classPrice < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "مبلغ کلاس معتبر نیست.",
        },
        { status: 400 }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        titleFa: String(titleFa).trim(),
        titleDe: String(titleDe).trim(),
        titleEn: String(titleEn).trim(),

        descriptionFa:
          descriptionFa &&
          String(descriptionFa).trim()
            ? String(descriptionFa).trim()
            : null,

        descriptionDe:
          descriptionDe &&
          String(descriptionDe).trim()
            ? String(descriptionDe).trim()
            : null,

        descriptionEn:
          descriptionEn &&
          String(descriptionEn).trim()
            ? String(descriptionEn).trim()
            : null,

        day: String(day),
        startTime: String(startTime),
        endTime: String(endTime),

        format:
          format && String(format).trim()
            ? String(format).trim()
            : null,

        startDate: startDate
          ? new Date(startDate)
          : null,

        endDate: endDate
          ? new Date(endDate)
          : null,

        maxStudents: capacity,

        price: classPrice,

        currency:
          currency && String(currency).trim()
            ? String(currency).trim().toUpperCase()
            : "EUR",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "کلاس با موفقیت ایجاد شد.",
        class: newClass,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN CLASSES POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ایجاد کلاس.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      id,
      titleFa,
      titleDe,
      titleEn,
      descriptionFa,
      descriptionDe,
      descriptionEn,
      day,
      startTime,
      endTime,
      format,
      startDate,
      endDate,
      maxStudents,
      price,
      currency,
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کلاس ارسال نشده است.",
        },
        { status: 400 }
      );
    }

    if (
      !titleFa ||
      !titleDe ||
      !titleEn ||
      !day ||
      !startTime ||
      !endTime
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "اطلاعات اصلی کلاس کامل نیست.",
        },
        { status: 400 }
      );
    }

    const capacity =
      maxStudents === undefined ||
      maxStudents === null ||
      maxStudents === ""
        ? 7
        : Number(maxStudents);

    if (
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      capacity > MAX_ALLOWED_STUDENTS
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "ظرفیت کلاس باید بین 1 تا 7 نفر باشد.",
        },
        { status: 400 }
      );
    }

    const classPrice =
      price === undefined ||
      price === null ||
      price === ""
        ? null
        : Number(price);

    if (
      classPrice !== null &&
      (!Number.isFinite(classPrice) || classPrice < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "مبلغ کلاس معتبر نیست.",
        },
        { status: 400 }
      );
    }

    const updatedClass = await prisma.class.update({
      where: {
        id: Number(id),
      },

      data: {
        titleFa: String(titleFa).trim(),
        titleDe: String(titleDe).trim(),
        titleEn: String(titleEn).trim(),

        descriptionFa:
          descriptionFa &&
          String(descriptionFa).trim()
            ? String(descriptionFa).trim()
            : null,

        descriptionDe:
          descriptionDe &&
          String(descriptionDe).trim()
            ? String(descriptionDe).trim()
            : null,

        descriptionEn:
          descriptionEn &&
          String(descriptionEn).trim()
            ? String(descriptionEn).trim()
            : null,

        day: String(day),
        startTime: String(startTime),
        endTime: String(endTime),

        format:
          format && String(format).trim()
            ? String(format).trim()
            : null,

        startDate: startDate
          ? new Date(startDate)
          : null,

        endDate: endDate
          ? new Date(endDate)
          : null,

        maxStudents: capacity,

        price: classPrice,

        currency:
          currency && String(currency).trim()
            ? String(currency).trim().toUpperCase()
            : "EUR",
      },
    });

    return NextResponse.json({
      success: true,
      message: "کلاس با موفقیت ویرایش شد.",
      class: updatedClass,
    });
  } catch (error) {
    console.error("ADMIN CLASSES PUT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ویرایش کلاس.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کلاس ارسال نشده است.",
        },
        { status: 400 }
      );
    }

    await prisma.class.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "کلاس با موفقیت حذف شد.",
    });
  } catch (error) {
    console.error("ADMIN CLASSES DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف کلاس.",
      },
      { status: 500 }
    );
  }
}