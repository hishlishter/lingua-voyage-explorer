
import React from 'react';
import UserProfile from '@/components/UserProfile';
import ProgressChart from '@/components/ProgressChart';
import QuickActions from '@/components/QuickActions';
import WordSets from '@/components/WordSets';
import { Profile } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardProps {
  profile: Profile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <UserProfile />
      
      <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-6`}>
        <ProgressChart 
          title="Прогресс обучения" 
          year={new Date().getFullYear()} 
        />
        <QuickActions />
      </div>
      
      <WordSets title="Словарные наборы" />
    </>
  );
};

export default Dashboard;
