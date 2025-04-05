
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, GraduationCap, Play, Languages, CheckCircle } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';

const LessonSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-0">
      <div className="bg-primary/10 p-4 flex items-center">
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
          <Skeleton className="h-6 w-6" />
        </div>
        <div className="w-full">
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="p-4">
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex justify-end pt-2">
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Demo lessons with proper English language theories
const demoLessons = [
  {
    id: '1',
    title: 'Английский алфавит и фонетика',
    description: 'В этом уроке вы изучите английский алфавит, основные правила произношения и фонетические символы. Вы научитесь правильно произносить гласные и согласные звуки.',
    duration: '30 минут',
    level: 'Начальный',
    icon: <Languages className="h-6 w-6" />,
    completed: false
  },
  {
    id: '2',
    title: 'Present Simple (Настоящее простое время)',
    description: 'Изучите правила образования и использования времени Present Simple. Узнайте, как образовывать утвердительные, отрицательные и вопросительные предложения.',
    duration: '45 минут',
    level: 'Начальный',
    icon: <BookOpen className="h-6 w-6" />,
    completed: false
  },
  {
    id: '3',
    title: 'Present Continuous (Настоящее длительное время)',
    description: 'Познакомьтесь с временем Present Continuous, его формированием и случаями употребления. Научитесь отличать его от Present Simple и правильно использовать в речи.',
    duration: '40 минут',
    level: 'Начальный-Средний',
    icon: <Languages className="h-6 w-6" />,
    completed: false
  },
  {
    id: '4',
    title: 'Past Simple (Простое прошедшее время)',
    description: 'Изучите образование и использование времени Past Simple. Разберетесь с правильными и неправильными глаголами, научитесь рассказывать о прошедших событиях.',
    duration: '50 минут',
    level: 'Средний',
    icon: <BookOpen className="h-6 w-6" />,
    completed: false
  },
  {
    id: '5',
    title: 'Условные предложения (Conditionals)',
    description: 'Познакомьтесь с условными предложениями в английском языке. Разберете типы условных предложений (Zero, First, Second, Third) и их использование в речи.',
    duration: '60 минут',
    level: 'Продвинутый',
    icon: <GraduationCap className="h-6 w-6" />,
    completed: false
  }
];

const getCompletedLessons = () => {
  // Retrieve completed lessons from localStorage
  const completedLessons = localStorage.getItem('completedLessons');
  return completedLessons ? JSON.parse(completedLessons) : [];
};

const Lessons = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lessons, setLessons] = React.useState(demoLessons);
  const [isLoading, setIsLoading] = React.useState(false);
  
  React.useEffect(() => {
    // Load completed lessons status
    const completedLessonsIds = getCompletedLessons();
    
    setLessons(prevLessons => 
      prevLessons.map(lesson => ({
        ...lesson,
        completed: completedLessonsIds.includes(lesson.id)
      }))
    );
  }, []);

  const handleStartLesson = (lessonId: string) => {
    navigate(`/lessons/${lessonId}`);
    toast.success("Урок открыт", {
      description: "Теперь вы можете изучать теоретический материал и пройти тест"
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Уроки английского языка" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <div className="grid gap-6">
              <div className="bg-card rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Доступные уроки</h2>
                <p className="text-muted-foreground mb-6">
                  Выберите урок для изучения или продолжите начатый урок
                </p>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {isLoading ? (
                    // Показываем скелетоны при загрузке
                    Array(3).fill(0).map((_, index) => (
                      <LessonSkeleton key={index} />
                    ))
                  ) : (
                    // Показываем уроки
                    lessons.map((lesson) => (
                      <Card key={lesson.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="bg-primary/10 p-4 flex items-center">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-4">
                              {lesson.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{lesson.title}</h3>
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {lesson.level}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-muted-foreground mb-4">
                              {lesson.description}
                            </p>
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                            <div className="flex justify-end pt-2">
                              <Button 
                                className={`gap-2 ${lesson.completed ? "bg-green-600 hover:bg-green-700" : ""}`} 
                                onClick={() => handleStartLesson(lesson.id)}
                              >
                                {lesson.completed ? (
                                  <>
                                    <CheckCircle className="h-4 w-4" />
                                    Пройден
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4" />
                                    Начать
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Lessons;
