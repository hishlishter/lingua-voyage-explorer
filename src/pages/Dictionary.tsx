
import React, { useState, useEffect } from 'react';
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
  const [dictionaryWords, setDictionaryWords] = useState<DictionaryWord[]>([]);
  const [filteredWords, setFilteredWords] = useState<DictionaryWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);

  // Initial dictionary data
  useEffect(() => {
    // This would normally fetch from an API, but we'll use static data for now
    const fetchDictionary = async () => {
      try {
        setIsLoading(true);
        // Simulating API call with timeout
        setTimeout(() => {
          const words: DictionaryWord[] = [
            { id: '1', word: 'привет', translation: 'hello / hi' },
            { id: '2', word: 'спасибо', translation: 'thank you' },
            { id: '3', word: 'пожалуйста', translation: 'please / you\'re welcome' },
            { id: '4', word: 'да', translation: 'yes' },
            { id: '5', word: 'нет', translation: 'no' },
            { id: '6', word: 'извините', translation: 'sorry / excuse me' },
            { id: '7', word: 'хорошо', translation: 'good / well / okay' },
            { id: '8', word: 'плохо', translation: 'bad / poorly' },
            { id: '9', word: 'время', translation: 'time' },
            { id: '10', word: 'день', translation: 'day' },
            { id: '11', word: 'ночь', translation: 'night' },
            { id: '12', word: 'утро', translation: 'morning' },
            { id: '13', word: 'вечер', translation: 'evening' },
            { id: '14', word: 'дом', translation: 'house / home' },
            { id: '15', word: 'школа', translation: 'school' },
            { id: '16', word: 'работа', translation: 'work / job' },
            { id: '17', word: 'семья', translation: 'family' },
            { id: '18', word: 'друг', translation: 'friend' },
            { id: '19', word: 'книга', translation: 'book' },
            { id: '20', word: 'еда', translation: 'food' },
          ];
          setDictionaryWords(words);
          setFilteredWords(words);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dictionary:', error);
        toast.error('Ошибка при загрузке словаря');
        setIsLoading(false);
      }
    };

    fetchDictionary();
  }, []);

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
      setFilteredWords(dictionaryWords);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    
    // First search in local dictionary
    const localResults = dictionaryWords.filter(
      word => 
        word.word.toLowerCase().includes(query) || 
        word.translation.toLowerCase().includes(query)
    );
    
    // Then search in Linguee
    const lingueeResults = await searchLinguee(query);
    
    // Combine results
    const combinedResults = [...localResults];
    
    // Add only linguee results that don't already exist in local results
    lingueeResults.forEach(lingueeWord => {
      const exists = localResults.some(
        localWord => 
          localWord.word.toLowerCase() === lingueeWord.word.toLowerCase() && 
          localWord.translation.toLowerCase() === lingueeWord.translation.toLowerCase()
      );
      
      if (!exists) {
        combinedResults.push(lingueeWord);
      }
    });
    
    setFilteredWords(combinedResults);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setFilteredWords(dictionaryWords);
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
                
                {isLoading ? (
                  <div className="space-y-3">
                    {Array(5).fill(0).map((_, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <Skeleton className="h-5 w-24 mb-2" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredWords.length > 0 ? (
                  <div className="border rounded-lg divide-y">
                    {filteredWords.map((word) => (
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
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Ничего не найдено</p>
                    <Button variant="link" onClick={() => setFilteredWords(dictionaryWords)}>
                      Сбросить поиск
                    </Button>
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
