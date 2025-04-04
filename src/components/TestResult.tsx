
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';

interface TestResultProps {
  open: boolean;
  onClose: () => void;
  score: number;
  totalQuestions: number;
  testTitle: string;
}

const TestResult: React.FC<TestResultProps> = ({
  open,
  onClose,
  score,
  totalQuestions,
  testTitle,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let message = '';
  let color = '';
  
  if (percentage >= 90) {
    message = 'Отлично! Вы отлично справились!';
    color = 'text-green-600';
  } else if (percentage >= 70) {
    message = 'Хорошо! Вы хорошо справились!';
    color = 'text-blue-600';
  } else if (percentage >= 50) {
    message = 'Неплохо! Но есть над чем поработать.';
    color = 'text-yellow-600';
  } else {
    message = 'Стоит повторить материал и попробовать снова.';
    color = 'text-red-600';
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Результаты теста</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Award size={40} className="text-primary" />
          </div>
          
          <h3 className="text-xl font-bold mb-1">{testTitle}</h3>
          <p className={`text-center ${color} font-medium mb-4`}>{message}</p>
          
          <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-2">
            <span>{score}</span>
            <span className="text-gray-400">/</span>
            <span>{totalQuestions}</span>
          </div>
          
          <div className="w-full mb-2">
            <Progress value={percentage} className="h-2" />
          </div>
          
          <p className="text-sm text-muted-foreground">{percentage}% правильных ответов</p>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} className="w-full">Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestResult;
