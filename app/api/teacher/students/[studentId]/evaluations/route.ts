import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      studentId: string;
    }>;
  },
) {
  try {
    const { studentId } = await context.params;

    const id = Number(studentId);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid studentId",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const evaluations = await prisma.evaluation.findMany({
      where: {
        studentId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        teacher: true,
        class: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        evaluations,
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error(
      "GET STUDENT EVALUATIONS ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load evaluations",
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}