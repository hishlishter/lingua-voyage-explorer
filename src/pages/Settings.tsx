
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase, Profile, createOrUpdateProfile } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Введите текущий пароль"),
  newPassword: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  confirmPassword: z.string().min(1, "Подтвердите новый пароль")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"]
});

const profileSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа")
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type ProfileFormValues = z.infer<typeof profileSchema>;

const Settings = () => {
  const { user, ensureUserProfile } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const queryClient = useQueryClient();

  // Get profile data from Supabase
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        console.log('Settings: Fetching profile for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Settings: Error fetching profile:', error);
          
          // If profile doesn't exist, create it
          if (error.code === 'PGRST116') {
            console.log('Settings: Profile not found, creating new profile');
            return ensureUserProfile(user);
          }
          
          throw error;
        }
        
        console.log('Settings: Successfully fetched profile:', data);
        return data as Profile;
      } catch (err) {
        console.error('Settings: Unexpected error fetching profile:', err);
        throw err;
      }
    },
    enabled: !!user,
    staleTime: 300000,
    refetchOnWindowFocus: false
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: ''
    }
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      profileForm.reset({ name: profile.name || '' });
    }
  }, [profile, profileForm]);

  const onPasswordSubmit = (values: PasswordFormValues) => {
    setIsChangingPassword(true);
    
    // Placeholder for actual password change API call
    setTimeout(() => {
      toast.success("Пароль успешно изменен");
      passwordForm.reset();
      setIsChangingPassword(false);
    }, 1500);
  };

  const onProfileSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsUpdatingProfile(true);
    
    try {
      console.log('Settings: Updating profile with name:', values.name);
      
      // Create profile data object
      const profileData: Profile = {
        id: user.id,
        name: values.name,
        email: user.email || '',
        tests_completed: profile?.tests_completed || 0,
        courses_completed: profile?.courses_completed || 0,
        avatar_url: profile?.avatar_url
      };
      
      // Update profile using the helper function
      const { success, error } = await createOrUpdateProfile(profileData);
      
      if (!success) {
        throw error || new Error('Failed to update profile');
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      
      toast.success("Профиль успешно обновлен");
    } catch (err: any) {
      console.error('Settings: Error updating profile:', err);
      toast.error("Произошла ошибка при обновлении профиля", {
        description: err.message || "Неизвестная ошибка"
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Настройки</h1>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Профиль</CardTitle>
                <CardDescription>Обновите ваше имя и данные профиля</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div>Загрузка данных профиля...</div>
                ) : (
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                              <Input placeholder="Ваше имя" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isUpdatingProfile}>
                        {isUpdatingProfile ? "Обновление..." : "Обновить профиль"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Безопасность</CardTitle>
                <CardDescription>Управление паролем и безопасностью аккаунта</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Текущий пароль</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Новый пароль</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Подтвердите новый пароль</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? "Изменение..." : "Изменить пароль"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Уведомления</CardTitle>
                <CardDescription>Настройте предпочтения уведомлений</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Настройки уведомлений будут добавлены в ближайшее время.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
