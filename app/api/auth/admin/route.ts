import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const adminSession = cookieStore.get("admin_session")?.value;

    if (adminSession !== "authenticated") {
      return NextResponse.json(
        {
          success: false,
          message: "دسترسی به پنل مدیریت مجاز نیست.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        email: process.env.ADMIN_EMAIL,
        role: "ADMIN",
      },
    });
  } catch (error) {
    console.error("Admin auth error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در بررسی دسترسی ادمین رخ داد.",
      },
      { status: 500 }
    );
  }
}