'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface OverviewChartProps {
  data: {
    name: string;
    systolicPressure: number;
    diastolicPressure: number;
  }[];
}

export const OverviewChart: React.FC<OverviewChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
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
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a1a',
            border: 'none',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#ffffff' }}
          itemStyle={{ color: '#888888' }}
        />
        <Bar
          dataKey="systolicPressure"
          name="Presión Sistólica"
          fill="#3498db"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="diastolicPressure"
          name="Presión Diastólica"
          fill="#9b59b6"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
