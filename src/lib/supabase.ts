
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions
export interface Profile {
  id: string;
  name: string;
  email: string;
  tests_completed: number;
  courses_completed: number;
  avatar_url?: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time_limit: number;
  total_questions: number;
  created_at?: string;
}

export interface Question {
  id: string;
  test_id: string;
  text: string;
  options: Option[];
  correct_option_id: string;
  explanation?: string;
}

export interface Option {
  id: string;
  question_id: string;
  text: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  lessons_count: number;
  duration?: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  order_index: number;
}

export interface PracticeTest {
  id: string;
  lesson_id: string;
  title: string;
  questions: PracticeQuestion[];
}

export interface PracticeQuestion {
  id: string;
  text: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

// Fetch functions
export const fetchTests = async (): Promise<Test[]> => {
  try {
    console.log('Загрузка тестов...');
    const { data, error } = await supabase.from('tests').select('*');
    
    if (error) {
      console.error('Ошибка загрузки тестов:', error);
      return [];
    }
    
    console.log('Успешно загружено тестов:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('Непредвиденная ошибка при загрузке тестов:', err);
    return [];
  }
};

export const fetchTestResults = async (userId: string): Promise<any[]> => {
  try {
    console.log(`Загрузка результатов тестов для пользователя ${userId}...`);
    
    // Пробуем сначала получить данные с полным набором полей
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Ошибка загрузки результатов тестов:', error);
        return [];
      }
      
      console.log('Успешно загружено результатов тестов:', data?.length || 0);
      
      // Если получили данные, пробуем дополнительно загрузить связанные данные тестов
      try {
        // Для каждого результата пробуем загрузить информацию о тесте
        const testsData = await Promise.all(
          data.map(async (result) => {
            try {
              const { data: testData } = await supabase
                .from('tests')
                .select('title, difficulty')
                .eq('id', result.test_id)
                .single();
              
              return {
                ...result,
                test: testData || null
              };
            } catch (e) {
              console.warn(`Не удалось загрузить данные для теста ${result.test_id}:`, e);
              return result;
            }
          })
        );
        
        return testsData;
      } catch (e) {
        console.warn('Не удалось загрузить связанные данные тестов:', e);
        return data || [];
      }
    } catch (e) {
      console.error('Непредвиденная ошибка при загрузке результатов тестов:', e);
      return [];
    }
  } catch (err) {
    console.error('Непредвиденная ошибка при загрузке результатов тестов:', err);
    return [];
  }
};

export const fetchTestWithQuestions = async (testId: string): Promise<{ test: Test | null, questions: Question[] }> => {
  try {
    console.log(`Загрузка теста ${testId} с вопросами...`);
    
    // Получаем данные теста
    const { data: testData, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();
    
    if (testError) {
      console.error('Ошибка при загрузке теста:', testError);
      return { test: null, questions: [] };
    }
    
    // Получаем вопросы для теста
    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .select('*, options(*)')
      .eq('test_id', testId);
    
    if (questionError) {
      console.error('Ошибка при загрузке вопросов:', questionError);
      return { test: testData, questions: [] };
    }
    
    console.log(`Загружен тест "${testData.title}" с ${questionData?.length || 0} вопросами`);
    return { 
      test: testData, 
      questions: questionData as Question[] || [] 
    };
  } catch (err) {
    console.error('Непредвиденная ошибка при загрузке теста с вопросами:', err);
    return { test: null, questions: [] };
  }
};

export const saveTestResult = async (resultData: {
  user_id: string,
  test_id: string,
  score: number,
  total_questions: number,
  answers?: Record<string, string>,
  is_perfect_score?: boolean
}): Promise<{ success: boolean, error?: any, data?: any }> => {
  try {
    console.log('Сохранение результатов теста:', resultData);
    
    // Проверяем обязательные поля
    if (!resultData.user_id || !resultData.test_id) {
      console.error('Отсутствуют обязательные поля (user_id или test_id)');
      return { 
        success: false, 
        error: 'Отсутствуют обязательные поля' 
      };
    }
    
    // Базовые данные для вставки
    const baseData = {
      user_id: resultData.user_id,
      test_id: resultData.test_id,
      score: resultData.score || 0,
      total_questions: resultData.total_questions || 0,
      is_perfect_score: resultData.is_perfect_score || false
    };
    
    // Добавляем answers, если они есть
    const insertData = resultData.answers 
      ? { ...baseData, answers: resultData.answers }
      : baseData;
    
    // Вставляем запись в таблицу test_results
    const { data, error } = await supabase
      .from('test_results')
      .insert([insertData])
      .select();
    
    if (error) {
      console.error('Ошибка при сохранении результатов теста:', error);
      
      // Пробуем сохранить без поля is_perfect_score, если это вызвало ошибку
      if (error.message?.includes('is_perfect_score')) {
        console.log('Пробуем сохранить без поля is_perfect_score...');
        const { data: retryData, error: retryError } = await supabase
          .from('test_results')
          .insert([{
            user_id: resultData.user_id,
            test_id: resultData.test_id,
            score: resultData.score || 0,
            total_questions: resultData.total_questions || 0,
            answers: resultData.answers
          }])
          .select();
        
        if (retryError) {
          console.error('Повторная ошибка при сохранении результатов:', retryError);
          return { success: false, error: retryError };
        }
        
        console.log('Результаты успешно сохранены (без is_perfect_score):', retryData);
        return { success: true, data: retryData };
      }
      
      return { success: false, error };
    }
    
    console.log('Результаты успешно сохранены:', data);
    
    // Обновляем счетчик пройденных тестов в профиле пользователя
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('tests_completed')
        .eq('id', resultData.user_id)
        .single();
      
      if (!profileError && profileData) {
        const testsCompleted = (profileData.tests_completed || 0) + 1;
        
        await supabase
          .from('profiles')
          .update({ tests_completed: testsCompleted })
          .eq('id', resultData.user_id);
        
        console.log(`Обновлен счетчик пройденных тестов: ${testsCompleted}`);
      }
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Непредвиденная ошибка при сохранении результатов теста:', err);
    return { success: false, error: err };
  }
};

export const createOrUpdateProfile = async (profileData: Profile): Promise<{ success: boolean, data?: Profile | null, error?: any }> => {
  try {
    console.log('Creating or updating profile:', profileData);
    
    if (!profileData.id) {
      console.error('Profile ID is required');
      return { success: false, error: 'Profile ID is required' };
    }
    
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileData.id)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing profile:', fetchError);
      return { success: false, error: fetchError };
    }
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', profileData.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        return { success: false, error };
      }
      
      console.log('Profile updated successfully:', data);
      result = { success: true, data };
    } else {
      // Insert new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating profile:', error);
        return { success: false, error };
      }
      
      console.log('Profile created successfully:', data);
      result = { success: true, data };
    }
    
    return result;
  } catch (error) {
    console.error('Unexpected error in createOrUpdateProfile:', error);
    return { success: false, error };
  }
};

