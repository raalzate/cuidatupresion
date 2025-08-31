import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
  params: {
    userId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = ({ params }) => {
  const initialData = {
    diastolicPressure: 0,
    heartRate: 0,
    tags: [],
    systolicPressure: 0,
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={initialData} />
      </div>
    </div>
  );
};
export default SettingsPage;
