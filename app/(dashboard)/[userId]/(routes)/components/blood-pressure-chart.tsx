// BloodPressureChart.tsx
import { useWindowWidth } from '@/hooks/useWindowWidth';
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';

// Interfaces y funciones de análisis (sin cambios)...
interface BloodPressureChartProps {
  data: { timestamp: number; systolic: number; diastolic: number; }[];
}
type DataPoint = { timestamp: number; systolic: number; diastolic: number; };
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; payload: DataPoint; }[];
  label?: number;
}
const analyzePeriodData = (periodData: DataPoint[]) => {
    if (periodData.length === 0) { return { systolicAvg: 0, diastolicAvg: 0, systolicMax: 0, diastolicMax: 0, systolicMin: 0, diastolicMin: 0 }; }
    const initial = { systolicSum: 0, diastolicSum: 0, systolicMax: -Infinity, diastolicMax: -Infinity, systolicMin: Infinity, diastolicMin: Infinity, };
    const stats = periodData.reduce((acc, cur) => { acc.systolicSum += cur.systolic; acc.diastolicSum += cur.diastolic; if (cur.systolic > acc.systolicMax) acc.systolicMax = cur.systolic; if (cur.systolic < acc.systolicMin) acc.systolicMin = cur.systolic; if (cur.diastolic > acc.diastolicMax) acc.diastolicMax = cur.diastolic; if (cur.diastolic < acc.diastolicMin) acc.diastolicMin = cur.diastolic; return acc; }, initial);
    return { systolicAvg: Math.round(stats.systolicSum / periodData.length), diastolicAvg: Math.round(stats.diastolicSum / periodData.length), systolicMax: stats.systolicMax, diastolicMax: stats.diastolicMax, systolicMin: stats.systolicMin, diastolicMin: stats.diastolicMin, };
};


export const BloodPressureChart: React.FC<BloodPressureChartProps> = ({ data }) => {
  // --- MEJORAS RESPONSIVAS ---
  const width = useWindowWidth();
  // Ajustamos el margen del gráfico para pantallas pequeñas (< 500px)
  const chartMargin = width < 500 
    ? { top: 5, right: 10, left: 5, bottom: 20 } 
    : { top: 5, right: 40, left: 20, bottom: 20 };

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 1);

  const filteredData = data.filter(
    d => d.timestamp >= startDate.getTime() && d.timestamp <= endDate.getTime()
  ).sort((a, b) => a.timestamp - b.timestamp);

  const analysis = analyzePeriodData(filteredData);
  const formatXAxisTick = (timestamp: number) => new Date(timestamp).getHours().toString().padStart(2, '0');

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    // ... (sin cambios)
    if (active && payload && payload.length) {
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
    // Padding responsivo: p-2 en móvil, p-4 en pantallas más grandes
    <div className="w-full max-w-4xl mx-auto font-sans p-2 sm:p-4">
      <div className="w-full h-[400px]">
        {/* Tipografía responsiva */}
        <h3 className="text-lg sm:text-xl font-bold text-center mb-1 text-gray-800">
          Monitorización de Presión Arterial
        </h3>
        <p className="text-center text-[11px] sm:text-xs text-gray-500 mb-4">
          Período: {startDate.toLocaleString()} - {endDate.toLocaleString()}
        </p>
        <ResponsiveContainer>
          {/* Usamos el margen dinámico */}
          <LineChart data={filteredData} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="timestamp" type="number" domain={[startDate.getTime(), endDate.getTime()]} tickFormatter={formatXAxisTick} tick={{ fontSize: 12, fill: '#374151' }} axisLine={{ stroke: '#9ca3af' }} tickLine={{ stroke: '#9ca3af' }} >
              <Label value="Hora" offset={-15} position="insideBottom" fill="#374151" />
            </XAxis>
            <YAxis domain={[40, 'dataMax + 20']} tick={{ fontSize: 12, fill: '#374151' }} axisLine={{ stroke: '#9ca3af' }} tickLine={{ stroke: '#9ca3af' }} >
               <Label value="mmHg" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#374151" />
            </YAxis>
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d1d5db', strokeWidth: 1 }} />
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
            
            {analysis.systolicAvg > 0 && <ReferenceLine y={analysis.systolicAvg} stroke="#3b82f6" strokeDasharray="4 4"><Label value={`Prom. ${analysis.systolicAvg}`} position="right" fill="#3b82f6" fontSize={12} /></ReferenceLine>}
            {analysis.diastolicAvg > 0 && <ReferenceLine y={analysis.diastolicAvg} stroke="#22c55e" strokeDasharray="4 4"><Label value={`Prom. ${analysis.diastolicAvg}`} position="right" fill="#22c55e" fontSize={12} /></ReferenceLine>}
            
            <Line type="linear" dataKey="systolic" name="Sistólica" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
            <Line type="linear" dataKey="diastolic" name="Diastólica" stroke="#22c55e" strokeWidth={3} dot={{ r: 3, fill: '#22c55e' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-8 pt-9">
        <h4 className="text-base sm:text-lg font-semibold text-center text-gray-800 mb-4">Análisis del Período</h4>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gray-100">
                {/* Padding responsivo en celdas */}
                <th className="p-2 sm:p-3 border-b font-semibold text-gray-700">Métrica</th>
                <th className="p-2 sm:p-3 border-b font-semibold text-gray-700 text-center">Valor Sistólica (mmHg)</th>
                <th className="p-2 sm:p-3 border-b font-semibold text-gray-700 text-center">Valor Diastólica (mmHg)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="p-2 sm:p-3 border-b border-gray-200 font-bold">Promedio</td>
                <td className="p-2 sm:p-3 border-b border-gray-200 text-center">{analysis.systolicAvg}</td>
                <td className="p-2 sm:p-3 border-b border-gray-200 text-center">{analysis.diastolicAvg}</td>
              </tr>
              <tr>
                <td className="p-2 sm:p-3 border-b border-gray-200 font-bold">Máximo</td>
                <td className="p-2 sm:p-3 border-b border-gray-200 text-center">{analysis.systolicMax}</td>
                <td className="p-2 sm:p-3 border-b border-gray-200 text-center">{analysis.diastolicMax}</td>
              </tr>
              <tr>
                <td className="p-2 sm:p-3 font-bold">Mínimo</td>
                <td className="p-2 sm:p-3 text-center">{analysis.systolicMin}</td>
                <td className="p-2 sm:p-3 text-center">{analysis.diastolicMin}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};