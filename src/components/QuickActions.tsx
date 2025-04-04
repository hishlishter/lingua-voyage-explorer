
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface QuickActionProps {
  title: string;
  subtitle: string;
  icon: string;
  to: string;
}

const QuickActionCard: React.FC<QuickActionProps> = ({ title, subtitle, icon, to }) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="shadow-sm hover:shadow transition-shadow border-none cursor-pointer"
      onClick={() => navigate(to)}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-pink-100 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const QuickActions = () => {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Быстрый старт</h2>
      </div>
      
      <div className="space-y-4">
        <QuickActionCard 
          title="Тест" 
          subtitle="Проверь свои знания" 
          icon="🎓"
          to="/tests"
        />
        <QuickActionCard 
          title="Словари" 
          subtitle="Изучай новые слова" 
          icon="📚"
          to="/dictionary"
        />
        <QuickActionCard 
          title="Курсы" 
          subtitle="Начни обучение" 
          icon="📁"
          to="/courses"
        />
      </div>
    </div>
  );
};

export default QuickActions;
