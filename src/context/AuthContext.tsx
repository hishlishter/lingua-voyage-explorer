
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
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
      // Создаем пользователя в Auth
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password
      });

      if (error) {
        toast.error('Ошибка регистрации', {
          description: error.message
        });
        return;
      }

      // Создаем запись в таблице profiles с пустым именем
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              name: "",  // Пустое имя, которое будет заполнено позже в настройках
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

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
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
