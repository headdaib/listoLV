import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { adId } = await request.json();
    if (!adId) {
      return NextResponse.json({ error: "Missing adId" }, { status: 400 });
    }

    const favorite = await db.favorite.create({
      data: {
        userId: session.user.id,
        adId,
      },
    });

    return NextResponse.json({ success: true, favorite }, { status: 201 });
  } catch (error: any) {
    // Prisma unique constraint error
    if (error.code === 'P2002') {
      return NextResponse.json({ success: true }, { status: 200 }); // already favorited
    }
    console.error("Favorite POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { adId } = await request.json();
    if (!adId) {
      return NextResponse.json({ error: "Missing adId" }, { status: 400 });
    }

    await db.favorite.deleteMany({
      where: {
        userId: session.user.id,
        adId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Favorite DELETE error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
