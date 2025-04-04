
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, Profile, TestResult } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import UserProfile from '@/components/UserProfile';
import ProgressChart from '@/components/ProgressChart';
import QuickActions from '@/components/QuickActions';
import WordSets from '@/components/WordSets';
import { useAuth } from '@/context/AuthContext';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { user, loading: authLoading, profile: authProfile } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Set a timeout to detect potential infinite loading issues
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (authLoading) {
      timer = setTimeout(() => {
        setLoadingTimeout(true);
        console.log("Index page loading timeout reached");
      }, 8000); // 8 seconds
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [authLoading]);
  
  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;
      
      console.log("Index page fetching profile for:", user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      console.log("Index page profile data:", data);
      return data;
    },
    enabled: !!user?.id,
    initialData: authProfile,
  });

  // Fetch test results for progress chart
  const { data: testResults, isLoading: testResultsLoading } = useQuery({
    queryKey: ['test_results', user?.id],
    queryFn: async (): Promise<TestResult[]> => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching test results:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Transform test results into chart data
  const progressData = React.useMemo(() => {
    if (!testResults || testResults.length === 0) {
      return [
        { name: 'Янв', value1: 4.5 },
        { name: 'Фев', value1: 5.3 },
        { name: 'Март', value1: 6.8 },
        { name: 'Апр', value1: 7.2 },
        { name: 'Май', value1: 6.5 },
        { name: 'Июнь', value1: 7.8 },
        { name: 'Июль', value1: 8.3 },
        { name: 'Авг', value1: 8.9 },
        { name: 'Сент', value1: 9.2 },
        { name: 'Окт', value1: 8.7 },
        { name: 'Нояб', value1: 9.5 },
        { name: 'Дек', value1: 9.8 },
      ];
    }

    const resultsByMonth = testResults.reduce((acc, result) => {
      const date = new Date(result.completed_at);
      const monthIndex = date.getMonth();
      const monthNames = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'];
      const monthKey = monthNames[monthIndex];
      
      if (!acc[monthKey]) {
        acc[monthKey] = { 
          scores: [], 
          total: 0, 
          count: 0 
        };
      }
      
      const score = (result.score / result.total_questions) * 10; // Convert to scale of 10
      acc[monthKey].scores.push(score);
      acc[monthKey].total += score;
      acc[monthKey].count += 1;
      
      return acc;
    }, {} as Record<string, { scores: number[], total: number, count: number }>);

    return Object.entries(resultsByMonth).map(([name, data]) => ({
      name,
      value1: data.total / data.count,
    }));
  }, [testResults]);

  // Search functionality
  const handleSearch = () => {
    setSearchOpen(true);
  };

  const searchResults = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];

    const searchItems = [
      { type: 'Тест', name: 'Тест по грамматике', path: '/tests/1' },
      { type: 'Тест', name: 'Тест на знание слов', path: '/tests/2' },
      { type: 'Словарь', name: 'Английские идиомы', path: '/dictionary?set=idioms' },
      { type: 'Словарь', name: 'Страны и города', path: '/dictionary?set=locations' },
      { type: 'Словарь', name: 'Который час?', path: '/dictionary?set=time' },
      { type: 'Курс', name: 'Основы английского', path: '/courses/1' },
      { type: 'Курс', name: 'Разговорный английский', path: '/courses/2' }
    ];

    return searchItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.type.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const isLoading = authLoading || profileLoading || testResultsLoading;
  
  console.log("Index rendering - loading:", isLoading, "user:", user?.id, "profile:", profile?.id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-6">
            <div className="max-w-5xl mx-auto space-y-8">
              {loadingTimeout && (
                <div className="bg-yellow-100 p-4 rounded-lg text-yellow-800 text-center">
                  Загрузка занимает больше времени, чем обычно...
                </div>
              )}
              <div className="rounded-lg border p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="space-y-4 flex-1">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border p-6">
                  <Skeleton className="h-6 w-48 mb-6" />
                  <Skeleton className="h-40 w-full" />
                </div>
                <div className="rounded-lg border p-6">
                  <Skeleton className="h-6 w-48 mb-6" />
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header onSearch={handleSearch} />
        
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {profile ? (
              <>
                <UserProfile profile={profile} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProgressChart 
                    title="Прогресс обучения" 
                    year={new Date().getFullYear()} 
                    data={progressData}
                  />
                  <QuickActions />
                </div>
                
                <WordSets title="Словарные наборы" />
              </>
            ) : !user ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-2">Добро пожаловать в Margo</h2>
                <p className="text-muted-foreground mb-6">Войдите в систему, чтобы начать обучение</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-2">Профиль не найден</h2>
                <p className="text-muted-foreground">Пожалуйста, создайте профиль в настройках</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput 
          placeholder="Поиск по тестам, курсам и словарям..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>Ничего не найдено</CommandEmpty>
          <CommandGroup heading="Результаты поиска">
            {searchResults.map((result, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  window.location.href = result.path;
                  setSearchOpen(false);
                }}
              >
                <div className="mr-2 text-muted-foreground">
                  <Search size={16} />
                </div>
                <span className="font-medium">{result.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {result.type}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default Index;
