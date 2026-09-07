import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");

    const sessionMatch = cookieHeader?.match(
      /(?:^|;\s*)session=([^;]+)/
    );

    const sessionId = sessionMatch?.[1];

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not logged in.",
        },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Session not found.",
        },
        { status: 401 }
      );
    }

    if (session.expiresAt < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Session has expired.",
        },
        { status: 401 }
      );
    }

    const evaluations = await prisma.evaluation.findMany({
      where: {
        studentId: session.userId,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        grammar: true,
        speaking: true,
        writing: true,
        listening: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      evaluations,
    });
  } catch (error) {
    console.error("Student evaluations error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load evaluations.",
      },
      { status: 500 }
    );
  }
}