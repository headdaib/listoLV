import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if ad exists and belongs to user
    const ad = await db.ad.findUnique({ where: { id } });
    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }
    
    // Check ownership or admin role
    if (ad.userId !== session.user.id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.ad.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete ad error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { z } from "zod";

const adUpdateSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20),
  price: z.number().nullable(),
  currency: z.string().default("EUR"),
  city: z.string().min(2),
  categoryId: z.number(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = adUpdateSchema.parse(body);

    const ad = await db.ad.findUnique({ where: { id } });
    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    if (ad.userId !== session.user.id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedAd = await db.ad.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        city: data.city,
        categoryId: data.categoryId,
      },
    });

    return NextResponse.json({ success: true, ad: updatedAd }, { status: 200 });
  } catch (error: any) {
    console.error("Update ad error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
