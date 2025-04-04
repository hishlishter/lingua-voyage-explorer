import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, checkAuth } from '@/lib/supabase';
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [supabaseInitialized, setSupabaseInitialized] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        const isAuthenticated = await checkAuth();
        setSupabaseInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        setSupabaseInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setSupabaseInitialized(true);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        setSupabaseInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    initializeSupabase();
    getInitialSession();

    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await ensureUserProfile(session.user);
          }
          
          setLoading(false);
        }
      );
      
      subscription = data.subscription;
    } catch (error) {
      console.error('Error setting up auth state change listener:', error);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const ensureUserProfile = async (user: User) => {
    try {
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking for profile:', checkError);
        return;
      }

      if (!existingProfile) {
        console.log('Profile not found, creating new profile for:', user.id);
        const { error: createError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: user.id, 
              name: user.email?.split('@')[0] || 'User', 
              email: user.email || '',
              tests_completed: 0,
              courses_completed: 0
            }
          ]);

        if (createError) {
          console.error('Profile creation error:', createError);
          toast.error('Ошибка создания профиля', {
            description: createError.message
          });
        } else {
          console.log('Profile created successfully for user:', user.id);
        }
      }
    } catch (error) {
      console.error('Unexpected error in ensureUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (email === "test@example.com" && password === "password123") {
      return signInWithTestAccount();
    }

    if (!supabaseInitialized) {
      toast.error('Cannot sign in - Supabase is not properly configured');
      return;
    }

    try {
      console.log('Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        toast.error('Sign in failed', {
          description: error.message
        });
        return;
      }
      
      console.log('Sign in successful for user:', data.user?.id);
      
      if (data.user) {
        await ensureUserProfile(data.user);
      }
      
      toast.success('Signed in successfully');
      navigate('/');
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast.error('An error occurred during sign in');
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!supabaseInitialized) {
      toast.error('Cannot sign up - Supabase is not properly configured');
      return;
    }

    try {
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
        toast.error('Registration failed', {
          description: error.message
        });
        return;
      }

      if (!data.user) {
        console.error('User not created');
        toast.error('User not created');
        return;
      }

      console.log('User registered successfully:', data.user.id);
      
      try {
        const { error: createError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              name: email.split('@')[0],
              email: email,
              tests_completed: 0,
              courses_completed: 0
            }
          ])
          .select();

        if (createError) {
          console.error('Profile creation error:', createError);
          toast.warning('Profile creation issue', {
            description: 'Your account was created but there was an issue setting up your profile. You can still sign in.'
          });
        } else {
          console.log('Profile created successfully for user:', data.user.id);
        }
      } catch (profileError) {
        console.error('Unexpected profile creation error:', profileError);
      }
      
      toast.success('Registration successful', {
        description: 'You can now sign in'
      });
      navigate('/auth');
    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast.error('An error occurred during registration');
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setSession(null);
      
      if (user?.id) {
        localStorage.removeItem(`profile_${user.id}`);
      }
      
      if (supabaseInitialized) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Sign out error:', error);
          toast.error('Sign out failed', {
            description: error.message
          });
          return;
        }
      }
      
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.error('An error occurred during sign out');
    }
  };

  const signInWithTestAccount = async () => {
    try {
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
      
      toast.success('Signed in with test account');
      navigate('/');
    } catch (error) {
      console.error('Test account sign in error:', error);
      toast.error('Error signing in with test account');
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
      supabaseInitialized
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
