import { MeasurementForm } from "./components/measurement-form";

const MeasurementPage = () => {
  const initialData = {
    diastolicPressure: 0,
    heartRate: 0,
    tags: [],
    systolicPressure: 0,
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MeasurementForm initialData={initialData} />
      </div>
    </div>
  );
};
export default MeasurementPage;
