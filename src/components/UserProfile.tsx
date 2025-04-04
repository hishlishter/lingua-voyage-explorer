
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, Profile } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface UserProfileProps {
  profile: Profile;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile: initialProfile }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState(initialProfile.avatar_url || '/lovable-uploads/e4b09532-4201-484c-9fbf-205eebe30a2f.png');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempAvatarURL, setTempAvatarURL] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: async ({ avatarUrl }: { avatarUrl: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: "Профиль обновлен",
        description: "Ваш аватар был успешно обновлен",
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить аватар",
        variant: "destructive",
      });
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const fileURL = URL.createObjectURL(file);
      setTempAvatarURL(fileURL);
    }
  };

  const saveAvatar = async () => {
    if (!uploadFile || !user) return;
    
    try {
      // Upload file to Supabase Storage
      const fileName = `avatar-${user.id}-${Date.now()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, uploadFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded file
      const { data: publicURLData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      if (!publicURLData?.publicUrl) {
        throw new Error("Failed to get public URL");
      }
      
      // Update avatar URL in the profile
      await updateProfileMutation.mutateAsync({ avatarUrl: publicURLData.publicUrl });
      
      // Update local state
      setAvatar(publicURLData.publicUrl);
      setDialogOpen(false);
      
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить аватар",
        variant: "destructive",
      });
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
              <AvatarFallback>{getInitials(initialProfile.name)}</AvatarFallback>
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
                <AvatarFallback>{getInitials(initialProfile.name)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Загрузить изображение</Label>
              <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
              <Button onClick={saveAvatar} disabled={!tempAvatarURL}>Сохранить</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <h3 className="mt-4 text-xl font-semibold">{initialProfile.name}</h3>
      <p className="text-muted-foreground text-sm">{initialProfile.email}</p>
      
      <div className="w-full mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="py-3 px-2">
          <p className="text-muted-foreground text-sm">Пройдено тестов</p>
          <p className="text-3xl font-bold">{initialProfile.tests_completed || 0}</p>
        </div>
        <div className="py-3 px-2 border-l border-gray-200">
          <p className="text-muted-foreground text-sm">Пройдено курсов</p>
          <p className="text-3xl font-bold">{initialProfile.courses_completed || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
