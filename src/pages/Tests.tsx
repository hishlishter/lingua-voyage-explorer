
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, Test } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Clock, FileText } from 'lucide-react';

const Tests = () => {
  const navigate = useNavigate();
  
  const { data: tests, isLoading } = useQuery({
    queryKey: ['tests'],
    queryFn: async (): Promise<Test[]> => {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .order('id');
      
      if (error) {
        console.error('Ошибка получения тестов:', error);
        throw error;
      }
      
      return data || [];
    }
  });
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Тесты</h1>
            
            <div className="mb-8">
              <p className="text-muted-foreground">
                Проверьте свой уровень знаний английского языка с помощью наших тестов.
                Каждый тест содержит вопросы разной сложности и помогает определить области,
                которые требуют дополнительного изучения.
              </p>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">Загрузка тестов...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests?.map((test) => (
                  <Card 
                    key={test.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/tests/${test.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <FileText size={24} className="text-primary" />
                      </div>
                      <CardTitle className="mb-2">{test.title}</CardTitle>
                      <CardDescription className="mb-4">{test.description}</CardDescription>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Clock size={16} className="mr-1" />
                        <span>10-15 минут</span>
                        <span className="mx-2">•</span>
                        <Award size={16} className="mr-1" />
                        <span>Средний</span>
                      </div>
                      
                      <Button className="w-full">Начать тест</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests;
