import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, checkAuth, Profile } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseInitialized, setSupabaseInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    
    const initializeSupabase = async () => {
      try {
        const isAuthenticated = await checkAuth();
        setSupabaseInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        setSupabaseInitialized(false);
      }
    };

    const getInitialSession = async () => {
      try {
        console.log('Fetching initial session...');
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          
          if (data.session?.user) {
            console.log('User logged in, fetching profile...');
            await fetchUserProfile(data.session.user.id);
          }
          
          setSupabaseInitialized(true);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        setSupabaseInitialized(false);
      } finally {
        setLoading(false);
      }
    };

    (async () => {
      await initializeSupabase();
      await getInitialSession();
    })();

    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          console.log('Auth state changed:', _event, session?.user?.id);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('Ensuring profile exists for user:', session.user.id);
            await ensureUserProfile(session.user);
          } else {
            setProfile(null);
          }
          
          setLoading(false);
        }
      );
      
      subscription = data.subscription;
    } catch (error) {
      console.error('Error setting up auth state change listener:', error);
      setLoading(false);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      console.log('Profile fetched successfully:', data);
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    }
  };

  const ensureUserProfile = async (user: User) => {
    try {
      console.log('Ensuring profile exists for user:', user.id);
      const profile = await fetchUserProfile(user.id);
      
      if (!profile) {
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
          await fetchUserProfile(user.id);
        }
      }
    } catch (error) {
      console.error('Unexpected error in ensureUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
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
            name: email.split('@')[0], // Default name from email
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
              name: email.split('@')[0], // Set a default name based on email
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
    if (!supabaseInitialized) {
      setUser(null);
      setSession(null);
      setProfile(null);
      toast.success('Signed out successfully');
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Sign out failed', {
          description: error.message
        });
        return;
      }
      
      setProfile(null);
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.error('An error occurred during sign out');
    }
  };

  const signInWithTestAccount = async () => {
    try {
      const testEmail = "test@example.com";
      const testPassword = "password123";
      
      console.log("Signing in with test account...");
      await signIn(testEmail, testPassword);
    } catch (error) {
      console.error('Test account sign in error:', error);
      toast.error('Error signing in with test account');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user,
      profile,
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
