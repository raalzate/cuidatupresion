"use client";

import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { NotificationsClient } from "./components/client";
import { apiClient } from "@/services/api";

import { Notifications } from "@prisma/client";
import { EmptyState } from "@/components/shared/empty-state/empty-state";

const NotificationsPage = () => {
  const params = useParams();

  const userId = `${params?.userId}`;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const data = await apiClient.get<Notifications[]>(
        `/users/${userId}/notifications`
      );

      const notificationsData = data.map((notification) => ({
        id: notification.id,
        title: notification.title,
        type: notification.type.replaceAll("_", " "),
        repeatInterval: notification.repeatInterval,
        additionalNotes: notification.additionalNotes,
        startDate: format(new Date(notification.startDate), "dd/MM/yyyy HH:mm"),
      }));

      setNotifications(notificationsData as never);
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener las notificaciones");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <EmptyState
            ctaHref={`/${userId}/measurement`}
            ctaLabel="Añadir medición"
            subtitle="Pronto podrás ver tus recordatorios."
            title="Cargando tus recordatorios..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-q space-y-4 p-8 pt-6">
        <NotificationsClient
          data={notifications}
          onRefetch={fetchNotifications}
        />
      </div>
    </div>
  );
};

export default NotificationsPage;
