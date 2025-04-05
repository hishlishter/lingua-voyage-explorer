import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Check, 
  ArrowLeft, 
  Loader2,
  CheckCircle2,
  XCircle,
  Edit3,
  Lock,
  CheckCircle 
} from 'lucide-react';
import { 
  fetchCourseWithLessons, 
  fetchCourseProgress, 
  updateCourseProgress, 
  fetchPracticeTestForLesson,  
  savePracticeTestResult, 
  Course, 
  Lesson, 
  PracticeTest, 
  PracticeQuestion 
} from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import TestResult from '@/components/TestResult';
import { toast as sonnerToast } from 'sonner';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('theory');
  
  // State for practice tests
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [showTestResult, setShowTestResult] = useState(false);
  const [isPerfectScore, setIsPerfectScore] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Загрузка курса с уроками
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourseWithLessons(id || ''),
    enabled: !!id,
  });

  // Загрузка прогресса пользователя по курсу
  const { data: progress, isLoading: isLoadingProgress, refetch: refetchProgress } = useQuery({
    queryKey: ['courseProgress', id, user?.id],
    queryFn: () => fetchCourseProgress(user?.id || '', id || ''),
    enabled: !!id && !!user?.id,
  });

  // Обработчик выбора урока
  const handleSelectLesson = (lesson: Lesson, index: number) => {
    // Проверяем, доступен ли урок для прохождения
    const previousLessonsCompleted = index === 0 || completedLessons.includes(course?.lessons[index - 1].id || '');
    
    if (!previousLessonsCompleted && user?.id) {
      toast({
        title: "Урок недоступен",
        description: "Сначала пройдите предыдущий урок",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedLessonId(lesson.id);
    setActiveTab('theory');
    setIsTestSubmitted(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    
    // Автоматическое открытие выбранного урока в аккордеоне
    setOpenLessonId(lesson.id);
    
    if (user?.id) {
      // Обновляем прогресс - отмечаем, что студент просмотрел урок
      updateCourseProgress(
        user.id,
        id || '',
        lesson.id,
        progress?.lessons_completed || 0,
        progress?.is_completed || false
      );
    }
  };

  // Получаем текущий урок
  const currentLesson = selectedLessonId && course?.lessons
    ? course.lessons.find(lesson => lesson.id === selectedLessonId)
    : null;
  
  // Получаем практический тест для текущего урока
  const currentPracticeTest = currentLesson?.practice_tests?.length 
    ? currentLesson.practice_tests[0] 
    : null;
  
  // Получаем текущий вопрос практического теста
  const currentQuestion = currentPracticeTest?.questions?.length && currentQuestionIndex < currentPracticeTest.questions.length
    ? currentPracticeTest.questions[currentQuestionIndex]
    : null;

  // Загружаем данные о пройденных уроках при загрузке страницы
  useEffect(() => {
    if (progress && progress.completed_lessons) {
      try {
        const completedLessonIds = typeof progress.completed_lessons === 'string' 
          ? JSON.parse(progress.completed_lessons) 
          : progress.completed_lessons;
        setCompletedLessons(completedLessonIds || []);
      } catch (e) {
        console.error('Error parsing completed lessons:', e);
        setCompletedLessons([]);
      }
    }
  }, [progress]);

  // Выбираем первый урок по умолчанию или последний просмотренный
  useEffect(() => {
    if (course?.lessons && course.lessons.length > 0 && !selectedLessonId) {
      if (progress?.last_lesson_id) {
        setSelectedLessonId(progress.last_lesson_id);
        setOpenLessonId(progress.last_lesson_id);
      } else {
        setSelectedLessonId(course.lessons[0].id);
        setOpenLessonId(course.lessons[0].id);
      }
    }
  }, [course, progress, selectedLessonId]);

  // Обработчик выбора ответа в тесте
  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Переход к следующему вопросу
  const handleNextQuestion = () => {
    if (currentPracticeTest?.questions && currentQuestionIndex < currentPracticeTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Переход к предыдущему вопросу
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Завершение теста и подсчет результатов
  const handleSubmitTest = async () => {
    if (!currentPracticeTest || !currentPracticeTest.questions) return;
    
    let score = 0;
    currentPracticeTest.questions.forEach(question => {
      const selectedOptionId = selectedAnswers[question.id];
      if (selectedOptionId) {
        const correctOption = question.options?.find(option => option.is_correct);
        if (correctOption && correctOption.id === selectedOptionId) {
          score++;
        }
      }
    });
    
    setTestScore(score);
    setIsTestSubmitted(true);
    setShowTestResult(true);
    
    const isPerfect = score === currentPracticeTest.questions.length;
    setIsPerfectScore(isPerfect);
    
    // Сохраняем результаты теста, если пользователь авторизован
    if (user?.id && currentPracticeTest.id) {
      await savePracticeTestResult(
        user.id, 
        currentPracticeTest.id, 
        score, 
        currentPracticeTest.questions.length
      );
      
      // Если все ответы верные, отмечаем урок как завершенный
      if (isPerfect && currentLesson) {
        // Получаем текущий список пройденных уроков
        let updatedCompletedLessons = [...completedLessons];
        
        // Добавляем урок в список пройденных, если его там еще нет
        if (!updatedCompletedLessons.includes(currentLesson.id)) {
          updatedCompletedLessons.push(currentLesson.id);
          setCompletedLessons(updatedCompletedLessons);
          
          // Считаем количество пройденных уроков
          const lessonsCompleted = updatedCompletedLessons.length;
          
          // Проверяем, завершен ли курс (все уроки пройдены)
          const isCompleted = lessonsCompleted === course?.lessons?.length;
          
          // Обновляем прогресс курса
          await updateCourseProgress(
            user.id,
            id || '',
            currentLesson.id,
            lessonsCompleted,
            isCompleted,
            true,
            updatedCompletedLessons
          );
          
          // Обновляем данные о прогрессе
          refetchProgress();
          
          sonnerToast("Урок успешно завершен!", {
            description: "Вы прошли тест на 100% и можете продолжить обучение."
          });
        }
      }
    }
  };

  // Сбросить тест для повторного прохождения
  const handleResetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsTestSubmitted(false);
  };

  // Закрыть окно с результатами теста
  const handleCloseTestResult = () => {
    setShowTestResult(false);
  };

  // Отображение загрузки
  if (isLoadingCourse) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Загрузка курса..." />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="container mx-auto">
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Если курс не найден
  if (!course) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Курс не найден" />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="container mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">Курс не найден</h2>
                    <p className="text-muted-foreground mb-6">
                      Запрашиваемый курс не существует или был удален
                    </p>
                    <Button onClick={() => navigate('/courses')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Вернуться к списку курсов
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

  // Рендеринг вопроса практического теста
  const renderPracticeQuestion = (question: PracticeQuestion) => {
    if (!question || !question.options) return null;
    
    const selectedOptionId = selectedAnswers[question.id];
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{question.text}</h3>
        <div className="space-y-2">
          {question.options.map(option => {
            const isSelected = selectedOptionId === option.id;
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
                onClick={() => !isTestSubmitted && handleAnswerSelect(question.id, option.id)}
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={course.title} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="container mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <Button variant="outline" onClick={() => navigate('/courses')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к курсам
              </Button>
              
              {!isLoadingProgress && progress && (
                <div className="text-sm text-muted-foreground">
                  Прогресс: {progress.lessons_completed}/{course.lessons?.length || 0} уроков
                </div>
              )}
            </div>
            
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Список уроков */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Содержание курса</CardTitle>
                    <CardDescription>
                      {course.lessons?.length || 0} уроков
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {course.lessons?.map((lesson, index) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        const isLocked = index > 0 && !completedLessons.includes(course.lessons[index - 1].id);
                        
                        return (
                          <Collapsible 
                            key={lesson.id}
                            open={openLessonId === lesson.id}
                            onOpenChange={(open) => {
                              setOpenLessonId(open ? lesson.id : null);
                            }}
                            className={`border rounded-md ${isCompleted ? 'border-green-200' : ''}`}
                          >
                            <CollapsibleTrigger asChild>
                              <div 
                                className={`flex items-center justify-between p-3 cursor-pointer ${
                                  selectedLessonId === lesson.id ? 'bg-primary/10' : ''
                                } ${isCompleted ? 'bg-green-50' : ''}`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCompleted ? (
                                    <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                      <Check className="h-3 w-3" />
                                    </div>
                                  ) : isLocked ? (
                                    <div className="h-5 w-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                      <Lock className="h-3 w-3" />
                                    </div>
                                  ) : (
                                    <div className="h-5 w-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
                                      {index + 1}
                                    </div>
                                  )}
                                  <span className="font-medium">{lesson.title}</span>
                                </div>
                                {isCompleted && (
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                )}
                                {openLessonId === lesson.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-3 pt-0 border-t">
                              <div className="text-sm text-muted-foreground mb-3">
                                {lesson.practice_tests?.length 
                                  ? "Включает теорию и тест для проверки знаний." 
                                  : "Содержит только теоретический материал."}
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => handleSelectLesson(lesson, index)}
                                disabled={isLocked && !!user?.id}
                                className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
                              >
                                {isLocked && user?.id ? 'Урок заблокирован' : 
                                  selectedLessonId === lesson.id ? 'Сейчас изучается' : 
                                  isCompleted ? 'Пройден' : 'Изучить урок'}
                              </Button>
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Содержание урока */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {currentLesson ? currentLesson.title : 'Выберите урок'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!currentLesson ? (
                      <div className="text-center text-muted-foreground">
                        Выберите урок из списка слева
                      </div>
                    ) : (
                      <Tabs 
                        defaultValue="theory" 
                        value={activeTab} 
                        onValueChange={setActiveTab}
                        className="w-full"
                      >
                        <TabsList className="mb-4">
                          <TabsTrigger value="theory">Теория</TabsTrigger>
                          <TabsTrigger 
                            value="practice"
                            disabled={!currentLesson.practice_tests?.length}
                          >
                            Тест
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="theory">
                          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                          
                          {currentLesson.practice_tests?.length > 0 && (
                            <div className="mt-8 border-t pt-6">
                              <Button 
                                onClick={() => setActiveTab('practice')}
                                className="w-full"
                              >
                                Перейти к тесту
                              </Button>
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="practice">
                          {!currentPracticeTest ? (
                            <div className="text-center text-muted-foreground p-8">
                              <p className="mb-4">Тест для этого урока отсутствует.</p>
                            </div>
                          ) : !currentQuestion ? (
                            <div className="text-center text-muted-foreground p-8">
                              <p className="mb-4">Нет доступных вопросов для этого теста.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">{currentPracticeTest.title}</h3>
                                <div className="text-sm text-muted-foreground">
                                  Вопрос {currentQuestionIndex + 1} из {currentPracticeTest.questions?.length || 0}
                                </div>
                              </div>
                              
                              {renderPracticeQuestion(currentQuestion)}
                              
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
                                      <Edit3 className="h-4 w-4 mr-2" />
                                      Пройти снова
                                    </Button>
                                  ) : (
                                    <>
                                      {currentQuestionIndex < (currentPracticeTest.questions?.length || 0) - 1 ? (
                                        <Button 
                                          onClick={handleNextQuestion}
                                          disabled={!selectedAnswers[currentQuestion.id]}
                                        >
                                          Следующий
                                        </Button>
                                      ) : (
                                        <Button 
                                          onClick={handleSubmitTest}
                                          disabled={!Object.keys(selectedAnswers).length || 
                                            Object.keys(selectedAnswers).length < (currentPracticeTest.questions?.length || 0)}
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
                          )}
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Диалог с результатами теста */}
            {currentPracticeTest && (
              <TestResult
                open={showTestResult}
                onClose={handleCloseTestResult}
                score={testScore}
                totalQuestions={currentPracticeTest.questions?.length ||.0}
                testTitle={currentPracticeTest.title}
                isPerfectScore={isPerfectScore}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;
