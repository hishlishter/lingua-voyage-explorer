import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, createOrUpdateProfile, Profile } from '@/lib/supabase';
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
  supabaseInitialized: boolean;
  ensureUserProfile: (user: User) => Promise<Profile | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseInitialized, setSupabaseInitialized] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check if Supabase is initialized correctly
        const checkResult = await supabase.auth.getSession();
        console.log('Supabase initialization check:', checkResult);
        
        // Get initial session
        const { data, error } = checkResult;
        
        if (error) {
          console.error('Error getting session:', error);
          setSupabaseInitialized(false);
        } else {
          setSupabaseInitialized(true);
          setSession(data.session);
          setUser(data.session?.user ?? null);
          
          // Ensure profile exists for logged in user
          if (data.session?.user) {
            await ensureUserProfile(data.session.user);
          }
        }
      } catch (error) {
        console.error('Unexpected error during initialization:', error);
        setSupabaseInitialized(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Ensure profile exists when user signs in
        if (session?.user) {
          await ensureUserProfile(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const ensureUserProfile = async (user: User): Promise<Profile | null> => {
    if (!user) return null;
    
    try {
      console.log('Ensuring profile exists for user:', user.id);
      
      // Create profile data
      const profileData: Profile = {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        tests_completed: 0,
        courses_completed: 0
      };
      
      // Try to create or update profile
      const { success, data, error } = await createOrUpdateProfile(profileData);
      
      if (!success) {
        console.error('Failed to ensure user profile:', error);
        toast.error('Ошибка создания профиля', {
          description: error?.message || 'Неизвестная ошибка'
        });
        return null;
      }
      
      if (data) {
        return data as Profile;
      }
      
      return profileData;
    } catch (error) {
      console.error('Unexpected error in ensureUserProfile:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    if (email === "test@example.com" && password === "password123") {
      return signInWithTestAccount();
    }

    if (!supabaseInitialized) {
      console.log('Attempting to sign in with Supabase not properly configured');
      toast.warning('Supabase не настроен', {
        description: 'Используйте тестовый аккаунт для входа'
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        toast.error('Ошибка входа', {
          description: error.message
        });
        return;
      }
      
      console.log('Sign in successful for user:', data.user?.id);
      
      // Ensure profile exists
      if (data.user) {
        await ensureUserProfile(data.user);
      }
      
      toast.success('Вход выполнен успешно');
      navigate('/');
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast.error('Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!supabaseInitialized) {
      toast.error('Cannot sign up - Supabase is not properly configured');
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting registration for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split('@')[0]
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast.error('Ошибка регистрации', {
          description: error.message
        });
        return;
      }

      if (!data.user) {
        console.error('User not created');
        toast.error('Пользователь не создан');
        return;
      }

      console.log('User registered successfully:', data.user.id);
      
      // Create profile immediately after registration
      const profile = await ensureUserProfile(data.user);
      
      if (profile) {
        console.log('Profile created successfully during signup');
      }
      
      toast.success('Регистрация выполнена успешно', {
        description: 'Вы можете войти'
      });
      navigate('/auth');
    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast.error('Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      if (user?.id) {
        localStorage.removeItem(`profile_${user.id}`);
      }
      
      if (supabaseInitialized) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Sign out error:', error);
          toast.error('Ошибка выхода', {
            description: error.message
          });
          return;
        }
      }
      
      setUser(null);
      setSession(null);
      
      toast.success('Выход выполнен успешно');
      navigate('/auth');
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.error('Произошла ошибка при выходе');
    } finally {
      setLoading(false);
    }
  };

  const signInWithTestAccount = async () => {
    try {
      setLoading(true);
      console.log("Signing in with test account...");
      
      const testUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        role: '',
        updated_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        phone: '',
        factors: null,
        identities: []
      } as User;
      
      setUser(testUser);
      
      const mockSession = {
        user: testUser,
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        token_type: 'bearer'
      } as Session;
      
      setSession(mockSession);
      
      // Create test profile
      const testProfile: Profile = {
        id: testUser.id,
        name: 'Test User',
        email: 'test@example.com',
        tests_completed: 5,
        courses_completed: 3
      };
      
      localStorage.setItem(`profile_${testUser.id}`, JSON.stringify(testProfile));
      
      toast.success('Вход выполнен с тестовым аккаунтом');
      navigate('/');
    } catch (error) {
      console.error('Test account sign in error:', error);
      toast.error('Ошибка входа с тестовым аккаунтом');
    } finally {
      setLoading(false);
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
      signInWithTestAccount,
      supabaseInitialized,
      ensureUserProfile
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
