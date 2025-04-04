
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
  
  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error('Error in query function:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    // Skip loading states
    placeholderData: () => {
      if (user?.id) {
        return {
          id: user.id,
          name: user.user_metadata?.name || 'Пользователь',
          email: user.email || '',
          tests_completed: 0,
          courses_completed: 0
        } as Profile;
      }
      return null;
    },
  });

  const handleRetry = () => {
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
              isLoading={false} // Always disable loading state
              isError={isError}
              user={user}
              profile={profile}
              onRetry={handleRetry}
            />
            
            {user && (
              <Suspense fallback={null}>
                <Dashboard profile={profile || {
                  id: user.id,
                  name: user.user_metadata?.name || 'Пользователь',
                  email: user.email || '',
                  tests_completed: 0,
                  courses_completed: 0
                } as Profile} />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
