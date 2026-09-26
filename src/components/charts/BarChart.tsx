import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface BarConfig {
  dataKey: string;
  color: string;
  name: string;
}

export interface BarChartProps {
  data: any[];
  xKey: string;
  bars: BarConfig[];
  title?: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, xKey, bars, title, height = 300 }) => {
  return (
    <div className="w-full flex flex-col">
      {title && <h3 className="text-lg font-semibold mb-4 text-surface-900">{title}</h3>}
      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: '20px' }} />
            {bars.map((bar, index) => (
              <Bar key={index} dataKey={bar.dataKey} name={bar.name} fill={bar.color} radius={[4, 4, 0, 0]} />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
