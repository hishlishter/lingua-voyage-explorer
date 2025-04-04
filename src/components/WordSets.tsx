
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import WordSetCard from './WordSetCard';
import { wordSetsData } from '@/data/wordSetsData';

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
