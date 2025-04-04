
import React, { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, Profile } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import ProfileLoadingStates from '@/components/ProfileLoadingStates';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  // Создаем объект-заглушку для мгновенного отображения
  const fallbackProfile = user ? {
    id: user.id,
    name: user.user_metadata?.name || 'Пользователь',
    email: user.email || '',
    tests_completed: 0,
    courses_completed: 0
  } as Profile : null;
  
  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;
      
      try {
        console.log('Fetching profile for user:', user.id);
        // Используем кеш-первую стратегию
        const cachedProfile = localStorage.getItem(`profile_${user.id}`);
        if (cachedProfile) {
          console.log('Using cached profile data');
          return JSON.parse(cachedProfile) as Profile;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        // Кешируем данные профиля в localStorage
        if (data) {
          localStorage.setItem(`profile_${user.id}`, JSON.stringify(data));
        }
        
        return data;
      } catch (error) {
        console.error('Error in query function:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 300000, // Увеличиваем время кеширования до 5 минут
    refetchOnWindowFocus: false,
    placeholderData: fallbackProfile, // Используем заглушку немедленно
  });

  const handleRetry = () => {
    // Очищаем кеш при повторной попытке
    if (user?.id) {
      localStorage.removeItem(`profile_${user.id}`);
    }
    refetch();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <ProfileLoadingStates
              isLoading={false} // Всегда отключаем состояние загрузки
              isError={isError}
              user={user}
              profile={profile}
              onRetry={handleRetry}
            />
            
            {user && (
              <Suspense fallback={null}>
                <Dashboard profile={profile || fallbackProfile} />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
