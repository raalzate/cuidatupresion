import prismadb from "@/lib/prismadb";

import { DashboardClient } from "./components/dashboard-client";

const DashboardPage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = params;

  // Se obtiene la información del paciente en el servidor para una carga inicial rápida.
  const patient = await prismadb.patient.findUnique({
    where: {
      id: userId,
    },
  });

  // Se maneja el caso de que el paciente no se encuentre.
  if (!patient) {
    return <div>Paciente no encontrado</div>;
  }

  // Se renderiza el Componente de Cliente, que se encargará de obtener
  // y mostrar los datos dinámicos (mediciones) utilizando apiClient.
  return <DashboardClient patient={patient} />;
};

export default DashboardPage;
