
import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Dictionary = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Словарь" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <div className="grid gap-6">
              <div className="bg-card rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Личный словарь</h2>
                <p className="text-muted-foreground mb-6">
                  Здесь собраны все слова, которые вы изучаете
                </p>
                
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      type="search" 
                      placeholder="Поиск по словам..." 
                      className="pl-10"
                    />
                  </div>
                  <Button variant="secondary">Фильтры</Button>
                </div>
                
                <div className="border rounded-lg divide-y">
                  {/* Dictionary entries would go here */}
                  <div className="p-4 flex justify-between items-center hover:bg-accent/5">
                    <div>
                      <h3 className="font-medium">Привет</h3>
                      <p className="text-sm text-muted-foreground">Hello / Hi</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Практиковать</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 flex justify-between items-center hover:bg-accent/5">
                    <div>
                      <h3 className="font-medium">Спасибо</h3>
                      <p className="text-sm text-muted-foreground">Thank you</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Практиковать</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 flex justify-between items-center hover:bg-accent/5">
                    <div>
                      <h3 className="font-medium">Пожалуйста</h3>
                      <p className="text-sm text-muted-foreground">Please / You're welcome</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Практиковать</Button>
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

export default Dictionary;
