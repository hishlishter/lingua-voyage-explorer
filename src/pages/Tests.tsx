
import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Clock, BookOpen, GraduationCap, Globe, Mic, Pencil, BookText, MessageSquare, VolumeX } from 'lucide-react';

const Tests = () => {
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
                {/* Test cards */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                      <Brain className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Базовая грамматика</h3>
                    <p className="text-muted-foreground mb-4">
                      Проверьте свои знания основных правил английской грамматики
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>20 минут</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button>Начать тест</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Времена глаголов</h3>
                    <p className="text-muted-foreground mb-4">
                      Тест на знание и использование времён в английском языке
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>25 минут</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button>Начать тест</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Уровень словарного запаса</h3>
                    <p className="text-muted-foreground mb-4">
                      Определите уровень своего словарного запаса от A1 до C2
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>30 минут</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button>Начать тест</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Идиомы и фразеологизмы</h3>
                    <p className="text-muted-foreground mb-4">
                      Проверьте свое знание популярных английских идиом
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>15 минут</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button>Начать тест</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                      <Mic className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Аудирование</h3>
                    <p className="text-muted-foreground mb-4">
                      Тест на понимание разговорной английской речи
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>20 минут</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button>Начать тест</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                      <Pencil className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Письменный тест</h3>
                    <p className="text-muted-foreground mb-4">
                      Оценка навыков письменной английской речи
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>40 минут</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button>Начать тест</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                      <BookText className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Чтение и понимание</h3>
                    <p className="text-muted-foreground mb-4">
                      Проверка навыков чтения и понимания английских текстов
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>35 минут</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button>Начать тест</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Разговорный английский</h3>
                    <p className="text-muted-foreground mb-4">
                      Тест на знание разговорных фраз и ситуаций
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>25 минут</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button>Начать тест</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                      <VolumeX className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Произношение</h3>
                    <p className="text-muted-foreground mb-4">
                      Тест на правильность произношения английских слов
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>20 минут</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button>Начать тест</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                      <Brain className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Комплексный тест</h3>
                    <p className="text-muted-foreground mb-4">
                      Полная оценка уровня владения английским языком
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>60 минут</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button>Начать тест</Button>
                    </div>
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

export default Tests;
