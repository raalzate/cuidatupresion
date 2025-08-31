import Image from "next/image";

import { VerticalTimelineElement } from "react-vertical-timeline-component";

interface MedicalIntake {
  date: string;
  diastolicPressure: number;
  heartRate: number;
  tags: string[];
  systolicPressure: number;
}

interface HistoryTimelineProps {
  medicalIntake: MedicalIntake;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  medicalIntake,
}) => {
  return (
    <VerticalTimelineElement
      contentArrowStyle={{ borderRight: "7px solid #4a5568" }}
      contentStyle={{
        background: "white",
        color: "black",
        border: "2px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
      date={medicalIntake.date}
      icon={
        <div className="flex justify-center items-center w-full h-full text-gray-800">
          <Image
            alt="Blood Pressure"
            className="w-[60%] h-[60%] object-contain"
            height={100}
            src="/images/blood-presure.png"
            width={100}
          />
        </div>
      }
      iconStyle={{ background: "white", border: "3px solid #374151" }}
    >
      <div>
        <p className="text-gray-600 text-[16px] font-semibold mt-0">
          Estos fueron tus datos médicos:
        </p>
      </div>

      <ul className="mt-5 list-disc ml-5 space-y-2">
        <li className="text-gray-700 text-[14px] pll-1 tracking-wider">
          Presión sistólica: {medicalIntake.systolicPressure}
        </li>

        <li className="text-gray-700 text-[14px] pll-1 tracking-wider">
          Presión diastólica: {medicalIntake.diastolicPressure}
        </li>

        <li className="text-gray-700 text-[14px] pll-1 tracking-wider">
          Frecuencia cardíaca: {medicalIntake.heartRate}
        </li>

        <li className="text-gray-700 text-[14px] pll-1 tracking-wider">
          Observaciones adicionales: {medicalIntake.tags.join(", ")}
        </li>
      </ul>
    </VerticalTimelineElement>
  );
};
