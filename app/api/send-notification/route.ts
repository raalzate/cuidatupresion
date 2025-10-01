import { NextResponse } from "next/server";
import { adminMessaging } from "@/lib/firebase-admin";
import prismadb from "@/lib/prismadb";
import { formatInTimeZone } from 'date-fns-tz'

import { NotificationType } from "@prisma/client";

type NotificationRow = {
  id: string;
  type: NotificationType;
  title: string;
  additionalNotes: string;
  pushToken: string;
  startDate: Date;
};

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

  const colombiaTimezone = "America/Bogota";
  const currentHour = parseInt(formatInTimeZone(new Date(), colombiaTimezone, 'HH'), 10);

  const notifications = await prismadb.$queryRaw<NotificationRow[]>`
    SELECT *
    FROM "Notifications"
    WHERE EXTRACT(HOUR FROM "startDate" AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota') = ${currentHour};
  `;
    const messages: { token: string; message: { title: string; body: string } }[] = [];

    for (const notification of notifications) {
      if (notification.pushToken) {
        const notificationContent = getNotificationMessage(
          notification.type,
          notification.title,
          notification.additionalNotes
        );

        const message = {
          token: notification.pushToken,
          notification: notificationContent,
        };
        
        messages.push({
          token: notification.pushToken, message: notificationContent
        });
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

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error sending push:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
