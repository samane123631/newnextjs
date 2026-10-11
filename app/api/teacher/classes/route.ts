import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function normalizeTeacherName(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^(herr|frau|mrs|mr|ms)\.?\s+/i, "")
    .replace(/\s+/g, " ");
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = Number(searchParams.get("teacherId"));

    if (!Number.isInteger(teacherId) || teacherId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid teacher ID.",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
      select: {
        firstName: true,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher not found.",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    const allClasses = await prisma.class.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const teacherName = normalizeTeacherName(teacher.firstName);

    const classes = allClasses.filter((classItem) => {
      const teacherFields = [
        classItem.teacher,
        classItem.description,
        classItem.descriptionFa,
        classItem.descriptionDe,
        classItem.descriptionEn,
      ];

      return teacherFields.some((value) => {
        if (typeof value !== "string") {
          return false;
        }

        const normalizedValue = normalizeTeacherName(value);

        return (
          normalizedValue === teacherName ||
          normalizedValue.includes(teacherName)
        );
      });
    });

    return NextResponse.json(
      {
        success: true,
        classes,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("GET TEACHER CLASSES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load teacher classes.",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}