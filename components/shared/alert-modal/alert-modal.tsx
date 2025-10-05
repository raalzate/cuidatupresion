"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared/modal/modal";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  loading,
  onClose,
  onConfirm,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="¿Estás seguro?"
      description="Esta acción no se podrá revertir."
      isOpen={isOpen}
      onClose={onClose}
    >
  <div className="flex w-full items-center justify-end gap-4 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancelar
        </Button>

        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Continuar
        </Button>
      </div>
    </Modal>
  );
};
