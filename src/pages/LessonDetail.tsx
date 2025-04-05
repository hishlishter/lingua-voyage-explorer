
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { fetchLessonWithTest, saveLessonTestResult } from '@/lib/supabase-lessons';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, CheckCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from "sonner";
import TestResult from '@/components/TestResult';

const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('theory');
  
  // State для теста
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [showTestResult, setShowTestResult] = useState(false);
  const [isPerfectScore, setIsPerfectScore] = useState(false);
  
  // Получаем урок и тест из базы данных
  const { data, isLoading, error } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => fetchLessonWithTest(Number(id)),
    staleTime: 600000, // 10 минут кэширования
    enabled: !!id
  });
  
  const lesson = data?.lesson;
  const test = data?.test;
  const questions = test?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  
  // Мутация для сохранения результатов теста
  const saveResultMutation = useMutation({
    mutationFn: async (result: { 
      user_id: string; 
      lesson_id: number; 
      score: number; 
      total_questions: number 
    }) => {
      const success = await saveLessonTestResult(
        result.user_id,
        result.lesson_id,
        result.score,
        result.total_questions
      );
      
      if (!success) {
        throw new Error('Не удалось сохранить результаты');
      }
      
      return success;
    },
    onSuccess: () => {
      // Инвалидируем кэши запросов для обновления данных
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      toast.success('Результаты сохранены');
    },
    onError: (error) => {
      console.error('Ошибка сохранения результатов:', error);
      toast.error('Не удалось сохранить результаты');
    }
  });
  
  // Сохраняем прогресс в localStorage для неавторизованных пользователей
  const saveLocalProgress = (lessonId: number, isPerfect: boolean) => {
    if (!isPerfect) return;
    
    try {
      const storedCompletedLessons = localStorage.getItem('completedLessons');
      let completedLessons: number[] = [];
      
      if (storedCompletedLessons) {
        completedLessons = JSON.parse(storedCompletedLessons);
      }
      
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
      }
    } catch (error) {
      console.error('Ошибка при сохранении прогресса урока:', error);
    }
  };
  
  // Обработчик выбора ответа
  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };
  
  // Переход к следующему вопросу
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  // Переход к предыдущему вопросу
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Отправка теста и подсчет результатов
  const handleSubmitTest = () => {
    if (!test || !questions.length) return;
    
    let score = 0;
    questions.forEach(question => {
      const selectedOptionId = selectedAnswers[question.id];
      if (selectedOptionId) {
        const correctOption = question.options?.find(option => option.is_correct);
        if (correctOption && correctOption.id.toString() === selectedOptionId) {
          score++;
        }
      }
    });
    
    setTestScore(score);
    setIsTestSubmitted(true);
    setShowTestResult(true);
    
    const isPerfect = score === questions.length;
    setIsPerfectScore(isPerfect);
    
    // Сохраняем результаты теста
    if (user && id) {
      saveResultMutation.mutate({
        user_id: user.id,
        lesson_id: Number(id),
        score: score,
        total_questions: questions.length
      });
    } else {
      // Для неавторизованных пользователей сохраняем в localStorage
      if (id) {
        saveLocalProgress(Number(id), isPerfect);
        
        if (isPerfect) {
          toast.success("Урок успешно завершен!", {
            description: "Вы прошли тест на 100% и можете продолжить обучение."
          });
        }
      }
    }
  };
  
  // Сброс теста для повторного прохождения
  const handleResetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsTestSubmitted(false);
  };
  
  // Закрытие результатов теста
  const handleCloseTestResult = () => {
    setShowTestResult(false);
  };
  
  // Отображение вопроса с вариантами ответов
  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    const selectedOptionId = selectedAnswers[currentQuestion.id];
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
        <div className="space-y-2">
          {currentQuestion.options?.map(option => {
            const isSelected = selectedOptionId === option.id.toString();
            const isCorrect = option.is_correct;
            let optionClass = "p-4 border rounded-md cursor-pointer hover:bg-gray-50";
            
            if (isTestSubmitted) {
              if (isCorrect) {
                optionClass = "p-4 border rounded-md bg-green-50 border-green-200";
              } else if (isSelected && !isCorrect) {
                optionClass = "p-4 border rounded-md bg-red-50 border-red-200";
              }
            } else if (isSelected) {
              optionClass = "p-4 border rounded-md bg-primary/10 border-primary";
            }
            
            return (
              <div 
                key={option.id}
                className={optionClass}
                onClick={() => !isTestSubmitted && handleAnswerSelect(currentQuestion.id.toString(), option.id.toString())}
              >
                <div className="flex items-center justify-between">
                  <div>{option.text}</div>
                  {isTestSubmitted && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (isSelected && !isCorrect ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : null)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Если урок не найден или загружается
  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Загрузка урока..." />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="container mx-auto flex justify-center items-center h-full">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Загрузка данных урока...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (error || !lesson) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Урок не найден" />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="container mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">Урок не найден</h2>
                    <p className="text-muted-foreground mb-6">
                      Запрашиваемый урок не существует или был удален
                    </p>
                    <Button onClick={() => navigate('/lessons')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Вернуться к списку уроков
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={lesson.title} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="container mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={() => navigate('/lessons')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к урокам
              </Button>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {lesson.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue="theory" 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="theory">Теория</TabsTrigger>
                    <TabsTrigger value="practice">Тест</TabsTrigger>
                  </TabsList>
                  <TabsContent value="theory">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                    
                    <div className="mt-8 border-t pt-6">
                      <Button 
                        onClick={() => setActiveTab('practice')}
                        className="w-full"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        ПРОЙТИ ТЕСТ
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="practice">
                    {test ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">{test.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            Вопрос {currentQuestionIndex + 1} из {questions.length}
                          </div>
                        </div>
                        
                        {renderQuestion()}
                        
                        <div className="flex justify-between mt-6 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0 || isTestSubmitted}
                          >
                            Предыдущий
                          </Button>
                          
                          <div className="space-x-2">
                            {isTestSubmitted ? (
                              <Button 
                                onClick={handleResetTest}
                                variant="outline"
                              >
                                Пройти снова
                              </Button>
                            ) : (
                              <>
                                {currentQuestionIndex < questions.length - 1 ? (
                                  <Button 
                                    onClick={handleNextQuestion}
                                    disabled={!selectedAnswers[currentQuestion?.id.toString()]}
                                  >
                                    Следующий
                                  </Button>
                                ) : (
                                  <Button 
                                    onClick={handleSubmitTest}
                                    disabled={Object.keys(selectedAnswers).length < questions.length}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Завершить тест
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground p-8">
                        <p className="mb-4">Тест для этого урока отсутствует.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Test results dialog */}
            {test && (
              <TestResult
                open={showTestResult}
                onClose={handleCloseTestResult}
                score={testScore}
                totalQuestions={questions.length}
                testTitle={test.title}
                isPerfectScore={isPerfectScore}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonDetail;
