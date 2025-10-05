"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Heading } from "@/components/shared/heading/heading";
import { NotificationColumns, columns } from "./columns";
import { Separator } from "@/components/shared/separator/separator";

interface NotificationsClientProps {
  data: NotificationColumns[];
  onRefetch: () => void;
}

export const NotificationsClient: React.FC<NotificationsClientProps> = ({
  data,
  onRefetch,
}) => {
  const router = useRouter();
  const params = useParams();

  const userId = `${params?.userId}`;

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          description="Administra tus recordatorios"
          title="Recordatorios"
        />

        <Button
          onClick={() => {
            router.push(`/${userId}/notifications/new`);
          }}
          className="h-9"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Agregar</span>
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="title" columns={columns(onRefetch)} data={data} />
    </>
  );
};
