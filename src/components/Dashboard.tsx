
import React from 'react';
import UserProfile from '@/components/UserProfile';
import ProgressChart from '@/components/ProgressChart';
import { Profile } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses, fetchCourseProgress } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen } from 'lucide-react';

interface DashboardProps {
  profile: Profile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const isMobile = useIsMobile();
  
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

  // Подсчитываем общее количество пройденных уроков
  const totalCompletedLessons = React.useMemo(() => {
    if (!courseProgressData) return 0;
    
    return courseProgressData.reduce((total, progress) => {
      if (!progress) return total;
      return total + (progress.lessons_completed || 0);
    }, 0);
  }, [courseProgressData]);
  
  return (
    <>
      <UserProfile />
      
      <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-6`}>
        <ProgressChart 
          title="Прогресс обучения" 
          year={new Date().getFullYear()} 
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Ваши достижения
            </CardTitle>
            <CardDescription>
              Информация о вашем прогрессе в обучении за сегодня
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Пройдено уроков за сегодня</span>
                </div>
                <span className="text-lg font-bold">{totalCompletedLessons}</span>
              </div>
              
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium">Пройдено тестов за сегодня</span>
                </div>
                <span className="text-lg font-bold">{profile.tests_completed || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
