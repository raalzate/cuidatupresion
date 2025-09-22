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
        onClose={() => {
          setShowModal(false);
        }}
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

        <div className="flex gap-2 mt-4 justify-end w-full">
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
        className="min-w-4xl"
        description=""
        isOpen={showConfirmedHyperModal}
        onClose={onClose}
        title=""
      >
        <div className="flex flex-col items-center gap-4">
          <AlertCircleIcon className="text-red-600" size={48} />

          <h2 className="text-2xl font-bold text-red-700 mb-2">
            EMERGENCIA MÉDICA
          </h2>

          <p className="text-red-700 text-center mb-4">
            Busque atención médica de inmediato. Esto podría ser un riesgo grave
            para su salud.
          </p>

          <div className="flex gap-4 text-xl items-center bg-white border border-red-300 rounded-lg px-4 py-2">
            <Phone className="text-red-600" />

            <strong className="text-red-700">
              Llame ya mismo al número 123
            </strong>
          </div>

          <Button onClick={onClose}>Entendido</Button>
        </div>
      </Modal>

      <Modal
        className="min-w-4xl shadow-lg"
        description=""
        isOpen={showDeclinedHyperModal}
        onClose={onClose}
        title=""
      >
        <div className="flex flex-col items-center gap-4">
          <AlertCircleIcon className="text-orange-500" size={48} />

          <h2 className="text-2xl font-bold text-orange-600 mb-2">
            URGENCIA MÉDICA
          </h2>

          <p className="text-orange-600 text-center mb-4">
            Siga estas recomendaciones para cuidar su salud:
          </p>

          <ol className="list-inside list-decimal text-sm text-orange-600 mb-2 text-left max-w-md">
            <li>Mantenga la calma y permanezca en reposo durante 5 minutos.</li>

            <li>Vuelva a tomar su presión arterial.</li>

            <li>
              Si su presión sigue siendo alta, contacte a su médico lo antes
              posible.
            </li>
          </ol>

          <Button onClick={onClose}>Entendido</Button>
        </div>
      </Modal>

      <Modal
        className="min-w-4xl shadow-lg"
        description=""
        isOpen={showHypoModal}
        onClose={onClose}
        title=""
      >
        <div className="flex flex-col items-center gap-4">
          <AlertCircleIcon className="text-blue-700" size={48} />

          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            ¡Atención! Su presión arterial es baja.
          </h2>

          <p className="text-blue-700 text-center mb-4">
            Si se siente mareado, débil o aturdido, siéntese o recuéstese de
            inmediato para prevenir una caída.
            <br />
            Informe a su médico sobre esta lectura.
          </p>

          <Button onClick={onClose}>Entendido</Button>
        </div>
      </Modal>
    </>
  );
};
