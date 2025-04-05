
import React, { useState } from 'react';
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
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  // Search using WooordHunt
  const searchWooordHunt = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchProgress(0);
    setHtmlContent(null);
    
    try {
      // Simulate API call with progress updates
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
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock response that mimics WooordHunt content
      let content = `
        <div class="word-card">
          <h2>${query}</h2>
          
          <div class="transcription">
            ${query.match(/[а-яА-ЯёЁ]/) 
              ? `[ru word]` 
              : `[${query.split('').join('·')}]`
            }
          </div>
          
          <div class="translations">
            <h3>Переводы:</h3>
            <ul>
              ${query.match(/[а-яА-ЯёЁ]/) 
                ? `
                  <li><strong>${query} (сущ.)</strong> — ${query.toLowerCase().split('').reverse().join('')}</li>
                  <li><strong>${query} (глаг.)</strong> — to ${query.toLowerCase()}</li>
                  <li><strong>${query} (прил.)</strong> — ${query.toLowerCase() + 'al'}</li>
                `
                : `
                  <li><strong>${query} (noun)</strong> — ${query.toLowerCase() + 'ство'}</li>
                  <li><strong>${query} (verb)</strong> — ${query.toLowerCase() + 'ать'}</li>
                  <li><strong>${query} (adj)</strong> — ${query.toLowerCase() + 'ный'}</li>
                `
              }
            </ul>
          </div>
          
          <div class="examples">
            <h3>Примеры:</h3>
            <ul>
              <li>This is an example with the word <strong>${query}</strong> in it — Это пример со словом <strong>${query}</strong>.</li>
              <li>Another example using <strong>${query}</strong> in a sentence — Другой пример использования слова <strong>${query}</strong> в предложении.</li>
            </ul>
          </div>
        </div>
      `;
      
      clearInterval(progressInterval);
      setSearchProgress(100);
      
      setTimeout(() => {
        setIsSearching(false);
        setSearchProgress(0);
        setHtmlContent(content);
      }, 500);
      
    } catch (error) {
      console.error('Error searching WooordHunt:', error);
      toast.error('Ошибка при поиске в словаре WooordHunt');
      setIsSearching(false);
      setSearchProgress(0);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setHtmlContent(null);
      return;
    }

    await searchWooordHunt(searchQuery);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setHtmlContent(null);
    }
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
                <h2 className="text-2xl font-bold mb-4">Русско-английский словарь</h2>
                <p className="text-muted-foreground mb-6">
                  Поиск слов в словаре WooordHunt
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
                    <p className="text-sm text-muted-foreground mb-2">Поиск в WooordHunt...</p>
                    <Progress value={searchProgress} className="h-2" />
                  </div>
                )}
                
                {htmlContent ? (
                  <div className="border rounded-lg p-6">
                    <div 
                      className="woordhunt-content"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  </div>
                ) : !isSearching && searchQuery ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Ничего не найдено</p>
                    <Button variant="link" onClick={() => {
                      setSearchQuery('');
                    }}>
                      Сбросить поиск
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Введите слово для поиска</p>
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
