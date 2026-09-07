import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await context.params;

    const evaluationId = Number(id);

    if (!Number.isInteger(evaluationId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid evaluation id",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const body = await request.json();

    const {
      grammar,
      speaking,
      writing,
      listening,
      lessonTopic,
      teacherNotes,
    } = body;

    if (
      typeof grammar !== "number" ||
      typeof speaking !== "number" ||
      typeof writing !== "number" ||
      typeof listening !== "number"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All skill scores must be numbers",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    if (
      grammar < 0 ||
      grammar > 1 ||
      speaking < 0 ||
      speaking > 1 ||
      writing < 0 ||
      writing > 1 ||
      listening < 0 ||
      listening > 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill scores must be between 0 and 1",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const existingEvaluation =
      await prisma.evaluation.findUnique({
        where: {
          id: evaluationId,
        },
      });

    if (!existingEvaluation) {
      return NextResponse.json(
        {
          success: false,
          message: "Evaluation not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        },
      );
    }

    const updatedEvaluation =
      await prisma.evaluation.update({
        where: {
          id: evaluationId,
        },
        data: {
          grammar,
          speaking,
          writing,
          listening,
          lessonTopic:
            typeof lessonTopic === "string"
              ? lessonTopic.trim() || null
              : null,
          teacherNotes:
            typeof teacherNotes === "string"
              ? teacherNotes.trim() || null
              : null,
        },
      });

    return NextResponse.json(
      {
        success: true,
        evaluation: updatedEvaluation,
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error(
      "UPDATE EVALUATION ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update evaluation",
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}