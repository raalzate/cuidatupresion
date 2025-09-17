'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import dayjs from 'dayjs';

interface BloodPressureChartProps {
  data: {
    timestamp: number; // formato ISO: "2025-09-17T08:30:00Z"
    systolic: number;  // presión sistólica
    diastolic: number; // presión diastólica
  }[];
}

export const BloodPressureChart: React.FC<BloodPressureChartProps> = ({ data }) => {
  const formattedData = data.map((d) => ({
    ...d,
    timestamp: new Date(d.timestamp).getTime(),
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
        
        <XAxis
          dataKey="timestamp"
          scale="time"
          type="number"
          domain={['auto', 'auto']}
          tickFormatter={(value) => dayjs(value).format('DD/MM HH:mm')}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} mmHg`}
        />

        <Tooltip
          labelFormatter={(value) => dayjs(value).format('DD/MM/YYYY HH:mm')}
          formatter={(value, name) => [`${value} mmHg`, name]}
          contentStyle={{
            backgroundColor: '#1a1a1a',
            border: 'none',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#ffffff' }}
          itemStyle={{ color: '#888888' }}
        />

        <Line
          type="linear"
          dataKey="systolic"
          name="Sistólica"
          stroke="#3498db"
          strokeWidth={4}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="linear"
          dataKey="diastolic"
          name="Diastólica"
          stroke="#9b59b6"
          strokeWidth={4}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
