import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

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
    console.error("GET PUBLIC CLASSES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت کلاس‌ها.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}