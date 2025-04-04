
import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise fall back to hardcoded values
// These are public keys so it's safe to include them in the client-side code
const supabaseUrl = 'https://ejyyiilgghontvdrwuns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqeXlpaWxnZ2hvbnR2ZHJ3dW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI1MTI5ODEsImV4cCI6MjAyODA4ODk4MX0.7ezbfOe1d_jF66gCMLLQo6bT-3Dun5t_Z36fUMnzcCI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});

// Types for user data
export type Profile = {
  id: string;
  name: string;
  email: string;
  tests_completed: number;
  courses_completed: number;
  created_at?: string;
};

// Types for tests
export type Test = {
  id: number;
  title: string;
  description: string;
  questions: Question[];
};

export type Question = {
  id: number;
  text: string;
  options: string[];
  correct_option: number;
};

// Types for test results
export type TestResult = {
  id: string;
  user_id: string;
  test_id: number;
  score: number;
  total_questions: number;
  completed_at: string;
};

// Types for courses
export type Course = {
  id: number;
  title: string;
  description: string;
  image: string;
  lessons_count: number;
};
