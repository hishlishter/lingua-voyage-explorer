
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для данных пользователя
export type Profile = {
  id: string;
  name: string;
  email: string;
  tests_completed: number;
  courses_completed: number;
  created_at?: string;
};

// Типы для тестов
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

// Типы для результатов тестов
export type TestResult = {
  id: string;
  user_id: string;
  test_id: number;
  score: number;
  total_questions: number;
  completed_at: string;
};

// Типы для курсов
export type Course = {
  id: number;
  title: string;
  description: string;
  image: string;
  lessons_count: number;
};
