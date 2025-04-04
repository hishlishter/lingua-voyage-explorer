
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface ProgressChartProps {
  title: string;
  year: number;
}

interface MonthlyScore {
  name: string;
  value1: number;
  isCurrentMonth: boolean;
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

const ProgressChart: React.FC<ProgressChartProps> = ({ title, year: initialYear }) => {
  const [year, setYear] = useState(initialYear);
  const { user } = useAuth();
  
  // Получаем данные о результатах тестов пользователя с обновленными queryKey
  const { data: testResults, isLoading } = useQuery({
    queryKey: ['test-results', user?.id, year],
    queryFn: async () => {
      if (!user) return [];
      
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');
      
      if (error) {
        console.error('Error fetching test results:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
    // Add refetchOnWindowFocus to refresh data when the tab regains focus
    refetchOnWindowFocus: true,
    // Add staleTime to make sure data is refreshed more frequently
    staleTime: 30000 // 30 seconds
  });
  
  // Подготавливаем данные для графика
  const [chartData, setChartData] = useState<MonthlyScore[]>([]);
  
  useEffect(() => {
    // Названия месяцев
    const monthNames = [
      'Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь',
      'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'
    ];
    
    // Получаем текущий месяц
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Создаем структуру для хранения результатов по месяцам
    const monthlyScores: Record<number, number[]> = {};
    
    if (testResults && testResults.length > 0) {
      // Заполняем данные о результатах по месяцам
      testResults.forEach(result => {
        const date = new Date(result.created_at);
        const month = date.getMonth();
        
        if (!monthlyScores[month]) {
          monthlyScores[month] = [];
        }
        
        // Вычисляем процент правильных ответов
        const scorePercent = (result.score / result.total_questions) * 10;
        monthlyScores[month].push(scorePercent);
      });
    }
    
    // Преобразуем данные в формат для графика
    const data = monthNames.map((name, index) => {
      const scores = monthlyScores[index] || [];
      const avgScore = scores.length > 0 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
        : 0;
      
      return {
        name,
        value1: avgScore,
        isCurrentMonth: index === currentMonth && year === currentYear
      };
    });
    
    setChartData(data);
  }, [testResults, year]);
  
  // Определяем, нужно ли показывать будущие месяцы
  const currentYear = new Date().getFullYear();
  const shouldLimitToCurrentMonth = year === currentYear;
  const currentMonth = new Date().getMonth();
  
  // Фильтруем будущие месяцы если нужно
  const enhancedData = chartData
    .filter((_, index) => !shouldLimitToCurrentMonth || index <= currentMonth);

  // Обработчики для кнопок переключения года
  const handlePrevYear = () => setYear(year - 1);
  const handleNextYear = () => {
    if (year < currentYear) {
      setYear(year + 1);
    }
  };

  return (
    <Card className="shadow-sm border-none overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={handlePrevYear}
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="font-medium">{year}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={handleNextYear}
              disabled={year >= currentYear}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="h-64 mt-4 flex items-center justify-center">
            <p>Загрузка данных...</p>
          </div>
        ) : (
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enhancedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#888' }}
                />
                <YAxis hide domain={[0, 10]} />
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
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
