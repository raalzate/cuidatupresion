import { maskValue } from "@/utils/mask-value";
import { ProfileForm } from "./components/profile-form";

import prismadb from "@/lib/prismadb";

interface SettingsPageProps {
  params: Promise<{ userId: string }>;
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { userId } = await params;

  const user = await prismadb.patient.findUnique({
    where: {
      id: userId,
    },
    include: {
      relevantConditions: {
        include: {
          relevantCondition: true,
        },
      },
      medications: {
        include: {
          medication: true,
        },
      },
      doctor: true,
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const relevantConditions = await prismadb.relevantConditions.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const medications = await prismadb.medications.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const initialData = {
    name: user.name,
    email: user.email,
    birthdate: user.birthdate || new Date(),
    gender: user.gender || "",
    doctorAccessCode: maskValue(user.doctor.accessCode) || "",
    height: user.height || 0,
    weight: user.weight || 0,
    relevantConditions: user.relevantConditions.map((rc) => ({
      id: rc.relevantCondition.id,
      name: rc.relevantCondition.name,
    })),
    medications: user.medications.map((m) => ({
      id: m.medication.id,
      name: m.medication.name,
    })),
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProfileForm
          initialData={initialData}
          medications={medications}
          relevantConditions={relevantConditions}
        />
      </div>
    </div>
  );
};
export default SettingsPage;
