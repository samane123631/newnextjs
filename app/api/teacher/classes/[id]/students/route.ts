import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const classId = Number(id);

    if (Number.isNaN(classId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid class ID",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // پیدا کردن کلاس
    const selectedClass = await prisma.class.findUnique({
      where: {
        id: classId,
      },
      select: {
        titleFa: true,
        titleDe: true,
        titleEn: true,
        title: true,
      },
    });

    if (!selectedClass) {
      return NextResponse.json(
        {
          success: false,
          message: "Class not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    // سطح کلاس
    const classLevel =
      selectedClass.titleDe ||
      selectedClass.titleEn ||
      selectedClass.titleFa ||
      selectedClass.title;

    if (!classLevel) {
      return NextResponse.json(
        {
          success: true,
          students: [],
        },
        {
          headers: corsHeaders,
        }
      );
    }

    // Payment های مربوط به همین کلاس
    const payments = await prisma.payment.findMany({
      where: {
        classId: classId,
      },
      select: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            level: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        user: {
          firstName: "asc",
        },
      },
    });

    // فقط شاگردهایی که Level آنها با Level کلاس یکی است
    const students = payments
      .map((payment) => payment.user)
      .filter(
        (student) =>
          student.level?.trim().toUpperCase() ===
          classLevel.trim().toUpperCase()
      );

    return NextResponse.json(
      {
        success: true,
        classLevel,
        students,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("GET CLASS STUDENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load class students",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}