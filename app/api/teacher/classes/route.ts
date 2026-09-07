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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const teacherId = Number(searchParams.get("teacherId"));

    if (Number.isNaN(teacherId)) {
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

    // Find the logged-in teacher
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

    // Get all classes
    const allClasses = await prisma.class.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // The teacher's name can be stored
    // in any of the description fields.
    const teacherName = teacher.firstName.trim().toLowerCase();

    const classes = allClasses.filter((classItem) => {
      const descriptions = [
        classItem.description,
        classItem.descriptionFa,
        classItem.descriptionDe,
        classItem.descriptionEn,
      ];

      return descriptions.some((description) =>
        description?.trim().toLowerCase().includes(teacherName)
      );
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