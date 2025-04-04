
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
    // Получаем текущую сессию при загрузке
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Ошибка получения сессии:', error);
        } else {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (error) {
        console.error('Неожиданная ошибка при получении сессии:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Подписываемся на изменения состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Отписываемся при размонтировании компонента
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Попытка входа для:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Ошибка входа:', error);
        toast.error('Ошибка входа', {
          description: error.message
        });
        return;
      }
      
      console.log('Вход успешен для пользователя:', data.user?.id);
      toast.success('Вход выполнен успешно');
      navigate('/');
    } catch (error) {
      console.error('Непредвиденная ошибка входа:', error);
      toast.error('Произошла ошибка при входе');
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Попытка регистрации для:', email);
      
      // Регистрация нового пользователя
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: "",
          }
        }
      });

      if (error) {
        console.error('Ошибка регистрации:', error);
        toast.error('Ошибка регистрации', {
          description: error.message
        });
        return;
      }

      if (!data.user) {
        console.error('Пользователь не создан');
        toast.error('Пользователь не создан');
        return;
      }

      console.log('Пользователь успешно зарегистрирован:', data.user.id);
      
      // Создаем профиль для нового пользователя
      try {
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
          return;
        }
      } catch (profileError) {
        console.error('Непредвиденная ошибка при создании профиля:', profileError);
      }
      
      toast.success('Регистрация успешна', {
        description: 'Теперь вы можете войти в систему'
      });
      navigate('/auth');
    } catch (error) {
      console.error('Непредвиденная ошибка регистрации:', error);
      toast.error('Произошла ошибка при регистрации');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Ошибка выхода:', error);
        toast.error('Ошибка выхода', {
          description: error.message
        });
        return;
      }
      
      toast.success('Выход выполнен успешно');
      navigate('/auth');
    } catch (error) {
      console.error('Непредвиденная ошибка выхода:', error);
      toast.error('Произошла ошибка при выходе из системы');
    }
  };

  const signInWithTestAccount = async () => {
    try {
      const testEmail = "test@example.com";
      const testPassword = "password123";
      
      console.log("Вход с тестовым аккаунтом...");
      await signIn(testEmail, testPassword);
    } catch (error) {
      console.error('Ошибка при входе с тестовым аккаунтом:', error);
      toast.error('Произошла ошибка при входе с тестовым аккаунтом');
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
