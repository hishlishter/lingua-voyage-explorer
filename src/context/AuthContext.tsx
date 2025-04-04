
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, checkAuth, Profile } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';

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
  const { fetchUserProfile, ensureUserProfile } = useProfile();

  useEffect(() => {
    console.log('AuthProvider effect running');
    let isMounted = true;
    let loadingTimeout: NodeJS.Timeout | null = null;
    
    // Set maximum loading time to prevent infinite loading
    loadingTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.error('Auth loading timeout reached, forcing completion');
        setLoading(false);
      }
    }, 10000); // 10 seconds max loading time
    
    const initializeSupabase = async () => {
      try {
        const isAuthenticated = await checkAuth();
        console.log('Supabase initialized, authenticated:', isAuthenticated);
        if (isMounted) setSupabaseInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        if (isMounted) setSupabaseInitialized(false);
      }
    };

    const getInitialSession = async () => {
      try {
        console.log('Fetching initial session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) setLoading(false);
          return;
        }
        
        console.log('Session data:', data.session?.user?.id || 'No session');
        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
        
        if (data.session?.user) {
          console.log('User logged in, fetching profile...');
          if (isMounted) {
            const profileData = await fetchUserProfile(data.session.user.id);
            if (profileData) {
              setProfile(profileData);
            } else if (isMounted) {
              console.log('No profile found, creating one...');
              await ensureUserProfile(data.session.user, setProfile);
            }
          }
        } else {
          console.log('No user in session');
        }
        
        if (isMounted) {
          setSupabaseInitialized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        if (isMounted) {
          setSupabaseInitialized(false);
          setLoading(false);
        }
      }
    };

    // Execute initialization sequence
    (async () => {
      await initializeSupabase();
      await getInitialSession();
    })();

    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
        
        if (session?.user) {
          console.log('Ensuring profile exists for user:', session.user.id);
          if (isMounted) {
            await ensureUserProfile(session.user, setProfile);
          }
        } else if (isMounted) {
          setProfile(null);
        }
        
        if (isMounted) setLoading(false);
      }
    );
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (loadingTimeout) clearTimeout(loadingTimeout);
      data.subscription.unsubscribe();
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
      
      if (data.user) {
        await ensureUserProfile(data.user, setProfile);
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
