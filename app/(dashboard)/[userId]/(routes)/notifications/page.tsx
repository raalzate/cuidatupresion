"use client";

import { format } from "date-fns";

import { NotificationsClient } from "./components/client";
import { NotificationColumns } from "./components/columns";

const NotificationsPage = () => {
  const data: NotificationColumns[] = [
    {
      id: "1",
      name: "Nueva notificación",
      value: "Tienes una nueva notificación",
      createdAt: format(new Date(), "dd/MM/yyyy HH:mm"),
    },
  ];

  return (
    <div className="flex-col">
      <div className="flex-q space-y-4 p-8 pt-6">
        <NotificationsClient data={data} />
      </div>
    </div>
  );
};

export default NotificationsPage;
