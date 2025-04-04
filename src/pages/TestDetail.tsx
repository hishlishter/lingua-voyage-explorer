
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Question, Test } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import TestResult from '@/components/TestResult';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const TestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Получение информации о тесте
  const { data: test, isLoading } = useQuery({
    queryKey: ['test', id],
    queryFn: async (): Promise<Test | null> => {
      const { data, error } = await supabase
        .from('tests')
        .select('*, questions(*)')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Ошибка получения теста:', error);
        toast.error('Не удалось загрузить тест');
        return null;
      }
      
      return data;
    }
  });

  // Мутация для сохранения результатов теста
  const saveResultMutation = useMutation({
    mutationFn: async (result: { 
      user_id: string; 
      test_id: number; 
      score: number; 
      total_questions: number 
    }) => {
      // Сохраняем результат теста
      const { error: resultError } = await supabase
        .from('test_results')
        .insert([{
          user_id: result.user_id,
          test_id: result.test_id,
          score: result.score,
          total_questions: result.total_questions,
        }]);
      
      if (resultError) throw resultError;
      
      // Обновляем счетчик пройденных тестов в профиле
      const { data: profileData } = await supabase
        .from('profiles')
        .select('tests_completed')
        .eq('id', result.user_id)
        .single();
      
      if (profileData) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ tests_completed: (profileData.tests_completed || 0) + 1 })
          .eq('id', result.user_id);
        
        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      toast.success('Результаты сохранены');
    },
    onError: (error) => {
      console.error('Ошибка сохранения результатов:', error);
      toast.error('Не удалось сохранить результаты');
    }
  });

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (test?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Подсчет результатов
      let correctAnswers = 0;
      
      test?.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correct_option) {
          correctAnswers++;
        }
      });
      
      setScore(correctAnswers);
      setShowResults(true);
      
      // Сохраняем результаты
      if (user && test) {
        saveResultMutation.mutate({
          user_id: user.id,
          test_id: test.id,
          score: correctAnswers,
          total_questions: test.questions.length,
        });
      }
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    navigate('/tests');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-6 flex items-center justify-center">
            <div>Загрузка теста...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-6 flex items-center justify-center">
            <div>Тест не найден</div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/tests')}
                className="mb-4"
              >
                Назад к тестам
              </Button>
              <h1 className="text-3xl font-bold">{test.title}</h1>
              <p className="text-muted-foreground mt-2">{test.description}</p>
            </div>
            
            <div className="mb-4 text-sm">
              Вопрос {currentQuestionIndex + 1} из {test.questions.length}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>{currentQuestion.text}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={selectedAnswers[currentQuestionIndex]?.toString()} 
                  onValueChange={(value) => handleSelectAnswer(parseInt(value))}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  >
                    {currentQuestionIndex < test.questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {showResults && (
              <TestResult 
                open={showResults}
                onClose={handleCloseResults}
                score={score}
                totalQuestions={test.questions.length}
                testTitle={test.title}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetail;
