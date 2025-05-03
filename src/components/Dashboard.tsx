
import React, { useEffect } from 'react';
import UserProfile from '@/components/UserProfile';
import ProgressChart from '@/components/ProgressChart';
import { Profile } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { fetchTestResults } from '@/lib/supabase';
import { fetchUserLessonProgress } from '@/lib/supabase-lessons';

interface DashboardProps {
  profile: Profile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
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

  // Получаем данные о прогрессе по урокам
  const { data: lessonProgress } = useQuery({
    queryKey: ['lessonProgressAll', profile.id],
    queryFn: async () => {
      if (!profile.id) return [];
      
      return fetchUserLessonProgress(profile.id);
    },
    enabled: !!profile.id,
    staleTime: 300000,
  });
  
  // Подсчитываем общее количество пройденных уроков
  const totalCompletedLessons = React.useMemo(() => {
    if (!lessonProgress || lessonProgress.length === 0) {
      return profile.lessons_completed || 0;
    }
    
    const completedLessons = lessonProgress.filter(progress => progress.is_completed === true);
    return completedLessons.length || profile.lessons_completed || 0;
  }, [lessonProgress, profile.lessons_completed]);
  
  // Подсчитываем общее количество пройденных тестов (где is_perfect_score === true)
  const totalCompletedTests = React.useMemo(() => {
    if (!testResults || testResults.length === 0) {
      return profile.tests_completed || 0;
    }
    
    const perfectScoreTests = testResults.filter(result => {
      // Проверяем два условия для определения пройденного теста:
      // 1. is_perfect_score === true ИЛИ 
      // 2. score равен total_questions (все ответы верные)
      return result.is_perfect_score === true || 
             (result.score && result.total_questions && result.score === result.total_questions);
    });
    
    return perfectScoreTests.length || profile.tests_completed || 0;
  }, [testResults, profile.tests_completed]);

  // Логирование для отладки
  useEffect(() => {
    console.log('Dashboard: Profile data:', profile);
    console.log('Dashboard: Test results:', testResults);
    console.log('Dashboard: Lesson progress:', lessonProgress);
    console.log('Dashboard: Total completed lessons:', totalCompletedLessons);
    console.log('Dashboard: Total completed tests:', totalCompletedTests);
  }, [profile, testResults, lessonProgress, totalCompletedLessons, totalCompletedTests]);
  
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
