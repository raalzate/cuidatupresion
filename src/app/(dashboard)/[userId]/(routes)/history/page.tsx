"use client";

import { VerticalTimeline } from "react-vertical-timeline-component";

import { HistoryTimeline } from "./components/history-timeline";

import "react-vertical-timeline-component/style.min.css";

interface HistoryPageProps {
  params: {
    userId: string;
  };
}

const MEDICAL_INTAKES = [
  {
    date: "2025-08-25 13:50",
    diastolicPressure: 80,
    heartRate: 70,
    systolicPressure: 120,
    tags: ["en reposo", "con mareo"],
  },
  {
    date: "2025-08-24 12:45",
    diastolicPressure: 80,
    heartRate: 70,
    systolicPressure: 120,
    tags: ["en reposo", "con mareo"],
  },
  {
    date: "2025-08-23 10:38",
    diastolicPressure: 80,
    heartRate: 70,
    systolicPressure: 120,
    tags: ["en reposo", "con mareo"],
  },
];

const HistoryPage: React.FC<HistoryPageProps> = ({ params }) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col">
          <VerticalTimeline lineColor="#000000">
            {MEDICAL_INTAKES.map((medicalIntake, index) => (
              <HistoryTimeline key={index} medicalIntake={medicalIntake} />
            ))}
          </VerticalTimeline>
        </div>
      </div>
    </div>
  );
};
export default HistoryPage;
