
import React, { useState } from 'react';
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
import { BookOpen, ChevronDown, ChevronUp, FileText, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { fetchCourseWithLessons, fetchCourseProgress, updateCourseProgress, Course, Lesson } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);

  // Загрузка курса с уроками
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourseWithLessons(id || ''),
    enabled: !!id,
  });

  // Загрузка прогресса пользователя по курсу
  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['courseProgress', id, user?.id],
    queryFn: () => fetchCourseProgress(user?.id || '', id || ''),
    enabled: !!id && !!user?.id,
  });

  // Обработчик выбора урока
  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLessonId(lesson.id);
    
    // Автоматическое открытие выбранного урока в аккордеоне
    setOpenLessonId(lesson.id);
    
    if (user?.id) {
      // Просчитываем количество пройденных уроков
      const lessons = course?.lessons || [];
      const currentLessonIndex = lessons.findIndex(l => l.id === lesson.id);
      
      // Считаем урок пройденным, если это последний урок в курсе
      const isLastLesson = currentLessonIndex === lessons.length - 1;
      const lessonsCompleted = Math.max(
        currentLessonIndex + 1,
        progress?.lessons_completed || 0
      );
      
      // Обновляем прогресс прохождения курса
      updateCourseProgress(
        user.id,
        id || '',
        lesson.id,
        lessonsCompleted,
        isLastLesson
      ).then(success => {
        if (success && isLastLesson) {
          toast({
            title: "Поздравляем!",
            description: "Вы успешно завершили курс!",
          });
        }
      });
    }
  };

  // Получаем текущий урок
  const currentLesson = selectedLessonId && course?.lessons
    ? course.lessons.find(lesson => lesson.id === selectedLessonId)
    : null;
  
  // Выбираем первый урок по умолчанию или последний просмотренный
  React.useEffect(() => {
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
                        const isCompleted = progress && progress.lessons_completed >= index + 1;
                        
                        return (
                          <Collapsible 
                            key={lesson.id}
                            open={openLessonId === lesson.id}
                            onOpenChange={(open) => {
                              setOpenLessonId(open ? lesson.id : null);
                            }}
                            className="border rounded-md"
                          >
                            <CollapsibleTrigger asChild>
                              <div 
                                className={`flex items-center justify-between p-3 cursor-pointer ${
                                  selectedLessonId === lesson.id ? 'bg-primary/10' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCompleted ? (
                                    <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                      <Check className="h-3 w-3" />
                                    </div>
                                  ) : (
                                    <div className="h-5 w-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
                                      {index + 1}
                                    </div>
                                  )}
                                  <span className="font-medium">{lesson.title}</span>
                                </div>
                                {openLessonId === lesson.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-3 pt-0 border-t">
                              <div className="text-sm text-muted-foreground mb-3">
                                Краткий обзор содержания урока.
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => handleSelectLesson(lesson)}
                              >
                                {selectedLessonId === lesson.id ? 'Сейчас изучается' : 'Изучить урок'}
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
                      <Tabs defaultValue="theory" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="theory">Теория</TabsTrigger>
                          <TabsTrigger value="practice">Практика</TabsTrigger>
                        </TabsList>
                        <TabsContent value="theory">
                          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                        </TabsContent>
                        <TabsContent value="practice">
                          <div className="text-center text-muted-foreground p-8">
                            <p className="mb-4">Практические задания будут добавлены в ближайшее время.</p>
                            <Button disabled variant="outline">Пройти тест</Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;
