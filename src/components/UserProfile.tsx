
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  const [avatar, setAvatar] = useState('/lovable-uploads/e4b09532-4201-484c-9fbf-205eebe30a2f.png');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempAvatarURL, setTempAvatarURL] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setTempAvatarURL(fileURL);
    }
  };

  const saveAvatar = () => {
    if (tempAvatarURL) {
      setAvatar(tempAvatarURL);
      setDialogOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div className="relative cursor-pointer group">
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarImage src={avatar} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить аватар</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={tempAvatarURL || avatar} />
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Загрузить изображение</Label>
              <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
              <Button onClick={saveAvatar}>Сохранить</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
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
