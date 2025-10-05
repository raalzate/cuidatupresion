// BloodPressureChart.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from 'recharts'; // Se elimina la importación de TooltipProps

// --- INTERFAZ DE PROPS PARA EL COMPONENTE ---
interface BloodPressureChartProps {
  data: {
    timestamp: number;
    systolic: number;
    diastolic: number;
  }[];
}

// Tipo que describe la forma de nuestros datos
type DataPoint = {
  timestamp: number;
  systolic: number;
  diastolic: number;
};

// --- NUEVO: INTERFACE EXPLÍCITA PARA EL TOOLTIP ---
// Definimos exactamente qué propiedades esperamos que Recharts nos envíe.
interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    name: string;
    payload: DataPoint; // Usamos nuestro tipo DataPoint aquí para máxima seguridad
  }[];
  label?: number;
}

// --- FUNCIÓN DE ANÁLISIS (sin cambios) ---
const analyzePeriodData = (periodData: DataPoint[]) => {
    if (periodData.length === 0) { return { systolicAvg: 0, diastolicAvg: 0, systolicMax: 0, diastolicMax: 0, systolicMin: 0, diastolicMin: 0 }; }
    const initial = { systolicSum: 0, diastolicSum: 0, systolicMax: -Infinity, diastolicMax: -Infinity, systolicMin: Infinity, diastolicMin: Infinity, };
    const stats = periodData.reduce((acc, cur) => { acc.systolicSum += cur.systolic; acc.diastolicSum += cur.diastolic; if (cur.systolic > acc.systolicMax) acc.systolicMax = cur.systolic; if (cur.systolic < acc.systolicMin) acc.systolicMin = cur.systolic; if (cur.diastolic > acc.diastolicMax) acc.diastolicMax = cur.diastolic; if (cur.diastolic < acc.diastolicMin) acc.diastolicMin = cur.diastolic; return acc; }, initial);
    return { systolicAvg: Math.round(stats.systolicSum / periodData.length), diastolicAvg: Math.round(stats.diastolicSum / periodData.length), systolicMax: stats.systolicMax, diastolicMax: stats.diastolicMax, systolicMin: stats.systolicMin, diastolicMin: stats.diastolicMin, };
};

