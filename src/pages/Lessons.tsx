
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';

const Lessons = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Доступные уроки" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Расписание занятий</h2>
                <Button>Записаться на урок</Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Upcoming lessons */}
                <Card>
                  <CardContent className="p-6">
                    <div className="bg-primary/10 text-primary w-fit px-3 py-1 rounded-full text-sm mb-4">
                      Сегодня
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Разговорная практика</h3>
                    <p className="text-muted-foreground mb-4">
                      Индивидуальное занятие с преподавателем для практики разговорной речи
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>12 апреля 2025</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>15:00 - 16:30</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button>Подключиться</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="bg-primary/10 text-primary w-fit px-3 py-1 rounded-full text-sm mb-4">
                      Завтра
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Грамматика: Падежи</h3>
                    <p className="text-muted-foreground mb-4">
                      Групповое занятие по использованию и практике падежей
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>13 апреля 2025</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>10:00 - 11:30</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button variant="outline">Напоминание</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="bg-muted w-fit px-3 py-1 rounded-full text-sm mb-4">
                      14 апреля
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Понимание на слух</h3>
                    <p className="text-muted-foreground mb-4">
                      Практика аудирования с использованием реальных диалогов
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>14 апреля 2025</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>18:00 - 19:00</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button variant="outline">Напоминание</Button>
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

export default Lessons;
