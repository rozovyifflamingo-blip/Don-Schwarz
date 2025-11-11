import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line } from 'recharts';
import { NeomorphicContainer } from './NeomorphicContainer';

interface ScoreChartProps {
  data: { name: string; score: number }[];
  yAxisMax: number;
  isReversed?: boolean;
  chartFontFamily?: string;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ data, yAxisMax, isReversed = false, chartFontFamily }) => {
  const tickStyle = chartFontFamily ? { fontFamily: chartFontFamily } : {};
  const tooltipStyle = chartFontFamily ? { fontFamily: chartFontFamily } : {};

  return (
    <NeomorphicContainer className="w-full h-48 md:h-64 p-4 font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 5, right: isReversed ? -10 : 20, left: isReversed ? 20 : -10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', ...tickStyle }} stroke="#475569" reversed={isReversed} />
          <YAxis 
            tick={{ fill: '#94a3b8', ...tickStyle }} 
            stroke="#475569" 
            domain={[0, yAxisMax]} 
            orientation={isReversed ? 'right' : 'left'} 
          />
          <Tooltip
            cursor={{ stroke: 'rgba(71, 85, 105, 0.5)', strokeWidth: 2 }}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '0.5rem',
              ...tooltipStyle,
            }}
            labelStyle={{ color: '#f1f5f9', ...tooltipStyle }}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="none" 
            fill="url(#scoreGradient)" 
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={{ r: 2, fill: '#06b6d4' }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </NeomorphicContainer>
  );
};