// --- COMPONENTE PRINCIPAL ---
export const BloodPressureChart: React.FC<BloodPressureChartProps> = ({ data }) => {

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 1);

  const filteredData = data.filter(
    d => d.timestamp >= startDate.getTime() && d.timestamp <= endDate.getTime()
  ).sort((a, b) => a.timestamp - b.timestamp);

  const analysis = analyzePeriodData(filteredData);
  const formatXAxisTick = (timestamp: number) => new Date(timestamp).getHours().toString().padStart(2, '0') + ':00';

  // --- CORRECCIÓN: USAMOS NUESTRA PROPIA INTERFACE ---
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        // Ahora TypeScript sabe exactamente qué es 'payload' y 'dataPoint'
        const dataPoint = payload[0].payload;
        return (
            <div className="bg-white border border-gray-300 p-3 rounded-lg shadow-lg text-sm">
                <p className="font-bold m-0">{label ? new Date(label).toLocaleString() : ''}</p>
                <hr className="my-1 border-t border-gray-200"/>
                <p className="text-blue-500 m-0">Sistólica: <strong className="font-bold">{dataPoint.systolic}</strong> (Promedio 24h: {analysis.systolicAvg})</p>
                <p className="text-green-500 m-0">Diastólica: <strong className="font-bold">{dataPoint.diastolic}</strong> (Promedio 24h: {analysis.diastolicAvg})</p>
            </div>
        );
    }
    return null;
  };

  return (
    <div className="w-full mx-auto font-sans p-2 sm:p-4">
      <div className="w-full h-[300px] sm:h-[400px]">
        <h3 className="text-lg sm:text-xl font-bold text-center mb-1 text-gray-800">
          Monitorización de Presión Arterial
        </h3>
        <p className="text-center text-xs text-gray-500 mb-2 sm:mb-4">
          Período: {startDate.toLocaleString()} - {endDate.toLocaleString()}
        </p>
        <ResponsiveContainer>
           {/* ... (resto del JSX sin cambios) ... */}
           <LineChart data={filteredData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="timestamp" type="number" domain={[startDate.getTime(), endDate.getTime()]} tickFormatter={formatXAxisTick} tick={{ fontSize: 10, fill: '#374151' }} axisLine={{ stroke: '#9ca3af' }} tickLine={{ stroke: '#9ca3af' }} >
              <Label value="Hora del día" offset={-15} position="insideBottom" fill="#374151" className="text-xs" />
            </XAxis>
            <YAxis domain={[40, 'dataMax + 20']} tick={{ fontSize: 10, fill: '#374151' }} axisLine={{ stroke: '#9ca3af' }} tickLine={{ stroke: '#9ca3af' }} >
               <Label value="Presión (mmHg)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#374151" className="text-xs" />
            </YAxis>
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d1d5db', strokeWidth: 1 }} />
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />
            {analysis.systolicAvg > 0 && <ReferenceLine y={analysis.systolicAvg} stroke="#3b82f6" strokeDasharray="4 4"><Label value={`Prom. ${analysis.systolicAvg}`} position="right" fill="#3b82f6" fontSize={10} /></ReferenceLine>}
            {analysis.diastolicAvg > 0 && <ReferenceLine y={analysis.diastolicAvg} stroke="#22c55e" strokeDasharray="4 4"><Label value={`Prom. ${analysis.diastolicAvg}`} position="right" fill="#22c55e" fontSize={10} /></ReferenceLine>}
            <Line type="linear" dataKey="systolic" name="Sistólica" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
            <Line type="linear" dataKey="diastolic" name="Diastólica" stroke="#22c55e" strokeWidth={2} dot={{ r: 2, fill: '#22c55e' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 sm:mt-8 pt-6 sm:pt-12">
        <h4 className="text-base sm:text-lg font-semibold text-center text-gray-800 mb-3 sm:mb-4">Análisis del Período</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            {/* ... (tabla sin cambios) ... */}
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 sm:p-3 border border-gray-300 font-semibold text-gray-700 text-xs sm:text-sm">Métrica</th>
                <th className="p-2 sm:p-3 border border-gray-300 font-semibold text-gray-700 text-center text-xs sm:text-sm">Valor Sistólica (mmHg)</th>
                <th className="p-2 sm:p-3 border border-gray-300 font-semibold text-gray-700 text-center text-xs sm:text-sm">Valor Diastólica (mmHg)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="p-2 sm:p-3 border border-gray-300 font-bold text-xs sm:text-sm">Promedio</td>
                <td className="p-2 sm:p-3 border border-gray-300 text-center text-xs sm:text-sm">{analysis.systolicAvg}</td>
                <td className="p-2 sm:p-3 border border-gray-300 text-center text-xs sm:text-sm">{analysis.diastolicAvg}</td>
              </tr>
              <tr>
                <td className="p-2 sm:p-3 border border-gray-300 font-bold text-xs sm:text-sm">Máximo</td>
                <td className="p-2 sm:p-3 border border-gray-300 text-center text-xs sm:text-sm">{analysis.systolicMax}</td>
                <td className="p-2 sm:p-3 border border-gray-300 text-center text-xs sm:text-sm">{analysis.diastolicMax}</td>
              </tr>
              <tr>
                <td className="p-2 sm:p-3 border border-gray-300 font-bold text-xs sm:text-sm">Mínimo</td>
                <td className="p-2 sm:p-3 border border-gray-300 text-center text-xs sm:text-sm">{analysis.systolicMin}</td>
                <td className="p-2 sm:p-3 border border-gray-300 text-center text-xs sm:text-sm">{analysis.diastolicMin}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};