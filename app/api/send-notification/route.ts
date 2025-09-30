import { NextResponse } from "next/server";
import { adminMessaging } from "@/lib/firebase-admin";
import prismadb from "@/lib/prismadb";
import { NotificationType } from "@prisma/client";

const getNotificationMessage = (
  notificationType: NotificationType,
  title: string,
  additionalNotes: string
) => {
  switch (notificationType) {
    case NotificationType.CITA_MEDICA:
      return {
        title: `Recordatorio de cita médica: ${title}`,
        body: `No olvides tu cita. Notas adicionales: ${additionalNotes}`,
      };
    case NotificationType.MEDICAMENTO:
      return {
        title: `Recordatorio de medicamento: ${title}`,
        body: `Es hora de tomar tu medicamento. Notas adicionales: ${additionalNotes}`,
      };
    case NotificationType.TOMA_PRESION:
      return {
        title: "Recordatorio de toma de presión",
        body: `Es momento de tomar tu presión arterial. Notas adicionales: ${additionalNotes}`,
      };
    default:
      return {
        title: "Recordatorio",
        body: "Tienes un nuevo recordatorio.",
      };
  }
};

export async function GET() {
  try {
    const now = new Date();
    const colombiaTimezone = "America/Bogota";
    const nowInColombia = new Date(now.toLocaleString("en-US", { timeZone: colombiaTimezone }));

    const notifications = await prismadb.notifications.findMany({
      where: {
        startDate: {
          lte: nowInColombia,
        },
      },
    });

    for (const notification of notifications) {
      if (notification.pushToken) {
        const message = {
          token: notification.pushToken,
          notification: getNotificationMessage(
            notification.type,
            notification.title,
            notification.additionalNotes
          ),
        };

        await adminMessaging.send(message);

        if (notification.type === NotificationType.CITA_MEDICA) {
          await prismadb.notifications.delete({
            where: {
              id: notification.id,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, message: "Notifications sent" });
  } catch (error) {
    console.error("Error sending push:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
