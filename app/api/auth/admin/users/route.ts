import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdmin(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";

  const match = cookieHeader.match(
    /(?:^|;\s*)admin_session=([^;]+)/
  );

  return match?.[1] === "authenticated";
}


// GET USERS
export async function GET(request: Request) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "دسترسی غیرمجاز",
        },
        { status: 403 }
      );
    }


    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        level: true,
        phone: true,
        phoneVerified: true,
        role: true,
        createdAt: true,

        payments: {
          select: {
            id: true,
            receiptPath: true,
            classId: true,
          },

          where: {
            receiptPath: {
              not: null,
            },
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 1,
        },
      },
    });


    const usersWithReceipt = users.map((user) => {

      const receipt = user.payments[0];


      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate,
        level: user.level,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        role: user.role,
        createdAt: user.createdAt,


        hasReceipt: Boolean(receipt),

        receiptPath:
          receipt?.receiptPath ?? null,

        receiptId:
          receipt?.id ?? null,

        receiptClassId:
          receipt?.classId ?? null,
      };
    });


    return NextResponse.json({
      success: true,
      users: usersWithReceipt,
    });


  } catch (error) {

    console.error(
      "Get users error:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        message:
          "خطا در دریافت کاربران",
      },
      {
        status: 500,
      }
    );
  }
}