import prismadb from "@/lib/prismadb";
import { ProfileForm } from "./components/profile-form";

interface SettingsPageProps {
  params: Promise<{ userId: string }>;
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
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
    relevantConditions: [],
    medications: [],
    name: "",
    email: "",
    birthdate: new Date(),
    gender: "",
    doctorAccessCode: "",
    height: 0,
    weight: 0,
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
