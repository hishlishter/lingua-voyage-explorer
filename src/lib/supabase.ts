
import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise fall back to hardcoded values
// These are public keys so it's safe to include them in the client-side code
const supabaseUrl = 'https://ejyyiilgghontvdrwuns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqeXlpaWxnZ2hvbnR2ZHJ3dW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3OTYwNzEsImV4cCI6MjA1OTM3MjA3MX0.ZMx420McFLRUBtg88_ll13_h3u7QmT7WmRaLU4VNZuc';

// Initialize the Supabase client with the correct configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'margo-app-auth',
  },
});

// Types for user data
export type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  tests_completed: number;
  courses_completed: number;
  created_at?: string;
};

// Types for tests
export type Test = {
  id: number;
  title: string;
  description: string;
  image?: string;
  level?: string;
  created_at?: string;
  questions?: Question[];
};

export type Question = {
  id: number;
  test_id?: number;
  text: string;
  created_at?: string;
  options?: Option[];
};

export type Option = {
  id: number;
  question_id?: number;
  text: string;
  is_correct: boolean;
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
  level?: string;
  lessons_count: number;
  created_at?: string;
};

export type Lesson = {
  id: number;
  course_id: number;
  title: string;
  content?: string;
  order_number: number;
  created_at?: string;
};

export type CourseProgress = {
  id: string;
  user_id: string;
  course_id: number;
  lessons_completed: number;
  completed: boolean;
  last_viewed_at: string;
};

// Types for dictionary
export type DictionaryWord = {
  id: number;
  word: string;
  translation: string;
  example?: string;
  created_at?: string;
};

export type WordSet = {
  id: number;
  title: string;
  description?: string;
  created_at?: string;
  words?: DictionaryWord[];
};

export type UserWordProgress = {
  id: string;
  user_id: string;
  word_id: number;
  learned: boolean;
  last_reviewed_at: string;
};
