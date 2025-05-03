
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTests, fetchTestResults, Test } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, Clock, FileText, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Tests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [completedTestIds, setCompletedTestIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Добавляем параметр refetch для обновления данных
  const { 
    data: tests, 
    isLoading, 
    error, 
    refetch: refetchTests 
  } = useQuery({
    queryKey: ['tests'],
    queryFn: fetchTests,
    staleTime: 300000, // 5 минут кэширования
    retry: 2,
    refetchOnWindowFocus: false
  });
  
  // Fetch test results if user is logged in
  const { data: testResults, refetch: refetchResults } = useQuery({
    queryKey: ['testResults', user?.id],
    queryFn: () => fetchTestResults(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 300000,
    retry: 2
  });

  // Функция для обновления данных
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchTests(), refetchResults()]);
      toast.success('Данные обновлены');
    } catch (err) {
      console.error('Ошибка при обновлении данных:', err);
      toast.error('Ошибка при обновлении данных');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Process test results to identify completed tests (with perfect score)
  useEffect(() => {
    if (testResults && tests) {
      // Определяем ID тестов, которые пройдены успешно
      // Тест считается пройденным, если:
      // 1. У него есть поле is_perfect_score = true
      // 2. ИЛИ количество правильных ответов равно общему количеству вопросов
      const completedIds = testResults.filter(result => {
        // Проверка на наличие поля is_perfect_score
        if (result.is_perfect_score === true) {
          return true;
        }
        
        // Fallback на проверку по подсчету баллов
        const test = tests.find(t => t.id === result.test_id);
        return test && result.score === result.total_questions;
      }).map(result => result.test_id);
      
      setCompletedTestIds(completedIds);
      console.log('Пройденные тесты:', completedIds);
    }
  }, [testResults, tests]);
  
  // Показываем ошибку если есть
  useEffect(() => {
    if (error) {
      console.error('Ошибка загрузки тестов:', error);
      toast.error('Не удалось загрузить тесты', {
        description: 'Пожалуйста, проверьте подключение к интернету и попробуйте снова'
      });
    }
  }, [error]);
  
  // Функция для проверки типа ошибки
  const isNetworkError = (error: any) => {
    return error?.message?.includes('Failed to fetch') || 
           error?.details?.includes('Failed to fetch');
  };

  // Компонент для отображения сетевой ошибки
  const NetworkErrorMessage = () => (
    <div className="text-center py-12 space-y-6">
      <div className="flex justify-center">
        <AlertTriangle size={64} className="text-amber-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800">Проблема с подключением</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Не удается соединиться с сервером. Проверьте ваше подключение к интернету и попробуйте снова.
      </p>
      <Button 
        onClick={handleRefresh} 
        disabled={isRefreshing}
        className="mt-4"
      >
        {isRefreshing ? (
          <>
            <RefreshCw size={16} className="mr-2 animate-spin" />
            Обновление...
          </>
        ) : (
          <>
            <RefreshCw size={16} className="mr-2" />
            Попробовать снова
          </>
        )}
      </Button>
    </div>
  );
  
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
              <div className="text-center py-12">
                <div className="inline-block animate-spin text-primary mb-4">
                  <RefreshCw size={40} />
                </div>
                <p>Загрузка тестов...</p>
              </div>
            ) : error ? (
              isNetworkError(error) ? (
                <NetworkErrorMessage />
              ) : (
                <div className="text-center py-12 text-red-500">
                  <AlertTriangle size={40} className="mx-auto mb-4" />
                  <p>Ошибка загрузки тестов. Пожалуйста, попробуйте позже.</p>
                  <Button 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    variant="outline"
                    className="mt-4"
                  >
                    {isRefreshing ? 'Обновление...' : 'Обновить'}
                  </Button>
                </div>
              )
            ) : tests && tests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => {
                  const isCompleted = completedTestIds.includes(test.id);
                  
                  return (
                    <Card 
                      key={test.id} 
                      className={`hover:shadow-md transition-shadow cursor-pointer ${
                        isCompleted ? 'border-green-200' : ''
                      }`}
                      onClick={() => navigate(`/tests/${test.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText size={24} className="text-primary" />
                          </div>
                          {isCompleted && (
                            <Badge className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Пройден
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="mb-2">{test.title}</CardTitle>
                        <CardDescription className="mb-4">{test.description}</CardDescription>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <Clock size={16} className="mr-1" />
                          <span>{test.time_limit} минут</span>
                          <span className="mx-2">•</span>
                          <Award size={16} className="mr-1" />
                          <span>{test.difficulty}</span>
                        </div>
                        
                        <Button className={isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}>
                          {isCompleted ? 'Пройти снова' : 'Начать тест'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="mb-4">Пока нет доступных тестов. Пожалуйста, зайдите позже.</p>
                <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
                  {isRefreshing ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Обновление...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} className="mr-2" />
                      Обновить
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests;
