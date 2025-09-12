import { MeasurementForm } from "./components/measurement-form";

const MeasurementPage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MeasurementForm />
      </div>
    </div>
  );
};
export default MeasurementPage;