// Functions for course management
export const fetchCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*');
    
    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching courses:', error);
    return [];
  }
};

export const fetchCourseWithLessons = async (courseId: string): Promise<{ course: Course | null, lessons: Lesson[] }> => {
  try {
    // Get course details
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (courseError) {
      console.error('Error fetching course:', courseError);
      return { course: null, lessons: [] };
    }
    
    // Get lessons for this course
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });
    
    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
      return { course: courseData, lessons: [] };
    }
    
    return { 
      course: courseData, 
      lessons: lessonsData || [] 
    };
  } catch (error) {
    console.error('Unexpected error fetching course with lessons:', error);
    return { course: null, lessons: [] };
  }
};

export const fetchCourseProgress = async (userId: string, courseId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching course progress:', error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error('Unexpected error fetching course progress:', error);
    return null;
  }
};

export const updateCourseProgress = async (progressData: any): Promise<{ success: boolean, data?: any }> => {
  try {
    const { user_id, course_id } = progressData;
    
    if (!user_id || !course_id) {
      return { success: false };
    }
    
    // Check if progress record exists
    const { data: existingProgress } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', user_id)
      .eq('course_id', course_id)
      .maybeSingle();
    
    let result;
    
    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('course_progress')
        .update(progressData)
        .eq('id', existingProgress.id)
        .select();
      
      if (error) {
        console.error('Error updating course progress:', error);
        return { success: false };
      }
      
      result = { success: true, data };
    } else {
      // Insert new progress record
      const { data, error } = await supabase
        .from('course_progress')
        .insert([progressData])
        .select();
      
      if (error) {
        console.error('Error creating course progress:', error);
        return { success: false };
      }
      
      result = { success: true, data };
    }
    
    // Update user profile with completed courses count
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('courses_completed')
        .eq('id', user_id)
        .single();
      
      if (profileData && progressData.completed) {
        await supabase
          .from('profiles')
          .update({ courses_completed: (profileData.courses_completed || 0) + 1 })
          .eq('id', user_id);
      }
    } catch (err) {
      console.error('Error updating profile courses count:', err);
    }
    
    return result;
  } catch (error) {
    console.error('Unexpected error updating course progress:', error);
    return { success: false };
  }
};

export const fetchPracticeTestForLesson = async (lessonId: string): Promise<PracticeTest | null> => {
  try {
    const { data, error } = await supabase
      .from('practice_tests')
      .select('*, practice_questions(*)')
      .eq('lesson_id', lessonId)
      .single();
    
    if (error) {
      console.error('Error fetching practice test:', error);
      return null;
    }
    
    return data as PracticeTest;
  } catch (error) {
    console.error('Unexpected error fetching practice test:', error);
    return null;
  }
};

export const savePracticeTestResult = async (resultData: any): Promise<{ success: boolean }> => {
  try {
    const { data, error } = await supabase
      .from('practice_results')
      .insert([resultData])
      .select();
    
    if (error) {
      console.error('Error saving practice test result:', error);
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Unexpected error saving practice test result:', error);
    return { success: false };
  }
};
