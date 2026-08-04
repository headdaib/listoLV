import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/utils";
import { sendVerificationEmail } from "@/lib/mail";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(8, "Пароль минимум 8 символов"),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = parsed.data;
    const emailLower = email.toLowerCase();

    const existing = await db.user.findUnique({ where: { email: emailLower } });
    if (existing) {
      return NextResponse.json({ error: "Email уже зарегистрирован" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const verifyToken = generateToken();

    await db.user.create({
      data: {
        name,
        email: emailLower,
        passwordHash,
        phone: phone || null,
        verifyToken,
        emailVerified: false,
      },
    });

    // Send verification email (non-blocking)
    sendVerificationEmail(emailLower, name, verifyToken).catch(console.error);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
