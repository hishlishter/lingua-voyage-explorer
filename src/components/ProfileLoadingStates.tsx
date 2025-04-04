
import React from 'react';

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
      <div className="text-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
          <div className="h-4 w-24 bg-primary/20 rounded mb-2"></div>
          <div className="h-2 w-16 bg-primary/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-2">Ошибка при загрузке профиля</p>
        <button 
          className="text-primary hover:underline"
          onClick={onRetry}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p>Профиль не найден. Пожалуйста, создайте новый профиль.</p>
      </div>
    );
  }

  return null;
};

export default ProfileLoadingStates;
