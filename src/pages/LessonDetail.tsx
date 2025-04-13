
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { fetchLessonWithTest } from '@/lib/supabase-lessons';
import { saveLessonProgress } from '@/lib/lesson-helpers';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { toast } from "sonner";

const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('theory');
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  
  // Получаем урок из базы данных
  const { data, isLoading, error } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => fetchLessonWithTest(Number(id)),
    staleTime: 600000, // 10 минут кэширования
    enabled: !!id
  });
  
  const lesson = data?.lesson;
  
  // Мутация для сохранения прогресса урока
  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      if (!user || !id) return false;
      
      const success = await saveLessonProgress(
        user.id,
        Number(id),
        true
      );
      
      if (!success) {
        throw new Error('Не удалось сохранить прогресс');
      }
      
      return success;
    },
    onSuccess: () => {
      // Инвалидируем кэши запросов для обновления данных
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      setIsLessonCompleted(true);
      toast.success('Урок успешно завершен!', {
        description: 'Вы можете продолжить обучение.'
      });
    },
    onError: (error) => {
      console.error('Ошибка сохранения прогресса:', error);
      toast.error('Не удалось завершить урок');
    }
  });
  
  // Сохраняем прогресс в localStorage для неавторизованных пользователей
  const saveLocalProgress = (lessonId: number) => {
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
      
      setIsLessonCompleted(true);
    } catch (error) {
      console.error('Ошибка при сохранении прогресса урока:', error);
    }
  };
  
  // Обработчик завершения урока
  const handleCompleteLesson = () => {
    if (user && id) {
      completeLessonMutation.mutate();
    } else {
      // Для неавторизованных пользователей сохраняем в localStorage
      if (id) {
        saveLocalProgress(Number(id));
        toast.success("Урок успешно завершен!", {
          description: "Вы можете продолжить обучение."
        });
      }
    }
  };
  
  // Проверяем, завершен ли уже урок при загрузке
  useEffect(() => {
    if (id) {
      // Для неавторизованных пользователей проверяем localStorage
      if (!user) {
        try {
          const storedCompletedLessons = localStorage.getItem('completedLessons');
          if (storedCompletedLessons) {
            const completedLessons = JSON.parse(storedCompletedLessons);
            setIsLessonCompleted(completedLessons.includes(Number(id)));
          }
        } catch (error) {
          console.error('Ошибка при проверке завершенных уроков:', error);
        }
      }
    }
  }, [id, user]);
  
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
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                
                <div className="mt-8 border-t pt-6">
                  <Button 
                    onClick={handleCompleteLesson}
                    className={`w-full ${isLessonCompleted ? "bg-green-600 hover:bg-green-700" : ""}`}
                    disabled={isLessonCompleted || completeLessonMutation.isPending}
                  >
                    {completeLessonMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : isLessonCompleted ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Урок завершен
                      </>
                    ) : (
                      "Завершить урок"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonDetail;
