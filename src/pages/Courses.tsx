
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

const Courses = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Курсы" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <div className="grid gap-6">
              <div className="bg-card rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Доступные курсы</h2>
                <p className="text-muted-foreground mb-6">
                  Выберите курс для изучения или продолжите начатый курс
                </p>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Course cards would go here */}
                  <div className="bg-background border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-2">Основы русского языка</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Изучите основы русской грамматики и правописания
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">12 уроков</span>
                      <button className="text-sm text-primary hover:underline">Начать</button>
                    </div>
                  </div>
                  
                  <div className="bg-background border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-2">Разговорный русский</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Практикуйте повседневную разговорную речь
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">8 уроков</span>
                      <button className="text-sm text-primary hover:underline">Начать</button>
                    </div>
                  </div>
                  
                  <div className="bg-background border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-2">Деловой русский</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Изучите профессиональную лексику и стиль общения
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">10 уроков</span>
                      <button className="text-sm text-primary hover:underline">Начать</button>
                    </div>
                  </div>
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
