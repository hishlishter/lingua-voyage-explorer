
import React, { useEffect } from 'react';
import UserProfile from '@/components/UserProfile';
import ProgressChart from '@/components/ProgressChart';
import { Profile } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { fetchTestResults } from '@/lib/supabase';

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

  // Подсчитываем общее количество пройденных уроков из профиля
  const totalCompletedLessons = profile.lessons_completed || 0;
  
  // Подсчитываем общее количество пройденных тестов (где is_perfect_score === true)
  const totalCompletedTests = React.useMemo(() => {
    if (!testResults) return profile.tests_completed || 0;
    
    const perfectScoreTests = testResults.filter(result => result.is_perfect_score === true);
    return perfectScoreTests.length || profile.tests_completed || 0;
  }, [testResults, profile.tests_completed]);

  // Логирование для отладки
  useEffect(() => {
    console.log('Dashboard: Profile data:', profile);
    console.log('Dashboard: Test results:', testResults);
    console.log('Dashboard: Total completed lessons:', totalCompletedLessons);
    console.log('Dashboard: Total completed tests:', totalCompletedTests);
  }, [profile, testResults, totalCompletedLessons, totalCompletedTests]);
  
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
