import { MeasurementForm } from "./components/measurement-form";

interface MeasurementPageProps {
  params: Promise<{ userId: string }>;
}

const MeasurementPage: React.FC<MeasurementPageProps> = async ({ params }) => {
  const { userId } = await params;
  
  const initialData = {
    diastolicPressure: 0,
    heartRate: 0,
    tags: [],
    systolicPressure: 0,
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MeasurementForm initialData={initialData} userId={userId} />
      </div>
    </div>
  );
};
export default MeasurementPage;
