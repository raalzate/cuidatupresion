"use client";

import { Copy, Share } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";

import { apiClient } from "@/services/api";
import { Button } from "@/components/ui/button";
import { columns, MeasurementColumns } from "./columns";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Heading } from "@/components/shared/heading/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/shared/modal/modal";
import { Separator } from "@/components/shared/separator/separator";

interface MeasurementClientProps {
  data: MeasurementColumns[];
  userId: string;
}

interface ShareResponse {
  shareUrl: string;
}

export const MeasurementClient: React.FC<MeasurementClientProps> = ({
  data,
  userId,
}) => {
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [sharedUrl, setSharedUrl] = useState<string>("");

  const handleCreateShareUrl = async () => {
    try {
      const { shareUrl } = await apiClient.post<ShareResponse>(
        `/users/${userId}/share-measurement`,
        {}
      );

      setSharedUrl(shareUrl);
      setShowShareModal(true);

      toast.success("Enlace generado correctamente");
    } catch (error) {
      console.error({ error });

      toast.error("No se pudo generar el enlace para compartir");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedUrl);

    toast.success("Enlace copiado al portapapeles");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          description="Aquí podrás ver todas las mediciones médicas"
          title="Mediciones"
        />

        <Button onClick={handleCreateShareUrl} className="h-9">
          <Share className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Compartir</span>
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="tags" />

      <Modal
        description="Copia el enlace para compartirlo con el médico"
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
        }}
        title="Compartir"
      >
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>

            <Input id="link" defaultValue={sharedUrl} readOnly />
          </div>

          <Button variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => {
              setShowShareModal(false);
            }}
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </>
  );
};
