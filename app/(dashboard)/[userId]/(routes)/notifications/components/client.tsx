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

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          description="Administra tus recordatorios"
          title="Recordatorios"
        />

        <Button
          onClick={() => router.push(`/${params?.userId}/notifications/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="title" columns={columns(onRefetch)} data={data} />
    </>
  );
};
