import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared/modal/modal";
import { AlertCircleIcon, Phone } from "lucide-react";

interface HyperHypoModalsProps {
  showConfirmHyperModal: boolean;
  showHypoModal: boolean;
  userId: string;
}

export const HyperHypoModals: React.FC<HyperHypoModalsProps> = ({
  showConfirmHyperModal,
  showHypoModal,
  userId,
}) => {
  const router = useRouter();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmedHyperModal, setShowConfirmedHyperModal] =
    useState<boolean>(false);
  const [showDeclinedHyperModal, setShowDeclinedHyperModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (showConfirmHyperModal) {
      setShowModal(true);
    }
  }, [showConfirmHyperModal]);

  const onClose = () => {
    router.push(`/${userId}/history`);
  };

  return (
    <>
      <Modal
        description=""
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirmar síntomas crisis hipertensiva"
      >
        <p className="mb-4">¿Presenta alguno de estos síntomas?</p>

        <ul className="list-inside list-disc text-sm">
          <li>Dolor de pecho</li>
          <li>Dificultad para respirar</li>
          <li>Dolor de espalda</li>
          <li>Debilidad súbita</li>
          <li>Cambios en la visión</li>
        </ul>

        <div className="flex gap-2 mt-4">
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeclinedHyperModal(true);
              setShowModal(false);
            }}
          >
            No
          </Button>

          <Button
            onClick={() => {
              setShowConfirmedHyperModal(true);
              setShowModal(false);
            }}
          >
            Sí
          </Button>
        </div>
      </Modal>

      <Modal
        className="min-w-4xl text-destructive"
        description=""
        isOpen={showConfirmedHyperModal}
        onClose={onClose}
        title="EMERGENCIA MÉDICA"
      >
        <p className="mb-4">
          Busque atención médica de inmediato. Esto podría ser un riesgo grave
          para su salud.
        </p>

        <div className="flex gap-4 text-xl items-center">
          <Phone />

          <strong>Llame ya mismo al número 123</strong>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={onClose}>Entendido</Button>
        </div>
      </Modal>

      <Modal
        className="min-w-4xl text-orange-500"
        description=""
        isOpen={showDeclinedHyperModal}
        onClose={onClose}
        title="URGENCIA MÉDICA"
      >
        <ol className="list-inside list-disc text-sm">
          <li>Mantenga la calma y permanezca en reposo durante 5 minutos.</li>
          <li>Vuelva a tomar su presión arterial.</li>
          <li>
            Si su presión sigue siendo alta, contacte a su médico lo antes
            posible.
          </li>
        </ol>

        <div className="flex gap-2 mt-4">
          <Button onClick={onClose}>Entendido</Button>
        </div>
      </Modal>

      <Modal
        className="min-w-4xl text-blue-700"
        description=""
        isOpen={showHypoModal}
        onClose={onClose}
        title="¡Atención! Su presión arterial es baja."
      >
        <div className="flex gap-4 text-xl items-center">
          <AlertCircleIcon />

          <strong>
            Si se siente mareado, débil o aturdido, siéntese o recuéstese de
            inmediato para prevenir una caída. Informe a su médico sobre esta
            lectura.
          </strong>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={onClose}>Entendido</Button>
        </div>
      </Modal>
    </>
  );
};
