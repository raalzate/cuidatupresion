"use client";

import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { apiClient } from "@/services/api";
import { NotificationForm } from "./components/notification-form";
import { EmptyState } from "@/components/shared/empty-state/empty-state";

import { Notifications } from "@prisma/client";

const NotificationPage = () => {
  const params = useParams();
  const notificationId = params?.notificationId;
  const userId = `${params?.userId}`;

  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setLoading(true);

        if (notificationId === "new") return;

        const data = await apiClient.get<Notifications>(
          `/users/${userId}/notifications/${notificationId}`
        );

        setNotification({
          title: data.title,
          type: data.type,
          startDate: new Date(data.startDate),
          additionalNotes: data.additionalNotes,
          repeatInterval: data.repeatInterval.toString(),
        } as never);
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchNotification();
    }
  }, [userId, notificationId]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <EmptyState
            ctaHref={`/${userId}/history`}
            ctaLabel="Ver mis mediciones"
            subtitle="En breve podrás ver tus notificaciones."
            title="Obteniendo tus datos"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-q space-y-4 p-8 pt-6">
        <NotificationForm initialData={notification} userId={userId} />
      </div>
    </div>
  );
};

export default NotificationPage;
