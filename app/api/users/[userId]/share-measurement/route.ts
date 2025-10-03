import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import prismadb from "@/lib/prismadb";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const user = await prismadb.patient.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const token = jwt.sign({ userId, type: "share" }, process.env.JWT_SECRET!, {
      expiresIn: "2d",
    });

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${token}`;

    return NextResponse.json({ shareUrl });
  } catch (error) {
    console.error("Error creating share link:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
