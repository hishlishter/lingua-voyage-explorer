
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, Profile, Test } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import SearchResults from '@/components/SearchResults';
import ProfileLoadingStates from '@/components/ProfileLoadingStates';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;
      
      console.log("Fetching profile for user:", user.id);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        console.log("Profile data retrieved:", data);
        return data;
      } catch (error) {
        console.error('Error in query function:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 1,
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

  const handleRetry = () => {
    window.location.reload();
  };

  const clearSearchResults = () => {
    setSearchResults([]);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header onSearch={handleSearch} />
        
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {searchResults.length > 0 || isSearching ? (
              <SearchResults 
                results={searchResults} 
                isSearching={isSearching} 
                onClear={clearSearchResults} 
              />
            ) : (
              <>
                <ProfileLoadingStates
                  isLoading={isLoading}
                  isError={isError}
                  user={user}
                  profile={profile}
                  onRetry={handleRetry}
                />
                
                {profile && <Dashboard profile={profile} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
