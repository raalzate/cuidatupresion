import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string; notificationId: string }> }
) {
  try {
    const { userId, notificationId } = await params;

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    if (!notificationId) {
      return new NextResponse("Notification ID is required", { status: 400 });
    }

    const notification = await prismadb.notifications.findUnique({
      where: {
        id: notificationId,
        patientId: userId,
      },
    });

    if (!notification) {
      return new NextResponse("Notification not found", { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.log("[NOTIFICATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string; notificationId: string }> }
) {
  try {
    const { userId, notificationId } = await params;

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    if (!notificationId) {
      return new NextResponse("Notification ID is required", { status: 400 });
    }

    const notification = await prismadb.notifications.findUnique({
      where: {
        id: notificationId,
        patientId: userId,
      },
    });

    if (!notification) {
      return new NextResponse("Notification not found", { status: 404 });
    }

    const body = await req.json();
    const {
      title,
      type,
      startDate,
      additionalNotes,
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

    if (!additionalNotes) {
      return new NextResponse("Additional notes are required", {
        status: 400,
      });
    }

    const updatedNotification = await prismadb.notifications.update({
      where: {
        id: notificationId,
      },
      data: {
        title,
        type,
        startDate,
        repeatInterval,
        additionalNotes,
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.log("[NOTIFICATION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string; notificationId: string }> }
) {
  try {
    const { userId, notificationId } = await params;

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    if (!notificationId) {
      return new NextResponse("Notification ID is required", { status: 400 });
    }

    const notification = await prismadb.notifications.findUnique({
      where: {
        id: notificationId,
        patientId: userId,
      },
    });

    if (!notification) {
      return new NextResponse("Notification not found", { status: 404 });
    }

    const deletedNotification = await prismadb.notifications.delete({
      where: {
        id: notificationId,
      },
    });

    return NextResponse.json(deletedNotification);
  } catch (error) {
    console.log("[NOTIFICATION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
