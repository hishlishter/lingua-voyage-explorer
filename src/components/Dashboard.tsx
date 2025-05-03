
import React, { useEffect } from 'react';
import UserProfile from '@/components/UserProfile';
import ProgressChart from '@/components/ProgressChart';
import { Profile } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses, fetchCourseProgress, fetchTestResults } from '@/lib/supabase';

interface DashboardProps {
  profile: Profile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  // Получаем данные о курсах
  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    staleTime: 300000,
  });

  // Получаем данные о прогрессе по всем курсам
  const { data: courseProgressData } = useQuery({
    queryKey: ['courseProgressAll', profile.id],
    queryFn: async () => {
      if (!courses || !profile.id) return [];
      
      // Получаем прогресс для каждого курса
      const progressPromises = courses.map(course => 
        fetchCourseProgress(profile.id, course.id.toString())
      );
      
      return Promise.all(progressPromises);
    },
    enabled: !!courses && !!profile.id,
    staleTime: 300000,
  });
  
  // Получаем данные о пройденных тестах
  const { data: testResults } = useQuery({
    queryKey: ['testResultsAll', profile.id],
    queryFn: async () => {
      if (!profile.id) return [];
      
      return fetchTestResults(profile.id);
    },
    enabled: !!profile.id,
    staleTime: 300000,
  });

  // Подсчитываем общее количество пройденных уроков
  const totalCompletedLessons = React.useMemo(() => {
    if (!courseProgressData) return 0;
    
    return courseProgressData.reduce((total, progress) => {
      if (!progress) return total;
      
      // Получаем количество завершенных уроков из прогресса
      let completedLessonsCount = 0;
      
      if (progress.completed_lessons) {
        try {
          // Если completed_lessons это строка с JSON, парсим его
          const completedLessons = typeof progress.completed_lessons === 'string'
            ? JSON.parse(progress.completed_lessons)
            : progress.completed_lessons;
            
          // Если это массив, берем его длину
          if (Array.isArray(completedLessons)) {
            completedLessonsCount = completedLessons.length;
          }
        } catch (e) {
          console.error('Error parsing completed lessons:', e);
        }
      }
      
      return total + completedLessonsCount;
    }, 0);
  }, [courseProgressData]);
  
  // Подсчитываем общее количество пройденных тестов (где is_perfect_score === true)
  const totalCompletedTests = React.useMemo(() => {
    if (!testResults) return profile.tests_completed || 0;
    
    const perfectScoreTests = testResults.filter(result => result.is_perfect_score === true);
    return perfectScoreTests.length || profile.tests_completed || 0;
  }, [testResults, profile.tests_completed]);

  // Логирование для отладки
  useEffect(() => {
    console.log('Dashboard: Profile data:', profile);
    console.log('Dashboard: Course progress data:', courseProgressData);
    console.log('Dashboard: Test results:', testResults);
    console.log('Dashboard: Total completed lessons:', totalCompletedLessons);
    console.log('Dashboard: Total completed tests:', totalCompletedTests);
  }, [profile, courseProgressData, testResults, totalCompletedLessons, totalCompletedTests]);
  
  return (
    <>
      <UserProfile 
        totalCompletedLessons={totalCompletedLessons} 
        totalCompletedTests={totalCompletedTests}
      />
      
      <div className="w-full">
        <ProgressChart 
          title="Прогресс обучения" 
          year={new Date().getFullYear()} 
          className="w-full"
        />
      </div>
    </>
  );
};

export default Dashboard;
