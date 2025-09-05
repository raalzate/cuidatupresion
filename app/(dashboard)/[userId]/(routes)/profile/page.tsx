import { ProfileForm } from "./components/profile-form";

interface SettingsPageProps {
  params: Promise<{ userId: string }>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ params }) => {
  const initialData = {
    relevantConditions: [],
    medications: [],
    name: "",
    email: "",
    birthdate: new Date(),
    gender: "",
    doctorAccessCode: "",
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProfileForm initialData={initialData} />
      </div>
    </div>
  );
};
export default SettingsPage;
