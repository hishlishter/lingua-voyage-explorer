
import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

// Типы для слов и переводов
interface WordItem {
  id: string;
  word: string;
  translation: string;
}

interface WordSetData {
  id: string;
  title: string;
  icon: string;
  words: WordItem[];
  gradientClass: string;
}

// Данные для наборов слов
const wordSetsData: WordSetData[] = [
  {
    id: 'idioms',
    title: 'Английские идиомы',
    icon: '📚',
    gradientClass: 'card-gradient-pink',
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
    icon: '🌎',
    gradientClass: 'card-gradient-purple',
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
    icon: '🕒',
    gradientClass: 'card-gradient-blue',
    words: [
      { id: '1', word: 'It\'s half past two', translation: 'Половина третьего' },
      { id: '2', word: 'It\'s quarter to nine', translation: 'Без четверти девять' },
      { id: '3', word: 'It\'s ten o\'clock', translation: 'Десять часов' },
      { id: '4', word: 'It\'s midday', translation: 'Полдень' },
      { id: '5', word: 'It\'s midnight', translation: 'Полночь' },
    ]
  }
];

interface WordFlashcardProps {
  word: WordItem;
  onClose: () => void;
}

const WordFlashcard: React.FC<WordFlashcardProps> = ({ word, onClose }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  
  return (
    <div className="relative p-6 rounded-xl bg-white shadow-lg min-h-[200px] flex flex-col items-center justify-center">
      <DialogClose className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
        <X size={20} />
      </DialogClose>
      
      <div className="text-center mt-4">
        {showTranslation ? (
          <>
            <h3 className="text-2xl font-semibold mb-2">{word.translation}</h3>
            <p className="text-gray-500">{word.word}</p>
          </>
        ) : (
          <h3 className="text-2xl font-semibold">{word.word}</h3>
        )}
      </div>
      
      <Button 
        className="mt-6" 
        onClick={() => setShowTranslation(!showTranslation)}
      >
        {showTranslation ? "Скрыть перевод" : "Показать перевод"}
      </Button>
    </div>
  );
};

interface WordSetProps {
  title: string;
  icon: string;
  isFavorite?: boolean;
  gradientClass: string;
  words: WordItem[];
}

const WordSetCard: React.FC<WordSetProps> = ({ 
  title, 
  icon, 
  isFavorite = false,
  gradientClass,
  words
}) => {
  const [favorite, setFavorite] = React.useState(isFavorite);
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleCardClick = () => {
    setDialogOpen(true);
  };
  
  return (
    <>
      <Card 
        className={cn("overflow-hidden h-36 border-none shadow-md cursor-pointer", gradientClass)}
        onClick={handleCardClick}
      >
        <CardContent className="p-0 h-full">
          <div className="p-4 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="text-4xl mb-2">{icon}</div>
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
            <h3 className="text-white font-medium text-lg">{title}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="mr-2">{icon}</span> {title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-3 mt-4">
            {words.map((word) => (
              <Card 
                key={word.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedWord(word);
                }}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium">{word.word}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {selectedWord && (
        <Dialog 
          open={!!selectedWord} 
          onOpenChange={(open) => {
            if (!open) setSelectedWord(null);
          }}
        >
          <DialogContent className="sm:max-w-md">
            <WordFlashcard 
              word={selectedWord} 
              onClose={() => setSelectedWord(null)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

interface WordSetsProps {
  title: string;
}

const WordSets: React.FC<WordSetsProps> = ({ title }) => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const isMobile = useIsMobile();
  
  const visibleSets = isMobile 
    ? [wordSetsData[currentSetIndex]] 
    : wordSetsData.slice(
        currentSetIndex, 
        Math.min(currentSetIndex + 3, wordSetsData.length)
      );
  
  const handlePrevSet = () => {
    setCurrentSetIndex(Math.max(0, currentSetIndex - 1));
  };
  
  const handleNextSet = () => {
    setCurrentSetIndex(Math.max(0, Math.min(wordSetsData.length - (isMobile ? 1 : 3), currentSetIndex + 1)));
  };
  
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={handlePrevSet}
            disabled={currentSetIndex === 0}
          >
            <ChevronLeft size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={handleNextSet}
            disabled={currentSetIndex >= wordSetsData.length - (isMobile ? 1 : 3)}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleSets.map((set) => (
          <WordSetCard 
            key={set.id}
            title={set.title} 
            icon={set.icon} 
            gradientClass={set.gradientClass}
            isFavorite={set.id === 'idioms' || set.id === 'countries'}
            words={set.words}
          />
        ))}
      </div>
    </div>
  );
};

export default WordSets;
