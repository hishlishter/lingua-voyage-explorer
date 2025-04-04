
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { CircleCheck, CircleX } from 'lucide-react';

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
  testTitle
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPassed = percentage >= 70;
  
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Результаты теста: {testTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col items-center py-6">
              <div className={`text-6xl mb-4 ${isPassed ? 'text-green-500' : 'text-red-500'}`}>
                {isPassed ? <CircleCheck /> : <CircleX />}
              </div>
              
              <div className="text-3xl font-bold mb-2">
                {score} / {totalQuestions}
              </div>
              
              <div className="text-lg mb-4">
                {percentage}% правильных ответов
              </div>
              
              <div className="text-center">
                {isPassed ? (
                  <p>Поздравляем! Вы успешно прошли тест.</p>
                ) : (
                  <p>Попробуйте еще раз, чтобы улучшить свой результат.</p>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>
            {isPassed ? 'Вернуться к тестам' : 'Попробовать снова'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TestResult;
