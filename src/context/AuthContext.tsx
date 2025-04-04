
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
  const [supabaseInitialized, setSupabaseInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get initial session
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          
          // Ensure profile exists for logged in user
          if (data.session?.user) {
            await ensureUserProfile(data.session.user);
          }
        }
        
        setSupabaseInitialized(true);
      } catch (error) {
        console.error('Unexpected error during initialization:', error);
        setSupabaseInitialized(true);
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
      toast.error('Cannot sign in - Supabase is not properly configured');
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
      
      // Create profile immediately after registration
      const profile = await ensureUserProfile(data.user);
      
      if (profile) {
        console.log('Profile created successfully during signup');
      }
      
      toast.success('Registration successful', {
        description: 'You can now sign in'
      });
      navigate('/auth');
    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast.error('An error occurred during registration');
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
          toast.error('Sign out failed', {
            description: error.message
          });
          return;
        }
      }
      
      setUser(null);
      setSession(null);
      
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.error('An error occurred during sign out');
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
      
      toast.success('Signed in with test account');
      navigate('/');
    } catch (error) {
      console.error('Test account sign in error:', error);
      toast.error('Error signing in with test account');
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
