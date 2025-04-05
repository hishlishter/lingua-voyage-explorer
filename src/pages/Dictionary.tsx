
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const YANDEX_DICT_API_KEY = "dict.1.1.20250405T113644Z.c6bf557d7bd59b2a.b78857e7df7d1bbaa600d099b37adf45c23c5431";
const YANDEX_DICT_API_URL = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup";

interface DictionaryResponse {
  def: {
    text: string;
    pos: string;
    ts?: string;
    tr: {
      text: string;
      pos: string;
      syn?: { text: string; pos: string }[];
      mean?: { text: string }[];
      ex?: { text: string; tr: { text: string }[] }[];
    }[];
  }[];
}

const Dictionary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchResult, setSearchResult] = useState<DictionaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchProgress(0);
    setSearchResult(null);
    setError(null);
    
    try {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setSearchProgress((prev) => {
          const newProgress = prev + 20;
          if (newProgress >= 90) {
            return 90; // Hold at 90% until data loads
          }
          return newProgress;
        });
      }, 200);
      
      // Construct API URL
      const url = new URL(YANDEX_DICT_API_URL);
      url.searchParams.append('key', YANDEX_DICT_API_KEY);
      url.searchParams.append('lang', 'en-ru'); // English to Russian
      url.searchParams.append('text', searchQuery.trim());
      
      // Fetch data from Yandex Dictionary API
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`API returned status code ${response.status}`);
      }
      
      const data: DictionaryResponse = await response.json();
      setSearchResult(data);
      
      // Complete progress animation
      clearInterval(progressInterval);
      setSearchProgress(100);
      
      // Reset progress bar after a delay
      setTimeout(() => {
        setIsSearching(false);
        setSearchProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Error during search:', error);
      setError('Произошла ошибка при запросе к словарю. Пожалуйста, попробуйте позже.');
      toast.error('Ошибка при запросе к словарю');
      clearInterval();
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

  // Format parts of speech abbreviations
  const formatPos = (pos: string): string => {
    const posMap: Record<string, string> = {
      'noun': 'существительное',
      'verb': 'глагол',
      'adjective': 'прилагательное',
      'adverb': 'наречие',
      'pronoun': 'местоимение',
      'preposition': 'предлог',
      'conjunction': 'союз',
      'interjection': 'междометие',
      'article': 'артикль',
      'numeral': 'числительное'
    };
    
    return posMap[pos] || pos;
  };

  // Render dictionary result
  const renderSearchResult = () => {
    if (!searchResult) return null;
    
    if (searchResult.def.length === 0) {
      return (
        <div className="my-4 p-4 bg-muted/50 rounded-lg">
          <p>Перевод не найден для слова "{searchQuery}"</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {searchResult.def.map((definition, defIndex) => (
          <div key={defIndex} className="border-b pb-4 last:border-0">
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-lg font-bold text-primary">{definition.text}</h3>
              {definition.ts && <span className="text-sm text-muted-foreground">[{definition.ts}]</span>}
              <span className="text-sm italic text-muted-foreground">{formatPos(definition.pos)}</span>
            </div>
            
            <div className="space-y-3">
              {definition.tr.map((translation, trIndex) => (
                <div key={trIndex} className="ml-4">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <span className="font-medium">{translation.text}</span>
                    <span className="text-xs italic text-muted-foreground">{formatPos(translation.pos)}</span>
                  </div>
                  
                  {translation.syn && translation.syn.length > 0 && (
                    <div className="ml-4 mb-2">
                      <span className="text-sm text-muted-foreground">Синонимы: </span>
                      <span className="text-sm">
                        {translation.syn.map(s => s.text).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {translation.mean && translation.mean.length > 0 && (
                    <div className="ml-4 mb-2">
                      <span className="text-sm text-muted-foreground">Значения: </span>
                      <span className="text-sm italic">
                        {translation.mean.map(m => m.text).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {translation.ex && translation.ex.length > 0 && (
                    <div className="ml-4 space-y-1">
                      <span className="text-sm text-muted-foreground">Примеры:</span>
                      <ul className="ml-4 space-y-1">
                        {translation.ex.map((example, exIndex) => (
                          <li key={exIndex} className="text-sm">
                            <span className="italic">{example.text}</span>
                            {example.tr && example.tr.length > 0 && (
                              <span className="text-muted-foreground"> — {example.tr[0].text}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
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
                <h2 className="text-2xl font-bold mb-4">Словарь Яндекс</h2>
                <p className="text-muted-foreground mb-6">
                  Введите английское слово, чтобы получить его перевод и подробную информацию
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
                
                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                    {error}
                  </div>
                )}
                
                <div className="border rounded-lg p-6">
                  {searchResult ? (
                    renderSearchResult()
                  ) : (
                    <p className="text-muted-foreground text-center">
                      Введите слово в поле поиска и нажмите кнопку "Поиск", чтобы найти его перевод.
                    </p>
                  )}
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
