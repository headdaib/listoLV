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
