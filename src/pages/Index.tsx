
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, Profile, Test } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import UserProfile from '@/components/UserProfile';
import ProgressChart from '@/components/ProgressChart';
import QuickActions from '@/components/QuickActions';
import WordSets from '@/components/WordSets';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    
    try {
      // Поиск тестов
      const { data: tests, error: testsError } = await supabase
        .from('tests')
        .select('*')
        .ilike('title', `%${query}%`);
      
      if (testsError) throw testsError;
      
      // Поиск в словарях (можно расширить при необходимости)
      const wordSets = [
        { 
          id: 'idioms', 
          title: 'Английские идиомы', 
          words: [
            { id: '1', word: 'Break a leg', translation: 'Ни пуха, ни пера (пожелание удачи)' },
            { id: '2', word: 'Piece of cake', translation: 'Проще простого' },
            { id: '3', word: 'Hit the books', translation: 'Приступить к учебе' },
            { id: '4', word: 'Under the weather', translation: 'Неважно себя чувствовать' },
            { id: '5', word: 'Cost an arm and a leg', translation: 'Стоить очень дорого' },
          ]
        },
        {
          id: 'countries',
          title: 'Страны и города',
          words: [
            { id: '1', word: 'United Kingdom', translation: 'Соединенное Королевство' },
            { id: '2', word: 'France', translation: 'Франция' },
            { id: '3', word: 'Germany', translation: 'Германия' },
            { id: '4', word: 'London', translation: 'Лондон' },
            { id: '5', word: 'Paris', translation: 'Париж' },
          ]
        },
        {
          id: 'time',
          title: 'Который час?',
          words: [
            { id: '1', word: 'It\'s half past two', translation: 'Половина третьего' },
            { id: '2', word: 'It\'s quarter to nine', translation: 'Без четверти девять' },
            { id: '3', word: 'It\'s ten o\'clock', translation: 'Десять часов' },
            { id: '4', word: 'It\'s midday', translation: 'Полдень' },
            { id: '5', word: 'It\'s midnight', translation: 'Полночь' },
          ]
        }
      ];
      
      const matchedWords = wordSets
        .flatMap(set => 
          set.words
            .filter(word => 
              word.word.toLowerCase().includes(query.toLowerCase()) || 
              word.translation.toLowerCase().includes(query.toLowerCase())
            )
            .map(word => ({
              type: 'word',
              id: `${set.id}-${word.id}`,
              title: word.word,
              subtitle: word.translation,
              category: set.title
            }))
        );
      
      // Объединяем результаты
      const allResults = [
        ...(tests || []).map((test: Test) => ({
          type: 'test',
          id: test.id,
          title: test.title,
          subtitle: test.description,
          category: 'Тесты'
        })),
        ...matchedWords
      ];
      
      setSearchResults(allResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header onSearch={handleSearch} />
        
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {isSearching ? (
              <div className="text-center py-12">Поиск...</div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Результаты поиска</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((result) => (
                    <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground mb-1">
                          {result.category}
                        </div>
                        <h3 className="font-medium text-lg">{result.title}</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {result.subtitle}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <button 
                  className="text-primary hover:underline"
                  onClick={() => setSearchResults([])}
                >
                  Вернуться на главную
                </button>
              </div>
            ) : (
              <>
                {isLoading ? (
                  <div className="text-center py-12">Загрузка...</div>
                ) : profile ? (
                  <>
                    <UserProfile />
                    
                    <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-6`}>
                      <ProgressChart 
                        title="Прогресс обучения" 
                        year={new Date().getFullYear()} 
                      />
                      <QuickActions />
                    </div>
                    
                    <WordSets title="Словарные наборы" />
                  </>
                ) : (
                  <div className="text-center py-12">Профиль не найден</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
