
import { createClient } from '@supabase/supabase-js';

// Default development values (these will be used if no env variables are set)
const devSupabaseUrl = 'https://ejyyiilgghontvdrwuns.supabase.co';
const devSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqeXlpaWxnZ2hvbnR2ZHJ3dW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3OTYwNzEsImV4cCI6MjA1OTM3MjA3MX0.ZMx420McFLRUBtg88_ll13_h3u7QmT7WmRaLU4VNZuc';

// Use environment variables with correct Vite naming convention if available, otherwise use development defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || devSupabaseUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || devSupabaseKey;

// Log missing environment variables warning
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using development Supabase configuration. For production, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Enhanced debugging insert helper function
export const createOrUpdateProfile = async (profile: Profile): Promise<{success: boolean, error?: any, data?: any}> => {
  try {
    console.log('Attempting to create or update profile:', profile);
    
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
    
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', profile.id)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking if profile exists:', checkError);
      return { success: false, error: checkError };
    }
    
    let result;
    
    if (existingProfile) {
      console.log('Profile exists, updating:', profile.id);
      // Update existing profile
      result = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          email: profile.email,
          tests_completed: profile.tests_completed || 0,
          courses_completed: profile.courses_completed || 0,
          avatar_url: profile.avatar_url || null
        })
        .eq('id', profile.id)
        .select();
    } else {
      console.log('Profile does not exist, creating new profile for:', profile.id);
      // Insert new profile
      result = await supabase
        .from('profiles')
        .insert([{
          id: profile.id,
          name: profile.name,
          email: profile.email,
          tests_completed: profile.tests_completed || 0,
          courses_completed: profile.courses_completed || 0,
          avatar_url: profile.avatar_url || null
        }])
        .select();
    }
    
    const { data, error } = result;
    
    if (error) {
      console.error('Profile operation error:', error);
      return { success: false, error };
    }
    
    console.log('Profile operation successful:', data);
    // Cache the profile data
    localStorage.setItem(`profile_${profile.id}`, JSON.stringify(data[0]));
    return { success: true, data: data[0] };
  } catch (err) {
    console.error('Unexpected error during profile operation:', err);
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

// Функция для загрузки тестов
export const fetchTests = async (): Promise<Test[]> => {
  try {
    console.log('Загрузка списка тестов...');
    
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Ошибка загрузки тестов:', error);
      throw error;
    }
    
    console.log('Успешно загружено тестов:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('Непредвиденная ошибка при загрузке тестов:', err);
    return [];
  }
};

// Функция для загрузки теста с вопросами и вариантами ответов
export const fetchTestWithQuestions = async (testId: string): Promise<Test | null> => {
  try {
    console.log(`Загрузка теста с ID ${testId} с вопросами и вариантами ответов...`);
    
    const { data, error } = await supabase
      .from('tests')
      .select(`
        *,
        questions:questions(
          *,
          options:options(*)
        )
      `)
      .eq('id', testId)
      .single();
    
    if (error) {
      console.error('Ошибка загрузки теста с вопросами:', error);
      throw error;
    }
    
    console.log('Успешно загружен тест с вопросами:', data?.id);
    return data;
  } catch (err) {
    console.error('Непредвиденная ошибка при загрузке теста с вопросами:', err);
    return null;
  }
};

// Функция для сохранения результатов теста
export const saveTestResult = async (userId: string, testId: string, score: number, totalQuestions: number): Promise<boolean> => {
  try {
    console.log(`Сохранение результатов теста: пользователь=${userId}, тест=${testId}, баллы=${score}/${totalQuestions}`);
    
    // Сохраняем результат теста
    const { error: resultError } = await supabase
      .from('test_results')
      .insert([{
        user_id: userId,
        test_id: testId,
        score: score,
        total_questions: totalQuestions,
      }]);
    
    if (resultError) {
      console.error('Ошибка сохранения результатов теста:', resultError);
      throw resultError;
    }
    
    // Обновляем счетчик пройденных тестов в профиле
    const { data: profileData } = await supabase
      .from('profiles')
      .select('tests_completed')
      .eq('id', userId)
      .single();
    
    if (profileData) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ tests_completed: (profileData.tests_completed || 0) + 1 })
        .eq('id', userId);
      
      if (updateError) {
        console.error('Ошибка обновления счетчика тестов в профиле:', updateError);
        throw updateError;
      }
    }
    
    console.log('Результаты теста успешно сохранены');
    return true;
  } catch (err) {
    console.error('Непредвиденная ошибка при сохранении результатов теста:', err);
    return false;
  }
};

// Функция для загрузки результатов тестов пользователя
export const fetchTestResults = async (userId: string): Promise<any[]> => {
  try {
    console.log(`Загрузка результатов тестов для пользователя ${userId}...`);
    
    const { data, error } = await supabase
      .from('test_results')
      .select(`
        *,
        test:tests(title, difficulty)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Ошибка загрузки результатов тестов:', error);
      throw error;
    }
    
    console.log('Успешно загружено результатов тестов:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('Непредвиденная ошибка при загрузке результатов тестов:', err);
    return [];
  }
};
