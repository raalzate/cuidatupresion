import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const notifications = await prismadb.notifications.findMany({
      where: {
        patientId: userId,
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.log("[NOTIFICATIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const body = await req.json();
    const {
      title,
      type,
      startDate,
      additionalNotes,
      pushToken,
      repeatInterval = 0,
    } = body;

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    if (!type) {
      return new NextResponse("Type is required", { status: 400 });
    }

    if (!startDate) {
      return new NextResponse("Start date is required", { status: 400 });
    }

    if (additionalNotes === undefined || additionalNotes === null) {
      return new NextResponse("Additional notes are required", {
        status: 400,
      });
    }

    const notification = await prismadb.notifications.create({
      data: {
        title,
        type,
        startDate,
        repeatInterval,
        additionalNotes,
        pushToken,
        patientId: userId,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.log("[NOTIFICATIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
