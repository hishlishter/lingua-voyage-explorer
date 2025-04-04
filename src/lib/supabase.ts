
import { createClient } from '@supabase/supabase-js';

// Default development values (these will be used if no env variables are set)
const devSupabaseUrl = 'https://ejyyiilgghontvdrwuns.supabase.co';
const devSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqeXlpaWxnZ2hvbnR2ZHJ3dW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3OTYwNzEsImV4cCI6MjA1OTM3MjA3MX0.ZMx420McFLRUBtg88_ll13_h3u7QmT7WmRaLU4VNZuc';

// Use environment variables with correct Vite naming convention if available, otherwise use development defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL || devSupabaseUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY || devSupabaseKey;

// Log missing environment variables warning
if (
  (!import.meta.env.VITE_SUPABASE_URL && !import.meta.env.REACT_APP_SUPABASE_URL) || 
  (!import.meta.env.VITE_SUPABASE_ANON_KEY && !import.meta.env.REACT_APP_SUPABASE_ANON_KEY)
) {
  console.warn('Using development Supabase configuration. For production, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  debug: true,
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Enhanced debugging insert helper function
export const debugInsertProfile = async (profile: Profile): Promise<{success: boolean, error?: any, data?: any}> => {
  try {
    console.log('Attempting to insert profile:', profile);
    
    // Ensure all required fields are present
    if (!profile.id) {
      console.error('Profile ID is required');
      return { success: false, error: 'Profile ID is required' };
    }
    
    if (!profile.name) {
      console.error('Profile name is required');
      return { success: false, error: 'Profile name is required' };
    }
    
    if (!profile.email) {
      console.error('Profile email is required');
      return { success: false, error: 'Profile email is required' };
    }
    
    // Insert with explicit column names to avoid potential SQL issues
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: profile.id,
        name: profile.name,
        email: profile.email,
        tests_completed: profile.tests_completed || 0,
        courses_completed: profile.courses_completed || 0,
        avatar_url: profile.avatar_url || null
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Insert profile error:', error);
      return { success: false, error };
    }
    
    console.log('Profile inserted successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error during profile insert:', err);
    return { success: false, error: err };
  }
};

// Type definitions for database entities
export type Profile = {
  id: string;
  name: string;
  email: string;
  tests_completed: number;
  courses_completed: number;
  avatar_url?: string;
  created_at?: string;
};

export type Test = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  questions_count: number;
  time_limit: number;
  created_at?: string;
  questions?: Question[]; // Add the questions array to fix TypeScript errors
};

export type Question = {
  id: string;
  test_id: string;
  text: string;
  order_num: number;
  created_at?: string;
  options?: Option[]; // Add the options array for convenience
};

export type Option = {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  created_at?: string;
};

// Function to check if authentication is working
export const checkAuth = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Supabase authentication error:', error.message);
      return false;
    }
    console.log('Auth session check:', data.session ? 'User is authenticated' : 'No active session');
    return !!data.session;
  } catch (err) {
    console.error('Failed to check authentication:', err);
    return false;
  }
};
