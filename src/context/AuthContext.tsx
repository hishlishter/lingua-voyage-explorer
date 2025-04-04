import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithTestAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error('Ошибка входа', {
          description: error.message
        });
        return;
      }
      
      toast.success('Вход выполнен успешно');
      navigate('/');
    } catch (error) {
      console.error('Ошибка входа:', error);
      toast.error('Произошла ошибка при входе');
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({ 
        email,
        password,
        options: {
          data: {
            name: "",
          }
        }
      });

      if (error) {
        toast.error('Ошибка регистрации', {
          description: error.message
        });
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              name: "", 
              email: email,
              tests_completed: 0,
              courses_completed: 0
            }
          ]);

        if (profileError) {
          console.error('Ошибка создания профиля:', profileError);
          toast.error('Ошибка создания профиля', {
            description: profileError.message
          });
          
          try {
            await supabase.auth.admin.deleteUser(data.user.id);
          } catch (deleteError) {
            console.error('Failed to delete user after profile creation error:', deleteError);
          }
          
          return;
        }
      }
      
      toast.success('Регистрация успешна', {
        description: 'Теперь вы можете войти в систему'
      });
      navigate('/auth');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      toast.error('Произошла ошибка при регистрации');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Выход выполнен успешно');
      navigate('/auth');
    } catch (error) {
      console.error('Ошибка выхода:', error);
      toast.error('Произошла ошибка при выходе из системы');
    }
  };

  const signInWithTestAccount = async () => {
    try {
      const testEmail = "test@example.com";
      const testPassword = "testpassword123";
      
      console.log("Attempting to sign in with test account...");
      
      const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      if (!signInError && signInData.user) {
        console.log("Test account login successful");
        toast.success('Вход с тестовым аккаунтом выполнен успешно');
        navigate('/');
        return;
      }
      
      console.log("Test account login failed, attempting to create account:", signInError?.message);
      
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: "Тестовый Пользователь",
          }
        }
      });
      
      if (signUpError) {
        if (signUpError?.message?.includes('already registered')) {
          toast.error('Ошибка входа с тестовым аккаунтом', {
            description: 'Аккаунт существует, но пароль может быть некорректным. Попробуйте сбросить пароль.'
          });
          return;
        }
        
        toast.error('Не удалось создать тестовый аккаунт', {
          description: signUpError.message
        });
        return;
      }
      
      if (!signUpData?.user) {
        toast.error('Не удалось создать тестовый аккаунт');
        return;
      }
      
      console.log("Creating test profile for user:", signUpData.user.id);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: signUpData.user.id, 
            name: "Тестовый Пользователь",
            email: testEmail,
            tests_completed: 3,
            courses_completed: 2
          }
        ]);
        
      if (profileError && !profileError.message.includes('already exists')) {
        console.error('Error creating test profile:', profileError);
        toast.error('Ошибка создания тестового профиля', {
          description: profileError.message
        });
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      if (loginError) {
        console.error("Failed to login after creating test account:", loginError);
        toast.error('Не удалось войти с тестовым аккаунтом', {
          description: loginError.message
        });
        return;
      }
      
      console.log("Test account login successful");
      toast.success('Вход с тестовым аккаунтом выполнен успешно');
      navigate('/');
    } catch (error: any) {
      console.error('Ошибка при входе с тестовым аккаунтом:', error);
      toast.error('Произошла ошибка при входе с тестовым аккаунтом', {
        description: error?.message || 'Неизвестная ошибка'
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      signInWithTestAccount 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
