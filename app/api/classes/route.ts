import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

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

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        classes,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("GET PUBLIC CLASSES ERROR:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : String(error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت کلاس‌ها.",
        error: errorMessage,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}