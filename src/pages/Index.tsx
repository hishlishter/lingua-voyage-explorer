
import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import UserProfile from '@/components/UserProfile';
import WordSets from '@/components/WordSets';
import ProgressChart from '@/components/ProgressChart';
import QuickActions from '@/components/QuickActions';

const progressData = [
  { name: 'Январь', value1: 2.5, value2: 3.2, value3: 3.8 },
  { name: 'Февраль', value1: 3.1, value2: 2.8, value3: 4.1 },
  { name: 'Март', value1: 3.8, value2: 2.3, value3: 4.5 },
  { name: 'Апрель', value1: 4.2, value2: 1.8, value3: 4.2 },
  { name: 'Май', value1: 4.5, value2: 2.2, value3: 3.9 },
  { name: 'Июнь', value1: 4.3, value2: 2.8, value3: 3.5 },
  { name: 'Июль', value1: 4.1, value2: 3.5, value3: 3.2 },
  { name: 'Август', value1: 3.8, value2: 4.0, value3: 3.0 },
  { name: 'Сентябрь', value1: 3.5, value2: 4.5, value3: 3.3 },
  { name: 'Октябрь', value1: 3.2, value2: 4.3, value3: 3.6 },
  { name: 'Ноябрь', value1: 3.0, value2: 4.0, value3: 4.0 },
  { name: 'Декабрь', value1: 2.8, value2: 3.8, value3: 4.4 },
];

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <WordSets title="Наборы слов" />
              <ProgressChart 
                title="Прогресс" 
                year={2025} 
                data={progressData} 
              />
            </div>
            
            <div className="space-y-6">
              <UserProfile 
                name="Али Сарур" 
                email="vip.sarur@mail.ru" 
                lessonsCompleted={24} 
                coursesCompleted={1} 
              />
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
