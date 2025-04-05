
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Award, Trophy, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestResultProps {
  open: boolean;
  onClose: () => void;
  score: number;
  totalQuestions: number;
  testTitle: string;
  isPerfectScore?: boolean;
}

const TestResult: React.FC<TestResultProps> = ({
  open,
  onClose,
  score,
  totalQuestions,
  testTitle,
  isPerfectScore = false
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let resultMessage = '';
  let resultClass = '';
  
  if (percentage === 100) {
    resultMessage = 'Отличный результат!';
    resultClass = 'text-green-600';
  } else if (percentage >= 80) {
    resultMessage = 'Хороший результат!';
    resultClass = 'text-blue-600';
  } else if (percentage >= 60) {
    resultMessage = 'Неплохой результат!';
    resultClass = 'text-yellow-600';
  } else {
    resultMessage = 'Стоит повторить материал.';
    resultClass = 'text-red-600';
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Результаты теста</DialogTitle>
          <DialogDescription>
            {testTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6">
          {isPerfectScore ? (
            <div className="mb-4 text-yellow-500">
              <Trophy className="h-16 w-16" />
            </div>
          ) : (
            <div className="mb-4 text-primary">
              <Award className="h-16 w-16" />
            </div>
          )}
          
          <div className="text-4xl font-bold mb-2">
            {score} / {totalQuestions}
          </div>
          
          <div className="text-lg text-muted-foreground mb-3">
            Вы набрали {percentage}%
          </div>
          
          <div className={cn("text-xl font-medium", resultClass)}>
            {resultMessage}
          </div>
          
          {isPerfectScore && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
              Поздравляем! Вы успешно завершили этот урок. Он отмечен как пройденный.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestResult;
