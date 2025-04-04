
import { createClient } from '@supabase/supabase-js';

// Default development values (these will be used if no env variables are set)
const devSupabaseUrl = 'https://your-dev-project.supabase.co';
const devSupabaseKey = 'your-dev-anon-key';

// Use environment variables if available, otherwise use development defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || devSupabaseUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || devSupabaseKey;

// Log missing environment variables warning
if (
  !import.meta.env.VITE_SUPABASE_URL || 
  !import.meta.env.VITE_SUPABASE_ANON_KEY
) {
  console.warn('Using development Supabase configuration. For production, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database entities
export type Profile = {
  id: string;
  name: string;
  email: string;
  tests_completed: number;
  courses_completed: number;
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
};

export type Question = {
  id: string;
  test_id: string;
  text: string;
  order_num: number;
  created_at?: string;
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
    return !!data.session;
  } catch (err) {
    console.error('Failed to check authentication:', err);
    return false;
  }
};
