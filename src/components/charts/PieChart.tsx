import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface PieData {
  name: string;
  value: number;
  color: string;
}

export interface PieChartProps {
  data: PieData[];
  title?: string;
  height?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title, height = 300 }) => {
  return (
    <div className="w-full flex flex-col">
      {title && <h3 className="text-lg font-semibold mb-4 text-surface-900">{title}</h3>}
      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#111827' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: '20px' }} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
