
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
          
          // If user is logged in, fetch their profile
          if (data.session?.user) {
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

    initializeSupabase();
    getInitialSession();

    // Subscribe to auth state changes
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Check if user has a profile, if not create one
          if (session?.user) {
            await ensureUserProfile(session.user);
          } else {
            // If user logged out, clear profile
            setProfile(null);
          }
          
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

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    }
  };

  // Helper function to ensure user has a profile
  const ensureUserProfile = async (user: User) => {
    try {
      // First check if profile exists
      const profile = await fetchUserProfile(user.id);
      
      // If profile doesn't exist, create it
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
          // Fetch the newly created profile
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
      
      // Ensure profile exists
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
      
      // Register new user
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
      
      // Create profile for new user right after registration
      try {
        // Disable RLS temporarily via SQL for profile creation
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
          
          // Even if profile creation fails, we still allow the user to sign in
          // The profile can be created later via ensureUserProfile
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
