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
      // Create user in Auth
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

      // Create profile record with empty name
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              name: "",  // Empty name to be filled later in settings
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
          
          // If profile creation fails, try to delete the auth user
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

  // Function to sign in with a test account
  const signInWithTestAccount = async () => {
    try {
      // Test account credentials
      const testEmail = "test@example.com";
      const testPassword = "testpassword123";
      
      console.log("Attempting to sign in with test account...");
      
      // Clear any existing session first to avoid conflicts
      await supabase.auth.signOut();
      
      // Try to sign in first
      const { error, data } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      if (error) {
        console.log("Test account login failed, creating new account:", error.message);
        
        // If login fails, create the test account
        const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
          email: testEmail,
          password: testPassword
        });
        
        if (signUpError) {
          console.error("Failed to create test account:", signUpError);
          toast.error('Не удалось создать тестовый аккаунт', {
            description: signUpError.message
          });
          return;
        }
        
        // Create profile for test user
        if (signUpData?.user) {
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
            
          if (profileError) {
            console.error('Error creating test profile:', profileError);
            toast.error('Ошибка создания тестового профиля', {
              description: profileError.message
            });
            return;
          }
          
          // Wait a moment to ensure the account is fully created before logging in
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Try to log in again after creating the account
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
        } else {
          toast.error('Не удалось создать тестовый аккаунт');
          return;
        }
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
