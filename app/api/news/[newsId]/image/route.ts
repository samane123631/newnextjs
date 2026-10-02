import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../../../lib/prisma";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function checkAdmin() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session")?.value;

  return adminSession === "authenticated";
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ newsId: string }> },
) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "دسترسی غیرمجاز.",
        },
        { status: 403, headers: corsHeaders },
      );
    }

    const { newsId } = await params;
    const id = Number(newsId);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه خبر نامعتبر است.",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    const news = await prisma.news.findUnique({
      where: { id },
      select: {
        id: true,
        imageUrl: true,
      },
    });

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: "خبر پیدا نشد.",
        },
        { status: 404, headers: corsHeaders },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "تصویر خبر الزامی است.",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

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
          message:
            "فقط تصاویر JPG، PNG و WebP مجاز هستند.",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "حجم تصویر باید کمتر از 5MB باشد.",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    const contentType =
      extension === "png"
        ? "image/png"
        : extension === "webp"
          ? "image/webp"
          : "image/jpeg";

    const filePath = `news/${id}/image.${extension}`;

    const bytes = await file.arrayBuffer();

    /*
     * اگر قبلاً عکس دیگری با پسوند متفاوت وجود داشته باشد،
     * آن را حذف می‌کنیم تا فایل قدیمی در Storage باقی نماند.
     */
    if (news.imageUrl) {
      const marker = "/news-images/";

const imageUrl = String(news.imageUrl);
const markerIndex = imageUrl.indexOf(marker);
      if (markerIndex !== -1) {
       const oldFilePath = decodeURIComponent(
  imageUrl.substring(
    markerIndex + marker.length,
  ),
);

        if (oldFilePath !== filePath) {
          const { error: oldDeleteError } =
            await supabase.storage
              .from("news-images")
              .remove([oldFilePath]);

          if (oldDeleteError) {
            console.error(
              "OLD NEWS IMAGE DELETE ERROR:",
              oldDeleteError,
            );
          }
        }
      }
    }

    const { error: uploadError } =
      await supabase.storage
        .from("news-images")
        .upload(filePath, bytes, {
          contentType,
          upsert: true,
        });

    if (uploadError) {
      console.error(
        "NEWS IMAGE UPLOAD ERROR:",
        uploadError,
      );

      return NextResponse.json(
        {
          success: false,
          message: "آپلود تصویر خبر ناموفق بود.",
        },
        { status: 500, headers: corsHeaders },
      );
    }

    const { data: publicUrlData } =
      supabase.storage
        .from("news-images")
        .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    await prisma.news.update({
      where: { id },
      data: {
        imageUrl,
      },
    });

    return NextResponse.json(
      {
        success: true,
        imageUrl,
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("NEWS IMAGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ذخیره تصویر خبر.",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ newsId: string }> },
) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "دسترسی غیرمجاز.",
        },
        { status: 403, headers: corsHeaders },
      );
    }

    const { newsId } = await params;
    const id = Number(newsId);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه خبر نامعتبر است.",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    const news = await prisma.news.findUnique({
      where: { id },
      select: {
        id: true,
        imageUrl: true,
      },
    });

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: "خبر پیدا نشد.",
        },
        { status: 404, headers: corsHeaders },
      );
    }

    if (!news.imageUrl) {
      return NextResponse.json(
        {
          success: true,
          message: "تصویری برای حذف وجود ندارد.",
        },
        { status: 200, headers: corsHeaders },
      );
    }

    const marker = "/news-images/";

const imageUrl = String(news.imageUrl);
const markerIndex = imageUrl.indexOf(marker);

if (markerIndex !== -1) {
  const filePath = decodeURIComponent(
    imageUrl.substring(
      markerIndex + marker.length,
    ),
  );

      const { error: deleteError } =
        await supabase.storage
          .from("news-images")
          .remove([filePath]);

      if (deleteError) {
        console.error(
          "NEWS IMAGE DELETE ERROR:",
          deleteError,
        );

        return NextResponse.json(
          {
            success: false,
            message: "حذف تصویر خبر ناموفق بود.",
          },
          { status: 500, headers: corsHeaders },
        );
      }
    }

    await prisma.news.update({
      where: { id },
      data: {
        imageUrl: null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "تصویر خبر با موفقیت حذف شد.",
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error(
      "NEWS IMAGE DELETE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف تصویر خبر.",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}