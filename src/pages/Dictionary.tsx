
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Dictionary words interface
interface DictionaryWord {
  id: string;
  word: string;
  translation: string;
}

const Dictionary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dictionaryWords, setDictionaryWords] = useState<DictionaryWord[]>([]);
  const [filteredWords, setFilteredWords] = useState<DictionaryWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredWords(dictionaryWords);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = dictionaryWords.filter(
      word => 
        word.word.toLowerCase().includes(query) || 
        word.translation.toLowerCase().includes(query)
    );
    
    setFilteredWords(filtered);
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
                  Поиск и просмотр слов и их переводов
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
                  <Button variant="secondary" onClick={handleSearch}>Поиск</Button>
                </div>
                
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
