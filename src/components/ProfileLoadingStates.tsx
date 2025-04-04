
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface ProfileLoadingStatesProps {
  isLoading: boolean;
  isError: boolean;
  user: any | null;
  profile: any | null;
  onRetry: () => void;
}

const ProfileLoadingStates: React.FC<ProfileLoadingStatesProps> = ({ 
  isLoading, 
  isError, 
  user, 
  profile,
  onRetry 
}) => {
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">Добро пожаловать в Языковой тренажер</h2>
        <p className="text-muted-foreground mt-2">Пожалуйста, войдите в систему для доступа к вашему профилю</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-6">
        {/* Скелетон для профиля пользователя */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-6 w-32 mt-4" />
          <Skeleton className="h-4 w-48 mt-2" />
          
          <div className="w-full mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="py-3 px-2">
              <Skeleton className="h-4 w-24 mb-2 mx-auto" />
              <Skeleton className="h-8 w-12 mx-auto" />
            </div>
            <div className="py-3 px-2">
              <Skeleton className="h-4 w-24 mb-2 mx-auto" />
              <Skeleton className="h-8 w-12 mx-auto" />
            </div>
          </div>
        </div>
        
        {/* Скелетон для графика прогресса */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-destructive mb-4">Произошла ошибка при загрузке профиля</p>
        <Button 
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCcw size={16} />
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl p-6 shadow-sm">
        <p className="mb-4">Профиль не найден. Пожалуйста, создайте новый профиль.</p>
      </div>
    );
  }

  return null;
};

export default ProfileLoadingStates;
