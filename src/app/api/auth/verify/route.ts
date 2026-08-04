import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Токен не указан" }, { status: 400 });
  }

  try {
    const user = await db.user.findFirst({
      where: { verifyToken: token, emailVerified: false },
    });

    if (!user) {
      return NextResponse.json({ error: "Недействительная ссылка" }, { status: 400 });
    }

    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyToken: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
