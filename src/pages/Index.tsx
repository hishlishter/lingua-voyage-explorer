
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, Profile } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import UserProfile from '@/components/UserProfile';
import ProgressChart from '@/components/ProgressChart';
import QuickActions from '@/components/QuickActions';
import WordSets from '@/components/WordSets';
import { useAuth } from '@/context/AuthContext';

// Sample data for the progress chart
const progressData = [
  { name: 'Янв', value1: 4.5 },
  { name: 'Фев', value1: 5.3 },
  { name: 'Март', value1: 6.8 },
  { name: 'Апр', value1: 7.2 },
  { name: 'Май', value1: 6.5 },
  { name: 'Июнь', value1: 7.8 },
  { name: 'Июль', value1: 8.3 },
  { name: 'Авг', value1: 8.9 },
  { name: 'Сент', value1: 9.2 },
  { name: 'Окт', value1: 8.7 },
  { name: 'Нояб', value1: 9.5 },
  { name: 'Дек', value1: 9.8 },
];

const Index = () => {
  const { user } = useAuth();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {isLoading ? (
              <div className="text-center py-12">Загрузка...</div>
            ) : profile ? (
              <>
                <UserProfile />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProgressChart 
                    title="Прогресс обучения" 
                    year={new Date().getFullYear()} 
                    data={progressData}
                  />
                  <QuickActions />
                </div>
                
                <WordSets title="Словарные наборы" />
              </>
            ) : (
              <div className="text-center py-12">Профиль не найден</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
