
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
  className?: string;
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
  
  // Получение всех результатов тестов, не только для lesson_tests, но и для обычных тестов
  const { data: testResults, isLoading: isLoadingTests } = useQuery({
    queryKey: ['all-test-results', user?.id, year],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        // Получаем результаты тестов
        const { data: testData, error: testError } = await supabase
          .from('test_results')
          .select('*')
          .eq('user_id', user.id);
        
        if (testError) {
          console.error('Error fetching test results:', testError);
          return [];
        }
        
        // Фильтруем по году
        const filteredTestResults = testData?.filter(result => {
          if (!result.created_at) return false;
          
          try {
            const resultDate = new Date(result.created_at);
            return resultDate.getFullYear() === year;
          } catch (e) {
            console.error('Ошибка при обработке даты результата теста:', e);
            return false;
          }
        }) || [];
        
        console.log('Filtered test results:', filteredTestResults);
        return filteredTestResults;
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
        // Получаем данные о прогрессе по урокам
        const { data, error } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching lesson progress:', error);
          return [];
        }
        
        // Фильтруем результаты по году
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
        
        console.log('Filtered lesson results:', filteredByYear);
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
  
  // Обновление данных для графика при изменении testResults или lessonResults
  useEffect(() => {
    console.log('Processing chart data with:', { testResults, lessonResults });
    
    const monthNames = [
      'Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь',
      'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'
    ];
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTestScores: Record<number, number> = {};
    const monthlyLessonScores: Record<number, number> = {};
    
    // Обработка результатов тестов
    if (testResults && testResults.length > 0) {
      console.log(`Processing ${testResults.length} test results`);
      testResults.forEach(result => {
        if (!result.created_at) return;
        
        try {
          const date = new Date(result.created_at);
          const month = date.getMonth();
          
          if (!monthlyTestScores[month]) {
            monthlyTestScores[month] = 0;
          }
          
          // Считаем тест полностью пройденным если is_perfect_score равно true или score равен total_questions
          if (result.is_perfect_score === true || (result.score && result.total_questions && result.score === result.total_questions)) {
            monthlyTestScores[month] += 1;
            console.log(`Added test for month ${month}, score now: ${monthlyTestScores[month]}`);
          }
        } catch (e) {
          console.error('Ошибка при обработке даты результата теста:', e);
        }
      });
    }
    
    // Обработка прогресса по урокам
    if (lessonResults && lessonResults.length > 0) {
      console.log(`Processing ${lessonResults.length} lesson results`);
      lessonResults.forEach(result => {
        if (!result.created_at) return;
        
        try {
          const date = new Date(result.created_at);
          const month = date.getMonth();
          
          if (!monthlyLessonScores[month]) {
            monthlyLessonScores[month] = 0;
          }
          
          // Считаем урок пройденным, если есть отметка о его завершении (is_completed)
          if (result.is_completed === true) {
            monthlyLessonScores[month] += 1;
            console.log(`Added lesson for month ${month}, score now: ${monthlyLessonScores[month]}`);
          }
        } catch (e) {
          console.error('Ошибка при обработке даты прогресса урока:', e);
        }
      });
    }
    
    // Формируем данные для графика
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
    
    console.log('Final chart data:', data);
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

  // Расчет максимального значения для Y оси, чтобы график всегда выглядел хорошо
  const maxTestValue = Math.max(...chartData.map(d => d.tests), 1);
  const maxLessonValue = Math.max(...chartData.map(d => d.lessons), 1);
  const maxValue = Math.max(maxTestValue, maxLessonValue);
  const yDomain = [0, maxValue > 0 ? Math.max(5, maxValue + 2) : 5];

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
              <YAxis 
                hide 
                domain={yDomain} 
              />
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
                  
                  if ((payload && payload.tests > 0) || (payload && payload.isCurrentMonth)) {
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
                        {payload.tests > 0 && (
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
                        )}
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
                  
                  if ((payload && payload.lessons > 0) || (payload && payload.isCurrentMonth)) {
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
                        {payload.lessons > 0 && (
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
                        )}
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
