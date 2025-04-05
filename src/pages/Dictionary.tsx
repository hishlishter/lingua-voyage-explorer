
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

// Dictionary words interface
interface DictionaryWord {
  id: string;
  word: string;
  translation: string;
  source?: string;
}

const Dictionary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DictionaryWord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Simulate searching on external dictionary API (Linguee)
  const searchLinguee = async (query: string) => {
    if (!query.trim()) return [];
    
    setIsSearching(true);
    setSearchProgress(0);
    
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
      
      // Simulate response from Linguee
      const results: DictionaryWord[] = [];
      
      // Generate some fake results based on the query
      if (query.match(/[а-яА-ЯёЁ]/)) {
        // Russian query - generate English translations
        const possibleTranslations = [
          "the " + query,
          query + "ing",
          "to " + query,
          query + "ly",
          query + " (formal)",
          query + " (informal)",
          query + " (noun)",
          query + " (verb)",
        ];
        
        // Take up to 5 translations
        for (let i = 0; i < Math.min(5, possibleTranslations.length); i++) {
          results.push({
            id: `linguee-${Date.now()}-${i}`,
            word: query,
            translation: possibleTranslations[i],
            source: 'Linguee'
          });
        }
      } else {
        // English query - generate Russian translations
        const possibleTranslations = [
          query + "ать",
          query + "ить",
          query + "овать",
          query + "ский",
          query + "ный",
          "пре" + query,
          "про" + query,
          "за" + query
        ];
        
        // Take up to 5 translations
        for (let i = 0; i < Math.min(5, possibleTranslations.length); i++) {
          results.push({
            id: `linguee-${Date.now()}-${i}`,
            word: query,
            translation: possibleTranslations[i],
            source: 'Linguee'
          });
        }
      }
      
      clearInterval(progressInterval);
      setSearchProgress(100);
      
      setTimeout(() => {
        setIsSearching(false);
        setSearchProgress(0);
      }, 500);
      
      return results;
    } catch (error) {
      console.error('Error searching Linguee:', error);
      toast.error('Ошибка при поиске в словаре Linguee');
      setIsSearching(false);
      setSearchProgress(0);
      return [];
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    setHasSearched(true);
    
    // Search in Linguee
    const lingueeResults = await searchLinguee(query);
    setSearchResults(lingueeResults);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setSearchResults([]);
      setHasSearched(false);
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
                  Поиск и просмотр слов и их переводов (интегрировано с Linguee)
                </p>
                
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      type="search" 
                      placeholder="Поиск по словам..." 
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
                    <p className="text-sm text-muted-foreground mb-2">Поиск в Linguee...</p>
                    <Progress value={searchProgress} className="h-2" />
                  </div>
                )}
                
                {searchResults.length > 0 ? (
                  <div className="border rounded-lg divide-y">
                    {searchResults.map((word) => (
                      <div key={word.id} className="p-4 flex justify-between items-center hover:bg-accent/5">
                        <div>
                          <h3 className="font-medium">{word.word}</h3>
                          <p className="text-sm text-muted-foreground">{word.translation}</p>
                          {word.source && (
                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                              {word.source}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : hasSearched ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Ничего не найдено</p>
                    <Button variant="link" onClick={() => {
                      setSearchQuery('');
                      setHasSearched(false);
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
