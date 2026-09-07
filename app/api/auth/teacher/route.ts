import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const teacher = await prisma.teacher.findUnique({
      where: {
        email,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      teacher.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        teacher: {
          id: teacher.id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
        },
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("TEACHER LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Teacher login failed.",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}