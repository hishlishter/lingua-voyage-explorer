import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface ProgressChartProps {
  title: string;
  year: number;
  className?: string; // Added className prop as optional
}

interface MonthlyScore {
  name: string;
  tests: number;
  lessons: number;
  isCurrentMonth: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 p-3 rounded-lg shadow-lg text-white text-sm">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name === 'tests' ? 'Тесты' : 'Уроки'}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const generateEmptyData = () => {
  const monthNames = [
    'Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь',
    'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'
  ];
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return monthNames.map((name, index) => ({
    name,
    tests: 0,
    lessons: 0,
    isCurrentMonth: index === currentMonth && currentYear === new Date().getFullYear()
  }));
};

const ProgressChart: React.FC<ProgressChartProps> = ({ title, year: initialYear, className }) => {
  const [year, setYear] = useState(initialYear);
  const { user } = useAuth();
  
  const { data: testResults, isLoading: isLoadingTests } = useQuery({
    queryKey: ['test-results', user?.id, year],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        // Сначала получаем все результаты тестов
        const { data, error } = await supabase
          .from('test_results')
          .select('*');
        
        if (error) {
          console.error('Error fetching test results:', error);
          return [];
        }
        
        // Затем фильтруем результаты по году вручную
        const filteredByYear = data?.filter(result => {
          if (!result.created_at) return false;
          
          try {
            const resultDate = new Date(result.created_at);
            return resultDate.getFullYear() === year;
          } catch (e) {
            console.error('Ошибка при обработке даты результата теста:', e);
            return false;
          }
        });
        
        return filteredByYear || [];
      } catch (error) {
        console.error('Error fetching test results:', error);
        return [];
      }
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 300000,
    retry: 1,
    placeholderData: [],
    refetchInterval: false
  });
  
  const { data: lessonResults, isLoading: isLoadingLessons } = useQuery({
    queryKey: ['lesson-progress', user?.id, year],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        // Получаем данные о прогрессе по урокам без фильтрации по дате
        const { data, error } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching lesson progress:', error);
          return [];
        }
        
        // Фильтруем результаты по году вручную
        const filteredByYear = data?.filter(result => {
          if (!result.created_at) return false;
          
          try {
            const resultDate = new Date(result.created_at);
            return resultDate.getFullYear() === year;
          } catch (e) {
            console.error('Ошибка при обработке даты прогресса урока:', e);
            return false;
          }
        });
        
        return filteredByYear || [];
      } catch (error) {
        console.error('Error fetching lesson progress:', error);
        return [];
      }
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 300000,
    retry: 1,
    placeholderData: [],
    refetchInterval: false
  });
  
  const [chartData, setChartData] = useState<MonthlyScore[]>(generateEmptyData());
  
  useEffect(() => {
    const monthNames = [
      'Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь',
      'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'
    ];
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTestScores: Record<number, number> = {};
    const monthlyLessonScores: Record<number, number> = {};
    
    if (testResults && testResults.length > 0) {
      testResults.forEach(result => {
        if (!result.created_at) return;
        
        try {
          const date = new Date(result.created_at);
          const month = date.getMonth();
          
          if (!monthlyTestScores[month]) {
            monthlyTestScores[month] = 0;
          }
          
          // Считаем тест полностью пройденным, если это совершенный результат
          if (result.is_perfect_score) {
            monthlyTestScores[month] += 1;
          }
        } catch (e) {
          console.error('Ошибка при обработке даты результата теста:', e);
        }
      });
    }
    
    if (lessonResults && lessonResults.length > 0) {
      lessonResults.forEach(result => {
        if (!result.created_at) return;
        
        try {
          const date = new Date(result.created_at);
          const month = date.getMonth();
          
          if (!monthlyLessonScores[month]) {
            monthlyLessonScores[month] = 0;
          }
          
          monthlyLessonScores[month] += 1;
        } catch (e) {
          console.error('Ошибка при обработке даты прогресса урока:', e);
        }
      });
    }
    
    const data = monthNames.map((name, index) => {
      const testCount = monthlyTestScores[index] || 0;
      const lessonCount = monthlyLessonScores[index] || 0;
      
      return {
        name,
        tests: testCount,
        lessons: lessonCount,
        isCurrentMonth: index === currentMonth && year === currentYear
      };
    });
    
    setChartData(data);
  }, [testResults, lessonResults, year]);
  
  const currentYear = new Date().getFullYear();
  const shouldLimitToCurrentMonth = year === currentYear;
  const currentMonth = new Date().getMonth();
  
  const enhancedData = chartData
    .filter((_, index) => !shouldLimitToCurrentMonth || index <= currentMonth);

  const handlePrevYear = () => setYear(year - 1);
  const handleNextYear = () => {
    if (year < currentYear) {
      setYear(year + 1);
    }
  };

  return (
    <Card className={`shadow-sm border-none overflow-hidden ${className || ''}`}>
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
              <Legend 
                payload={[
                  { value: 'Тесты', type: 'line', color: '#B794F4' },
                  { value: 'Уроки', type: 'line', color: '#F687B3' }
                ]}
                verticalAlign="top"
                height={36}
              />
              <Line 
                type="monotone" 
                dataKey="tests" 
                name="tests"
                stroke="#B794F4" 
                strokeWidth={3} 
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  
                  if (payload && payload.isCurrentMonth) {
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
                          {payload.tests}
                        </text>
                      </g>
                    );
                  }
                  
                  return null;
                }}
                activeDot={{ r: 6, fill: '#B794F4', stroke: '#fff', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="lessons" 
                name="lessons"
                stroke="#F687B3" 
                strokeWidth={3} 
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  
                  if (payload && payload.isCurrentMonth) {
                    return (
                      <g>
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={6} 
                          fill="#F687B3" 
                          stroke="#fff" 
                          strokeWidth={2}
                        />
                        <text 
                          x={cx} 
                          y={cy - 30} 
                          textAnchor="middle" 
                          fill="#333" 
                          fontSize="12" 
                          fontWeight="bold"
                        >
                          {payload.lessons}
                        </text>
                      </g>
                    );
                  }
                  
                  return null;
                }}
                activeDot={{ r: 6, fill: '#F687B3', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
