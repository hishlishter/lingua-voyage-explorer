
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

  if (isError) {
    return (
      <div className="text-center py-8 bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-destructive mb-4">Произошла ошибка при загрузке профиля</p>
        <Button 
          onClick={onRetry}
          className="flex items-center gap-2"
          variant="destructive"
        >
          <RefreshCcw size={16} />
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8 bg-white rounded-2xl p-6 shadow-sm">
        <p className="mb-4">Профиль не найден. Пожалуйста, создайте новый профиль.</p>
      </div>
    );
  }

  return null;
};

export default ProfileLoadingStates;
