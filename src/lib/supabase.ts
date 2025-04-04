import { createClient } from '@supabase/supabase-js';

// Use the specific Supabase URLs and keys provided in the user configuration
const supabaseUrl = 'https://ejyyiilgghontvdrwuns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqeXlpaWxnZ2hvbnR2ZHJ3dW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3OTYwNzEsImV4cCI6MjA1OTM3MjA3MX0.ZMx420McFLRUBtg88_ll13_h3u7QmT7WmRaLU4VNZuc';

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database entities
export type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
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

export type TestResult = {
  id: string;
  user_id: string;
  test_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
};

export type Word = {
  id: string;
  word: string;
  translation: string;
  example?: string;
  created_at?: string;
};

export type WordSet = {
  id: string;
  title: string;
  description?: string;
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
