
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
  const [loading, setLoading] = useState(true);
  const [supabaseInitialized, setSupabaseInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if Supabase is properly initialized
    const initializeSupabase = async () => {
      try {
        const isAuthenticated = await checkAuth();
        setSupabaseInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        setSupabaseInitialized(false);
      } finally {
        setLoading(false);
      }
    };

    // Get current session on load
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
        setSupabaseInitialized(false);
      } finally {
        setLoading(false);
      }
    };

    initializeSupabase();
    getInitialSession();

    // Subscribe to auth state changes
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
      
      subscription = data.subscription;
    } catch (error) {
      console.error('Error setting up auth state change listener:', error);
    }

    // Unsubscribe on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

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
      
      // Register new user
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
      
      // Create profile for new user
      try {
        // Using adminAuthClient directly to bypass RLS
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              name: email.split('@')[0], // Set a default name based on email
              email: email,
              tests_completed: 0,
              courses_completed: 0
            }
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          
          // Even if profile creation fails, we still allow the user to sign in
          // The profile can be created later
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
      // If Supabase isn't initialized, just clear local state
      setUser(null);
      setSession(null);
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
