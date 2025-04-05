
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const Dictionary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [contentReady, setContentReady] = useState(false);

  // Initialize Puzzle English dictionary when component mounts
  useEffect(() => {
    // Give time for the dictionary to initialize
    const timer = setTimeout(() => {
      setContentReady(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setSearchProgress((prev) => {
          const newProgress = prev + 20;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add the search term to the content area
      const contentDiv = document.getElementById('dictionary-content');
      if (contentDiv) {
        contentDiv.innerHTML = `<div class="balloon-row"><p>Вот результаты поиска для слова: <strong>${searchQuery}</strong></p>
        <p>Нажмите на любое английское слово, чтобы увидеть его перевод и подробности.</p>
        <p>${searchQuery} - это слово, которое вы можете изучить с помощью нашего словаря.</p></div>`;
      }
      
      clearInterval(progressInterval);
      setSearchProgress(100);
      
      setTimeout(() => {
        setIsSearching(false);
        setSearchProgress(0);
        
        // Reinitialize dictionary after content changes
        if (window.PE_Balloon && typeof window.PE_Balloon.init === 'function') {
          window.PE_Balloon.init({
            wrap_words: true, 
            id_user: 1263499, 
            our_helper: false,
            balloon_video: true, 
            balloon_phrases: true, 
            balloon_form_words: true
          });
        }
      }, 500);
      
    } catch (error) {
      console.error('Error during search:', error);
      toast.error('Произошла ошибка при поиске');
      setIsSearching(false);
      setSearchProgress(0);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle key press for search (Enter key)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Словарь" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <div className="grid gap-6">
              <div className="bg-card rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Интерактивный словарь</h2>
                <p className="text-muted-foreground mb-6">
                  Найдите любое слово и нажмите на него, чтобы увидеть перевод и подробности
                </p>
                
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      type="search" 
                      placeholder="Введите слово для поиска..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <Button 
                    variant="secondary" 
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? "Поиск..." : "Поиск"}
                  </Button>
                </div>
                
                {isSearching && (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Поиск слова...</p>
                    <Progress value={searchProgress} className="h-2" />
                  </div>
                )}
                
                {contentReady ? (
                  <div 
                    id="dictionary-content" 
                    className="border rounded-lg p-6"
                  >
                    <div className="balloon-row">
                      <p>Введите слово в поле поиска и нажмите кнопку "Поиск", чтобы найти его перевод и значение.</p>
                      <p>После этого вы можете нажимать на любые <strong>английские слова</strong> в тексте, чтобы увидеть их перевод.</p>
                      <p>Вот пример нескольких английских слов: <strong>hello</strong>, <strong>world</strong>, <strong>dictionary</strong>, <strong>language</strong>, <strong>learning</strong>.</p>
                      <p>Попробуйте нажать на одно из этих слов, чтобы увидеть, как работает словарь.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Загрузка словаря...</p>
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

export default Dictionary;
