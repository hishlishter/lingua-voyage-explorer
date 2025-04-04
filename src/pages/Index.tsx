
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
  
  // Create fallback profile for immediate display
  const fallbackProfile = user ? {
    id: user.id,
    name: user.user_metadata?.name || 'Пользователь',
    email: user.email || '',
    tests_completed: 0,
    courses_completed: 0
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
        console.log('Fetching profile for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          // If we have a cached profile, use it instead of fallback
          return cachedProfile || fallbackProfile;
        }
        
        // Cache the profile data
        if (data) {
          console.log('Caching profile data:', data);
          localStorage.setItem(`profile_${user.id}`, JSON.stringify(data));
          return data;
        }
        
        return cachedProfile || fallbackProfile;
      } catch (error) {
        console.error('Error in query function:', error);
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

  const handleRetry = () => {
    // Clear cache when retrying
    if (user?.id) {
      localStorage.removeItem(`profile_${user.id}`);
    }
    refetch();
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
              isLoading={false}
              isError={isError}
              user={user}
              profile={profileData}
              onRetry={handleRetry}
            />
            
            {user && (
              <Suspense fallback={<div className="text-center py-4">Загрузка...</div>}>
                <Dashboard profile={profileData} />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
