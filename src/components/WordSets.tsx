
import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Word {
  id: number;
  word: string;
  translation: string;
  example?: string;
}

interface WordSet {
  id: number;
  title: string;
  icon: string;
  slug: string;
  isFavorite?: boolean;
  gradientClass: string;
}

interface WordCardProps {
  word: Word;
}

const WordCard: React.FC<WordCardProps> = ({ word }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  
  return (
    <Card 
      className="p-4 cursor-pointer transition-all hover:shadow-md"
      onClick={() => setShowTranslation(!showTranslation)}
    >
      <div className="text-center">
        <p className="font-medium text-lg mb-2">{word.word}</p>
        {showTranslation && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-muted-foreground">{word.translation}</p>
            {word.example && <p className="text-sm italic mt-2">{word.example}</p>}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          {showTranslation ? "Нажмите, чтобы скрыть перевод" : "Нажмите, чтобы увидеть перевод"}
        </p>
      </div>
    </Card>
  );
};

interface WordSetCardProps {
  set: WordSet;
  onSelect: (set: WordSet) => void;
}

const WordSetCard: React.FC<WordSetCardProps> = ({ 
  set, 
  onSelect
}) => {
  const [favorite, setFavorite] = useState(set.isFavorite);
  
  return (
    <Card 
      className={cn("overflow-hidden h-36 border-none shadow-md cursor-pointer", set.gradientClass)}
      onClick={() => onSelect(set)}
    >
      <CardContent className="p-0 h-full">
        <div className="p-4 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="text-4xl mb-2">{set.icon}</div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-white/30 hover:bg-white/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setFavorite(!favorite);
              }}
            >
              <Heart size={16} className={cn(favorite ? "fill-white" : "")} />
            </Button>
          </div>
          <h3 className="text-white font-medium text-lg">{set.title}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

interface WordSetsProps {
  title: string;
}

const WordSets: React.FC<WordSetsProps> = ({ title }) => {
  const [activeSetDialog, setActiveSetDialog] = useState<WordSet | null>(null);
  
  // Sample word sets
  const wordSets: WordSet[] = [
    { 
      id: 1,
      title: "Английские идиомы", 
      icon: "📚", 
      slug: "idioms",
      gradientClass: "card-gradient-pink",
      isFavorite: true
    },
    { 
      id: 2,
      title: "Страны и города", 
      icon: "🌎", 
      slug: "locations",
      gradientClass: "card-gradient-purple",
      isFavorite: true
    },
    { 
      id: 3,
      title: "Который час?", 
      icon: "🕒", 
      slug: "time",
      gradientClass: "card-gradient-blue" 
    }
  ];

  // Fetch words for the active set
  const { data: words = [], isLoading } = useQuery({
    queryKey: ['words', activeSetDialog?.slug],
    queryFn: async (): Promise<Word[]> => {
      if (!activeSetDialog) return [];
      
      // In a real application, fetch from Supabase
      // For this example, return sample data based on the set
      switch (activeSetDialog.slug) {
        case 'idioms':
          return [
            { id: 1, word: "Break a leg", translation: "Ни пуха, ни пера", example: "Break a leg at your performance tonight!" },
            { id: 2, word: "Piece of cake", translation: "Проще простого", example: "The exam was a piece of cake." },
            { id: 3, word: "Hit the books", translation: "Приступить к учебе", example: "I need to hit the books before the test." },
            { id: 4, word: "Bite the bullet", translation: "Собраться с духом", example: "Sometimes you just have to bite the bullet and do it." },
            { id: 5, word: "Under the weather", translation: "Неважно себя чувствовать", example: "I'm feeling a bit under the weather today." }
          ];
        case 'locations':
          return [
            { id: 6, word: "London", translation: "Лондон", example: "London is the capital of the UK." },
            { id: 7, word: "Paris", translation: "Париж", example: "Paris is known as the city of love." },
            { id: 8, word: "Tokyo", translation: "Токио", example: "Tokyo is the capital of Japan." },
            { id: 9, word: "New York", translation: "Нью-Йорк", example: "New York is called the Big Apple." },
            { id: 10, word: "Moscow", translation: "Москва", example: "Moscow is the capital of Russia." }
          ];
        case 'time':
          return [
            { id: 11, word: "What time is it?", translation: "Который час?", example: "What time is it? It's 5 o'clock." },
            { id: 12, word: "Half past three", translation: "Половина четвертого", example: "The meeting starts at half past three." },
            { id: 13, word: "Quarter to six", translation: "Без четверти шесть", example: "I'll meet you at quarter to six." },
            { id: 14, word: "Noon", translation: "Полдень", example: "Let's meet at noon for lunch." },
            { id: 15, word: "Midnight", translation: "Полночь", example: "The party ended at midnight." }
          ];
        default:
          return [];
      }
    },
    enabled: !!activeSetDialog,
  });

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wordSets.map((set) => (
          <WordSetCard 
            key={set.id}
            set={set}
            onSelect={() => setActiveSetDialog(set)}
          />
        ))}
      </div>

      {/* Dialog with word cards */}
      <Dialog open={!!activeSetDialog} onOpenChange={(open) => !open && setActiveSetDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeSetDialog?.icon && <span>{activeSetDialog.icon}</span>}
              {activeSetDialog?.title}
            </DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="py-4 text-center">Загрузка...</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 py-4 max-h-[60vh] overflow-y-auto">
              {words.map((word) => (
                <WordCard key={word.id} word={word} />
              ))}
            </div>
          )}
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setActiveSetDialog(null)}>
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WordSets;
