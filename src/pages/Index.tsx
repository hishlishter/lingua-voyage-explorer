
import React, { Suspense } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, Profile } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import ProfileLoadingStates from '@/components/ProfileLoadingStates';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user, ensureUserProfile } = useAuth();
  const queryClient = useQueryClient();
  
  // Create fallback profile for immediate display
  const fallbackProfile = user ? {
    id: user.id,
    name: user.user_metadata?.name || 'Пользователь',
    email: user.email || '',
    tests_completed: 0,
    courses_completed: 0,
    lessons_completed: 0 // Добавлено для полноты данных
  } as Profile : null;
  
  // Try to get profile from localStorage first
  const cachedProfile = React.useMemo(() => {
    if (!user?.id) return null;
    const cached = localStorage.getItem(`profile_${user.id}`);
    if (cached) {
      try {
        return JSON.parse(cached) as Profile;
      } catch (e) {
        console.error('Error parsing cached profile:', e);
      }
    }
    return null;
  }, [user?.id]);
  
  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;
      
      try {
        console.log('Index: Fetching profile for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Index: Error fetching profile:', error);
          
          // If profile doesn't exist, create one using the helper from AuthContext
          if (error.code === 'PGRST116') {
            console.log('Index: Profile not found, creating new profile');
            return ensureUserProfile(user);
          }
          
          throw error;
        }
        
        console.log('Index: Successfully fetched profile:', data);
        
        if (data) {
          localStorage.setItem(`profile_${user.id}`, JSON.stringify(data));
          return data;
        }
        
        return cachedProfile || fallbackProfile;
      } catch (error) {
        console.error('Index: Error in query function:', error);
        return cachedProfile || fallbackProfile;
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: cachedProfile || fallbackProfile,
    refetchInterval: false
  });

  // Предварительная загрузка данных для тестов и уроков, чтобы они были доступны в Dashboard
  React.useEffect(() => {
    if (user?.id) {
      // Предзагрузка результатов тестов
      queryClient.prefetchQuery({
        queryKey: ['testResultsAll', user.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('test_results')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Error prefetching test results:', error);
            return [];
          }
          
          return data || [];
        }
      });
      
      // Предзагрузка прогресса по урокам
      queryClient.prefetchQuery({
        queryKey: ['lessonProgressAll', user.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Error prefetching lesson progress:', error);
            return [];
          }
          
          return data || [];
        }
      });
    }
  }, [user?.id, queryClient]);

  const handleRetry = async () => {
    if (!user) return;
    
    try {
      // Try to create profile with ensureUserProfile
      const newProfile = await ensureUserProfile(user);
      
      if (newProfile) {
        queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
        refetch();
      }
    } catch (error) {
      console.error('Error in retry handler:', error);
    }
  };

  // Always use the best available profile data
  const profileData = profile || cachedProfile || fallbackProfile;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <ProfileLoadingStates
              isLoading={isLoading}
              isError={isError}
              user={user}
              profile={profileData}
              onRetry={handleRetry}
            />
            
            {(user || profileData) && (
              <Suspense fallback={<div className="text-center py-4">Загрузка...</div>}>
                <Dashboard profile={profileData || fallbackProfile} />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
