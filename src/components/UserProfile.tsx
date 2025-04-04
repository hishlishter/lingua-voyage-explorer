
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfileProps {
  name: string;
  email: string;
  lessonsCompleted: number;
  coursesCompleted: number;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  lessonsCompleted,
  coursesCompleted,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
      <Avatar className="w-24 h-24 border-4 border-white shadow-md">
        <AvatarImage src="/lovable-uploads/e4b09532-4201-484c-9fbf-205eebe30a2f.png" />
        <AvatarFallback>АС</AvatarFallback>
      </Avatar>
      
      <h3 className="mt-4 text-xl font-semibold">{name}</h3>
      <p className="text-muted-foreground text-sm">{email}</p>
      
      <div className="w-full mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="py-3 px-2">
          <p className="text-muted-foreground text-sm">Уроков</p>
          <p className="text-3xl font-bold">{lessonsCompleted}</p>
        </div>
        <div className="py-3 px-2 border-l border-gray-200">
          <p className="text-muted-foreground text-sm">Курсов</p>
          <p className="text-3xl font-bold">{coursesCompleted}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
