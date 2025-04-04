
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgressChartProps {
  title: string;
  year: number;
  data: Array<{
    name: string;
    value1: number;
    value2: number;
    value3: number;
  }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 p-3 rounded-lg shadow-lg text-white text-sm">
        <p className="font-semibold">{label}</p>
        <p className="text-purple-300">Баллы: {payload[0].value.toFixed(1)}</p>
      </div>
    );
  }

  return null;
};

const ProgressChart: React.FC<ProgressChartProps> = ({ title, year, data }) => {
  return (
    <Card className="shadow-sm border-none overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft size={18} />
            </Button>
            <span className="font-medium">{year}</span>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64 mt-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value1" 
                stroke="#B794F4" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: '#B794F4', stroke: '#fff', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="value2" 
                stroke="#F687B3" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: '#F687B3', stroke: '#fff', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="value3" 
                stroke="#4FD1C5" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: '#4FD1C5', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="absolute top-0 right-0 p-2 bg-black/70 text-white rounded-lg text-sm">
            <div className="font-bold">4.5</div>
            <div className="text-xs">Балла</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
