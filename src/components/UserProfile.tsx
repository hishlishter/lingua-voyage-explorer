
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, Profile, createOrUpdateProfile } from '@/lib/supabase';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const UserProfile = () => {
  const { user, ensureUserProfile } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempAvatarURL, setTempAvatarURL] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const fallbackProfile: Profile = user ? {
    id: user.id,
    name: user.user_metadata?.name || 'Пользователь',
    email: user.email || '',
    tests_completed: 0,
    courses_completed: 0
  } : {
    id: 'guest',
    name: 'Гость',
    email: '',
    tests_completed: 0,
    courses_completed: 0
  };

  const [localProfile, setLocalProfile] = useState<Profile | null>(null);
  
  useEffect(() => {
    if (user?.id) {
      const cachedProfile = localStorage.getItem(`profile_${user.id}`);
      if (cachedProfile) {
        try {
          const parsed = JSON.parse(cachedProfile) as Profile;
          setLocalProfile(parsed);
        } catch (e) {
          console.error('Error parsing cached profile:', e);
        }
      }
    }
  }, [user?.id]);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null;
      
      try {
        console.log('UserProfile: Fetching profile data for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('UserProfile: Error fetching profile:', error);
          
          // If profile doesn't exist, create it using the auth context helper
          if (error.code === 'PGRST116') {
            console.log('UserProfile: Profile not found, attempting to create');
            return ensureUserProfile(user);
          }
          
          return localProfile || fallbackProfile;
        }
        
        if (data) {
          console.log('UserProfile: Caching profile data:', data);
          localStorage.setItem(`profile_${user.id}`, JSON.stringify(data));
          setLocalProfile(data);
          return data;
        }
        
        return localProfile || fallbackProfile;
      } catch (e) {
        console.error('UserProfile: Unexpected error fetching profile:', e);
        return localProfile || fallbackProfile;
      }
    },
    enabled: !!user?.id,
    staleTime: 300000,
    placeholderData: localProfile || fallbackProfile,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 1
  });

  const updateAvatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      if (!user) throw new Error('User not authenticated');
      
      // Update local cache first for faster UI updates
      const updatedProfile = {
        ...(profile || localProfile || fallbackProfile),
        avatar_url: avatarUrl
      };
      setLocalProfile(updatedProfile);
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
      
      // Update profile in database
      return createOrUpdateProfile(updatedProfile);
    },
    onSuccess: () => {
      toast.success('Аватар успешно обновлен');
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
    onError: (error) => {
      toast.error('Ошибка при обновлении аватара');
      console.error('Update avatar error:', error);
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setTempAvatarURL(fileURL);
      setAvatarFile(file);
    }
  };

  const saveAvatar = async () => {
    if (!avatarFile || !user) return;
    
    try {
      setIsUploading(true);
      const fileName = `avatar-${user.id}-${Date.now()}`;
      
      const fileExt = avatarFile.name.split('.').pop();
      const fileNameWithExt = `${fileName}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileNameWithExt, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileNameWithExt);
      
      const avatarUrl = publicUrlData.publicUrl;
      
      await updateAvatarMutation.mutateAsync(avatarUrl);
      
      setDialogOpen(false);
    } catch (error) {
      toast.error('Ошибка при загрузке изображения');
      console.error('Avatar upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const profileData = profile || localProfile || fallbackProfile;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-6 w-32 mt-4" />
        <Skeleton className="h-4 w-48 mt-2" />
        <div className="w-full mt-6 grid grid-cols-2 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
        <div>Профиль не найден</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div className="relative cursor-pointer group">
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarImage src={profileData.avatar_url || '/placeholder.svg'} />
              <AvatarFallback>{getInitials(profileData.name)}</AvatarFallback>
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
                <AvatarImage src={tempAvatarURL || profileData.avatar_url || '/placeholder.svg'} />
                <AvatarFallback>{getInitials(profileData.name)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Загрузить изображение</Label>
              <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
              <Button 
                onClick={saveAvatar} 
                disabled={!avatarFile || isUploading}
              >
                {isUploading ? 'Загрузка...' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <h3 className="mt-4 text-xl font-semibold">
        {profileData.name}
      </h3>
      <p className="text-muted-foreground text-sm">
        {profileData.email}
      </p>
      
      <div className="w-full mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="py-3 px-2">
          <p className="text-muted-foreground text-sm">Пройдено тестов</p>
          <p className="text-3xl font-bold">
            {profileData.tests_completed || 0}
          </p>
        </div>
        <div className="py-3 px-2 border-l border-gray-200">
          <p className="text-muted-foreground text-sm">Пройдено курсов</p>
          <p className="text-3xl font-bold">
            {profileData.courses_completed || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
