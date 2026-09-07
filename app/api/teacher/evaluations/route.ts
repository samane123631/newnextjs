import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      studentId,
      teacherId,
      classId,
      lessonTopic,
      teacherNotes,
      grammar,
      speaking,
      writing,
      listening,
    } = body;

    if (!studentId || !teacherId || !classId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "studentId, teacherId and classId are required",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const scores = {
      grammar: Number(grammar),
      speaking: Number(speaking),
      writing: Number(writing),
      listening: Number(listening),
    };

    const invalidScore = Object.values(scores).some(
      (score) =>
        !Number.isFinite(score) ||
        score < 0 ||
        score > 1,
    );

    if (invalidScore) {
      return NextResponse.json(
        {
          success: false,
          message: "Scores must be between 0 and 1",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const evaluation =
        await prisma.evaluation.create({
      data: {
        studentId: Number(studentId),
        teacherId: Number(teacherId),
        classId: Number(classId),

        lessonTopic:
            lessonTopic?.toString().trim() || null,

        teacherNotes:
            teacherNotes?.toString().trim() || null,

        grammar: scores.grammar,
        speaking: scores.speaking,
        writing: scores.writing,
        listening: scores.listening,
      },
    });

    return NextResponse.json(
      {
        success: true,
        evaluation,
      },
      {
        status: 201,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error(
      "CREATE EVALUATION ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create evaluation",
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}