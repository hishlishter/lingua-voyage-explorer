
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
import { Award, CheckCircle2 } from 'lucide-react';

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
  isPerfectScore,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let message = '';
  let color = '';
  
  if (percentage === 100) {
    message = 'Отлично! Вы набрали 100% и успешно завершили урок!';
    color = 'text-green-600';
  } else if (percentage >= 90) {
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
            {percentage === 100 ? (
              <CheckCircle2 size={40} className="text-green-500" />
            ) : (
              <Award size={40} className="text-primary" />
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-1">{testTitle}</h3>
          <p className={`text-center ${color} font-medium mb-4`}>{message}</p>
          
          <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-2">
            <span>{score}</span>
            <span className="text-gray-400">/</span>
            <span>{totalQuestions}</span>
          </div>
          
          <div className="w-full mb-2">
            <Progress value={percentage} className={`h-2 ${percentage === 100 ? 'bg-green-100' : ''}`} />
          </div>
          
          <p className="text-sm text-muted-foreground">{percentage}% правильных ответов</p>
          
          {isPerfectScore && (
            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
              <p className="text-green-700 text-sm">
                Урок отмечен как завершенный и добавлен в ваш прогресс!
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} className={`w-full ${percentage === 100 ? 'bg-green-600 hover:bg-green-700' : ''}`}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestResult;
