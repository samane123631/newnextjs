import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    console.log("ADMIN EMAIL:", adminEmail);
    console.log("LOGIN EMAIL:", email);

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "ایمیل وارد نشده است.",
        },
        { status: 400 }
      );
    }

    if (!adminEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "ADMIN_EMAIL پیدا نشد.",
        },
        { status: 500 }
      );
    }

    if (email !== adminEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "این ایمیل اجازه ورود ندارد.",
        },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "ورود موفق بود.",
    });

    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطای داخلی سرور.",
      },
      { status: 500 }
    );
  }
}