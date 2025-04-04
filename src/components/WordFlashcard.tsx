
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';

export interface WordItem {
  id: string;
  word: string;
  translation: string;
}

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

export default WordFlashcard;
