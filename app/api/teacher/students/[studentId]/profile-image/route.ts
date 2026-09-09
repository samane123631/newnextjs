import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> },
) {
  try {
    const { studentId } = await params;
    const id = Number(studentId);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid student ID",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const student = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile image is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    // File information
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    console.log("PROFILE FILE NAME:", file.name);
    console.log("PROFILE FILE TYPE:", file.type);
    console.log("PROFILE FILE SIZE:", file.size);

    // Determine extension
    let extension: string | null = null;

    if (
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileType === "image/jpeg"
    ) {
      extension = "jpg";
    } else if (
      fileName.endsWith(".png") ||
      fileType === "image/png"
    ) {
      extension = "png";
    } else if (
      fileName.endsWith(".webp") ||
      fileType === "image/webp"
    ) {
      extension = "webp";
    }

    if (!extension) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG and WebP images are allowed",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "Image must be smaller than 5MB",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const contentType =
      extension === "png"
        ? "image/png"
        : extension === "webp"
          ? "image/webp"
          : "image/jpeg";

    const filePath =
      `students/${id}/profile.${extension}`;

    const bytes = await file.arrayBuffer();

    const { error: uploadError } =
      await supabase.storage
        .from("student-profiles")
        .upload(filePath, bytes, {
          contentType,
          upsert: true,
        });

    if (uploadError) {
      console.error(
        "PROFILE IMAGE UPLOAD ERROR:",
        uploadError,
      );

      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload profile image",
        },
        {
          status: 500,
          headers: corsHeaders,
        },
      );
    }

    const { data: publicUrlData } =
      supabase.storage
        .from("student-profiles")
        .getPublicUrl(filePath);

    const profileImage =
      publicUrlData.publicUrl;

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        profileImage,
      },
    });

    return NextResponse.json(
      {
        success: true,
        profileImage,
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error(
      "PROFILE IMAGE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save profile image",
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}