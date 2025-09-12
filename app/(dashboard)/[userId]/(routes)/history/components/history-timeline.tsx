import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import { VerticalTimelineElement } from "react-vertical-timeline-component";

// Representa una medición tal como llega al cliente (Date -> string)
interface ClientMeasurement {
  id: string;
  systolicPressure: number;
  diastolicPressure: number;
  heartRate: number;
  createdAt: string; 
}

interface HistoryTimelineProps {
  measurement: ClientMeasurement;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ measurement }) => {
  const formattedDate = format(
    new Date(measurement.createdAt),
    "d 'de' MMMM 'de' yyyy 'a las' HH:mm",
    { locale: es }
  );

  return (
    <VerticalTimelineElement
      contentArrowStyle={{ borderRight: "7px solid #4a5568" }}
      contentStyle={{
        background: "white",
        color: "black",
        border: "2px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
      date={formattedDate}
      icon={
        <div className="flex justify-center items-center w-full h-full text-gray-800">
          <Image
            alt="Tensiometro"
            className="w-[60%] h-[60%] object-contain"
            height={100}
            src="/images/blood-pressure.png"
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
          Presión sistólica: {measurement.systolicPressure} mmHg
        </li>

        <li className="text-gray-700 text-[14px] pll-1 tracking-wider">
          Presión diastólica: {measurement.diastolicPressure} mmHg
        </li>

        <li className="text-gray-700 text-[14px] pll-1 tracking-wider">
          Frecuencia cardíaca: {measurement.heartRate} lpm
        </li>
      </ul>
    </VerticalTimelineElement>
  );
};
