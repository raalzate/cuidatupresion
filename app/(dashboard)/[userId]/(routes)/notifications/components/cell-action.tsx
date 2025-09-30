"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { AlertModal } from "@/components/shared/alert-modal/alert-modal";
import { apiClient } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationColumns } from "./columns";

interface CellActionProps {
  data: NotificationColumns;
  onRefetch: () => void;
}

export const CellAction: React.FC<CellActionProps> = ({ data, onRefetch }) => {
  const router = useRouter();
  const params = useParams();

  const userId = `${params?.userId}`;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);

      await apiClient.delete(`/users/${userId}/notifications/${data.id}`);

      onRefetch();
      toast.success("Recordatorio eliminado.");
    } catch (error) {
      toast.error(`${error.response?.data}`);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={onDelete}
        loading={loading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>

            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              router.push(`/${userId}/notifications/${data.id}`);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Actualizar
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
