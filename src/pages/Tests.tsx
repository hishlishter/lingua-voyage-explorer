
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Clock, BookOpen, GraduationCap, Globe, Mic, Pencil, BookText, MessageSquare, VolumeX } from 'lucide-react';
import TestResult from '@/components/TestResult';
import { useToast } from "@/hooks/use-toast";

interface Test {
  id: number;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  totalQuestions: number;
}

const tests: Test[] = [
  {
    id: 1,
    title: "Базовая грамматика",
    description: "Проверьте свои знания основных правил английской грамматики",
    duration: "20 минут",
    icon: <Brain className="h-6 w-6" />,
    totalQuestions: 20
  },
  {
    id: 2,
    title: "Времена глаголов",
    description: "Тест на знание и использование времён в английском языке",
    duration: "25 минут",
    icon: <BookOpen className="h-6 w-6" />,
    totalQuestions: 25
  },
  {
    id: 3,
    title: "Уровень словарного запаса",
    description: "Определите уровень своего словарного запаса от A1 до C2",
    duration: "30 минут",
    icon: <GraduationCap className="h-6 w-6" />,
    totalQuestions: 30
  },
  {
    id: 4,
    title: "Идиомы и фразеологизмы",
    description: "Проверьте свое знание популярных английских идиом",
    duration: "15 минут",
    icon: <Globe className="h-6 w-6" />,
    totalQuestions: 15
  },
  {
    id: 5,
    title: "Аудирование",
    description: "Тест на понимание разговорной английской речи",
    duration: "20 минут",
    icon: <Mic className="h-6 w-6" />,
    totalQuestions: 20
  },
  {
    id: 6,
    title: "Письменный тест",
    description: "Оценка навыков письменной английской речи",
    duration: "40 минут",
    icon: <Pencil className="h-6 w-6" />,
    totalQuestions: 10
  },
  {
    id: 7,
    title: "Чтение и понимание",
    description: "Проверка навыков чтения и понимания английских текстов",
    duration: "35 минут",
    icon: <BookText className="h-6 w-6" />,
    totalQuestions: 15
  },
  {
    id: 8,
    title: "Разговорный английский",
    description: "Тест на знание разговорных фраз и ситуаций",
    duration: "25 минут",
    icon: <MessageSquare className="h-6 w-6" />,
    totalQuestions: 20
  },
  {
    id: 9,
    title: "Произношение",
    description: "Тест на правильность произношения английских слов",
    duration: "20 минут",
    icon: <VolumeX className="h-6 w-6" />,
    totalQuestions: 25
  },
  {
    id: 10,
    title: "Комплексный тест",
    description: "Полная оценка уровня владения английским языком",
    duration: "60 минут",
    icon: <Brain className="h-6 w-6" />,
    totalQuestions: 50
  }
];

const Tests = () => {
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const handleStartTest = (test: Test) => {
    setCurrentTest(test);
    toast({
      title: `Тест "${test.title}" начат`,
      description: "После завершения вы увидите результаты",
    });
    
    // Simulate test completion after a short delay (in a real app, this would be a real test)
    setTimeout(() => {
      // Generate a random score for demo purposes
      const randomScore = Math.floor(Math.random() * (test.totalQuestions + 1));
      setScore(randomScore);
      setShowResult(true);
    }, 3000);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setCurrentTest(null);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Тесты по английскому" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Доступные тесты</h2>
                <Button>Результаты тестов</Button>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {tests.map((test) => (
                  <Card key={test.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                        {test.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
                      <p className="text-muted-foreground mb-4">
                        {test.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Clock className="h-4 w-4" />
                        <span>{test.duration}</span>
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-end">
                        <Button onClick={() => handleStartTest(test)}>Начать тест</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {currentTest && (
        <TestResult 
          open={showResult}
          onClose={handleCloseResult}
          score={score}
          totalQuestions={currentTest.totalQuestions}
          testTitle={currentTest.title}
        />
      )}
    </div>
  );
};

export default Tests;
