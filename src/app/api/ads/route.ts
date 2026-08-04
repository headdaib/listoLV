import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const adSchema = z.object({
  title: z.string().min(5, "Заголовок должен быть не менее 5 символов").max(200),
  description: z.string().min(20, "Описание должно быть подробным (минимум 20 символов)"),
  price: z.number().nullable(),
  currency: z.string().default("EUR"),
  city: z.string().min(2, "Укажите город"),
  categoryId: z.number(),
  images: z.array(z.string()).default([]),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = adSchema.parse(body);

    const newAd = await db.ad.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        city: data.city,
        categoryId: data.categoryId,
        userId: session.user.id,
        images: {
          create: data.images.map((url, index) => ({ url, order: index })),
        },
      },
    });

    return NextResponse.json({ success: true, ad: newAd }, { status: 201 });
  } catch (error) {
    console.error("Create ad error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Ошибка сервера при создании объявления" }, { status: 500 });
  }
}
