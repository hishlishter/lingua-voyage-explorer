
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import WordFlashcard, { WordItem } from './WordFlashcard';

export interface WordSetData {
  id: string;
  title: string;
  icon: string;
  words: WordItem[];
  gradientClass: string;
}

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
  const [favorite, setFavorite] = useState(isFavorite);
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

export default WordSetCard;
