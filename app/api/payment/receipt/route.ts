import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    // 1. دریافت Session از Cookie
    const cookieHeader = request.headers.get("cookie");

    const sessionMatch = cookieHeader?.match(
      /(?:^|;\s*)session=([^;]+)/
    );

    const sessionId = sessionMatch?.[1];

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر وارد نشده است.",
        },
        { status: 401 }
      );
    }

    // 2. پیدا کردن Session و User
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "نشست کاربر پیدا نشد.",
        },
        { status: 401 }
      );
    }

    // 3. بررسی انقضای Session
    if (session.expiresAt < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "نشست منقضی شده است.",
        },
        { status: 401 }
      );
    }

    // 4. دریافت FormData
    const formData = await request.formData();

    const file = formData.get("file");
    const classIdValue = formData.get("classId");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "فایل فیش پرداخت ارسال نشده است.",
        },
        { status: 400 }
      );
    }

    if (!classIdValue) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کلاس ارسال نشده است.",
        },
        { status: 400 }
      );
    }

    const classId = Number(classIdValue);

    if (!Number.isInteger(classId)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کلاس نامعتبر است.",
        },
        { status: 400 }
      );
    }

    // 5. پیدا کردن کلاس
    const classItem = await prisma.class.findUnique({
      where: {
        id: classId,
      },
    });

    if (!classItem) {
      return NextResponse.json(
        {
          success: false,
          message: "کلاس پیدا نشد.",
        },
        { status: 404 }
      );
    }

    // 6. بررسی نوع فایل
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "فرمت فایل مجاز نیست.",
        },
        { status: 400 }
      );
    }

    // 7. حداکثر حجم فایل: 5MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "حجم فایل نباید بیشتر از 5 مگابایت باشد.",
        },
        { status: 400 }
      );
    }

    // 8. ساخت نام یکتا
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const filePath = `${session.user.id}/${classId}/${fileName}`;

    // 9. تبدیل File به Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ==================================================
    // DEBUG
    // ==================================================

    console.log("======================================");
    console.log("START PAYMENT RECEIPT UPLOAD");
    console.log("User ID:", session.user.id);
    console.log("Class ID:", classId);
    console.log("File name:", file.name);
    console.log("File type:", file.type);
    console.log("File size:", file.size);
    console.log("Bucket:", "payment-receipts");
    console.log("File path:", filePath);
    console.log(
      "Supabase URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL
    );
    console.log(
      "Service key exists:",
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
    );
    console.log("======================================");

    // 10. آپلود به Supabase Storage
    const { error: uploadError } =
      await supabaseAdmin.storage
        .from("payment-receipts")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

    // ==================================================
    // بررسی نتیجه Upload
    // ==================================================

    if (uploadError) {
      console.error("======================================");
      console.error("SUPABASE UPLOAD ERROR");
      console.error("Error:", uploadError);
      console.error("Message:", uploadError.message);
      console.error("Name:", uploadError.name);
      console.error("Status:", uploadError.status);
      console.error("StatusCode:", uploadError.statusCode);
      console.error("======================================");

      return NextResponse.json(
        {
          success: false,
          message: "آپلود فیش با خطا مواجه شد.",
          error: uploadError.message,
        },
        { status: 500 }
      );
    }

    console.log("SUPABASE UPLOAD SUCCESS");
    console.log("File path:", filePath);

    // 11. ثبت مبلغ کلاس
    const amount = classItem.price;

    // 12. ایجاد Payment
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        classId: classId,
        amount: amount,
        currency: classItem.currency,
        receiptPath: filePath,
        status: "PENDING",
      },
    });

    console.log("PAYMENT CREATED:", payment.id);

    return NextResponse.json({
      success: true,
      message: "فیش پرداخت با موفقیت ارسال شد.",
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("======================================");
    console.error("PAYMENT RECEIPT ERROR");
    console.error(error);
    console.error("======================================");

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در ارسال فیش پرداخت رخ داد.",
      },
      { status: 500 }
    );
  }
}