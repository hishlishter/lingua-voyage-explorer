
import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, GraduationCap, Play } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Английский для начинающих (A1)',
    description: 'Изучите основы английского языка: алфавит, простые фразы, базовая грамматика.',
    lessons: 12,
    duration: '6 недель',
    level: 'Начальный',
    icon: <BookOpen className="h-6 w-6" />
  },
  {
    id: 2,
    title: 'Разговорный английский (A2-B1)',
    description: 'Практикуйте повседневное общение на английском языке.',
    lessons: 10,
    duration: '5 недель',
    level: 'Начальный-Средний',
    icon: <BookOpen className="h-6 w-6" />
  },
  {
    id: 3,
    title: 'Деловой английский (B1-B2)',
    description: 'Освойте профессиональную лексику и навыки ведения бизнес-переговоров.',
    lessons: 8,
    duration: '4 недели',
    level: 'Средний',
    icon: <BookOpen className="h-6 w-6" />
  },
  {
    id: 4,
    title: 'Грамматика английского языка (A1-B2)',
    description: 'Углубленное изучение английской грамматики для всех уровней.',
    lessons: 15,
    duration: '8 недель',
    level: 'Начальный-Средний',
    icon: <GraduationCap className="h-6 w-6" />
  },
  {
    id: 5,
    title: 'Английская литература (B2-C1)',
    description: 'Познакомьтесь с классикой английской литературы и современными авторами.',
    lessons: 10,
    duration: '6 недель',
    level: 'Продвинутый',
    icon: <BookOpen className="h-6 w-6" />
  },
  {
    id: 6,
    title: 'Подготовка к TOEFL/IELTS (B2-C1)',
    description: 'Интенсивная подготовка к международным экзаменам по английскому языку.',
    lessons: 12,
    duration: '7 недель',
    level: 'Продвинутый',
    icon: <GraduationCap className="h-6 w-6" />
  }
];

const Courses = () => {
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
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="bg-primary/10 p-4 flex items-center">
                          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-4">
                            {course.icon}
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
                              <span>{course.lessons} уроков</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                          </div>
                          <div className="flex justify-end pt-2">
                            <Button className="gap-2">
                              <Play className="h-4 w-4" />
                              Начать
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Courses;
