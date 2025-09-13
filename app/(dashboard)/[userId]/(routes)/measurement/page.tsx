"use client";

import { MeasurementForm } from "./components/measurement-form";
import { useParams } from "next/navigation";

const MeasurementPage = () => {
  const params = useParams();
  const userId = `${params?.userId}`;
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
