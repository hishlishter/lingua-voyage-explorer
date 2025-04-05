
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, GraduationCap, Play, Loader2, Languages } from 'lucide-react';
import { fetchCourses, Course } from '@/lib/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const CourseSkeleton = () => (
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
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-end pt-2">
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Demo courses with proper English language theory
const demoCourses = [
  {
    id: '1',
    title: 'Английский для начинающих (A1)',
    description: 'Изучите основы английского языка: алфавит, произношение, базовая грамматика. Освоите время Present Simple и научитесь представлять себя на английском.',
    lessons_count: 12,
    duration: '6 недель',
    level: 'Начальный',
    icon: <Languages className="h-6 w-6" />
  },
  {
    id: '2',
    title: 'Грамматика английского (A2-B1)',
    description: 'Углубленное изучение грамматики: времена Present Continuous, Past Simple, будущее время. Научитесь составлять различные типы предложений.',
    lessons_count: 10,
    duration: '5 недель',
    level: 'Начальный-Средний',
    icon: <BookOpen className="h-6 w-6" />
  },
  {
    id: '3',
    title: 'Деловой английский (B1-B2)',
    description: 'Деловая лексика, написание emails, проведение презентаций и ведение переговоров на английском. Изучение условных предложений и пассивного залога.',
    lessons_count: 8,
    duration: '4 недели',
    level: 'Средний',
    icon: <GraduationCap className="h-6 w-6" />
  },
  {
    id: '4',
    title: 'Разговорный английский (B1-B2)',
    description: 'Разговорные фразы и идиомы, улучшение произношения и беглости речи. Практика диалогов в различных жизненных ситуациях.',
    lessons_count: 9,
    duration: '5 недель',
    level: 'Средний',
    icon: <Languages className="h-6 w-6" />
  }
];

const getLevelIcon = (level: string) => {
  switch (level.toLowerCase()) {
    case 'начальный':
      return <Languages className="h-6 w-6" />;
    case 'средний':
      return <BookOpen className="h-6 w-6" />;
    case 'продвинутый':
      return <GraduationCap className="h-6 w-6" />;
    default:
      return <Languages className="h-6 w-6" />;
  }
};

const getDurationText = (lessonsCount: number) => {
  if (lessonsCount <= 5) return '2-3 недели';
  if (lessonsCount <= 10) return '4-6 недель';
  if (lessonsCount <= 15) return '6-8 недель';
  return '8+ недель';
};

const Courses = () => {
  const navigate = useNavigate();
  
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  const handleStartCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
    toast.success("Курс успешно открыт", {
      description: "Теперь вы можете изучать уроки и выполнять практические задания"
    });
  };

  // Определяем, какие курсы показывать
  const coursesToShow = courses?.length ? courses : demoCourses;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Курсы английского языка" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <div className="grid gap-6">
              <div className="bg-card rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Доступные курсы</h2>
                <p className="text-muted-foreground mb-6">
                  Выберите курс для изучения или продолжите начатый курс
                </p>
                
                {error ? (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
                    Произошла ошибка при загрузке курсов. Пожалуйста, попробуйте позже.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                      // Показываем скелетоны при загрузке
                      Array(3).fill(0).map((_, index) => (
                        <CourseSkeleton key={index} />
                      ))
                    ) : (
                      // Показываем курсы когда они загружены
                      coursesToShow.map((course) => (
                        <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-0">
                            <div className="bg-primary/10 p-4 flex items-center">
                              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-4">
                                {getLevelIcon(course.level)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{course.title}</h3>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                  {course.level}
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="text-sm text-muted-foreground mb-4">
                                {course.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  <span>{course.lessons_count} уроков</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{getDurationText(course.lessons_count)}</span>
                                </div>
                              </div>
                              <div className="flex justify-end pt-2">
                                <Button className="gap-2" onClick={() => handleStartCourse(course.id)}>
                                  <Play className="h-4 w-4" />
                                  Начать
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Courses;
