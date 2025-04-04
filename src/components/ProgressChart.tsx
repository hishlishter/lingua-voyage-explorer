
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
  // Получаем текущий месяц (0-11)
  const currentMonth = new Date().getMonth();
  
  // Добавляем в данные флаг для текущего месяца
  const enhancedData = data.map((item, index) => ({
    ...item,
    isCurrentMonth: index === currentMonth
  }));

  // Получаем значение текущего месяца для отображения над точкой
  const currentMonthValue = enhancedData[currentMonth]?.value1 ?? 0;

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
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enhancedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                dot={(props) => {
                  // Для точек используем особую логику отображения
                  const { cx, cy, payload } = props;
                  
                  // Если это текущий месяц, показываем особую точку и балл над ней
                  if (payload.isCurrentMonth) {
                    return (
                      <g>
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={6} 
                          fill="#B794F4" 
                          stroke="#fff" 
                          strokeWidth={2}
                        />
                        <text 
                          x={cx} 
                          y={cy - 15} 
                          textAnchor="middle" 
                          fill="#333" 
                          fontSize="12" 
                          fontWeight="bold"
                        >
                          {payload.value1.toFixed(1)}
                        </text>
                      </g>
                    );
                  }
                  
                  // Для остальных месяцев точек нет
                  return null;
                }}
                activeDot={{ r: 6, fill: '#B794F4', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
