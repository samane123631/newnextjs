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

export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        level: true,
        email: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });

    return NextResponse.json(
      {
        students,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Failed to fetch students:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch students",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}