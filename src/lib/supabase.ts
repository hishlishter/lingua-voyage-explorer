
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your actual credentials
const supabaseUrl = 'https://ejyyiilgghontvdrwuns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqeXlpaWxnZ2hvbnR2ZHJ3dW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3OTYwNzEsImV4cCI6MjA1OTM3MjA3MX0.ZMx420McFLRUBtg88_ll13_h3u7QmT7WmRaLU4VNZuc';

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
  questions?: Question[]; // Добавляем это поле, которое требуется в TestDetail.tsx
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
  is_correct: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  lessons_count: number;
  duration?: string;
  lessons?: Lesson[]; // Добавляем это поле, которое требуется в CourseDetail.tsx
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  order_index: number;
  practice_tests?: PracticeTest[]; // Добавляем это поле, которое требуется в CourseDetail.tsx
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
  options: PracticeOption[];
  correct_answer: string;
  explanation?: string;
}

export interface PracticeOption {
  id: string;
  text: string;
  is_correct: boolean;
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

export const fetchTestWithQuestions = async (testId: string): Promise<Test> => {
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
      throw new Error('Ошибка при загрузке теста');
    }
    
    // Получаем вопросы для теста
    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .select('*, options(*)')
      .eq('test_id', testId);
    
    if (questionError) {
      console.error('Ошибка при загрузке вопросов:', questionError);
      return testData; // Return test without questions
    }
    
    console.log(`Загружен тест "${testData.title}" с ${questionData?.length || 0} вопросами`);
    
    // Attach questions to the test object
    return {
      ...testData,
      questions: questionData || []
    };
  } catch (err) {
    console.error('Непредвиденная ошибка при загрузке теста с вопросами:', err);
    throw err;
  }
};

export const saveTestResult = async (
  user_id: string,
  test_id: string,
  score: number,
  total_questions: number,
  is_perfect_score: boolean = false
): Promise<boolean> => {
  try {
    console.log('Сохранение результатов теста:', {
      user_id,
      test_id,
      score,
      total_questions,
      is_perfect_score
    });
    
    // Проверяем обязательные поля
    if (!user_id || !test_id) {
      console.error('Отсутствуют обязательные поля (user_id или test_id)');
      return false;
    }
    
    // Базовые данные для вставки
    const insertData = {
      user_id,
      test_id,
      score,
      total_questions,
      is_perfect_score
    };
    
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
            user_id,
            test_id,
            score,
            total_questions
          }])
          .select();
        
        if (retryError) {
          console.error('Повторная ошибка при сохранении результатов:', retryError);
          return false;
        }
        
        console.log('Результаты успешно сохранены (без is_perfect_score):', retryData);
        
        // Обновляем счетчик пройденных тестов в профиле пользователя
        await updateUserTestCount(user_id);
        return true;
      }
      
      return false;
    }
    
    console.log('Результаты успешно сохранены:', data);
    
    // Обновляем счетчик пройденных тестов в профиле пользователя
    await updateUserTestCount(user_id);
    return true;
  } catch (err) {
    console.error('Непредвиденная ошибка при сохранении результатов теста:', err);
    return false;
  }
};

// Helper function to update user test count
async function updateUserTestCount(userId: string): Promise<void> {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('tests_completed')
      .eq('id', userId)
      .single();
    
    if (!profileError && profileData) {
      const testsCompleted = (profileData.tests_completed || 0) + 1;
      
      await supabase
        .from('profiles')
        .update({ tests_completed: testsCompleted })
        .eq('id', userId);
      
      console.log(`Обновлен счетчик пройденных тестов: ${testsCompleted}`);
    }
  } catch (err) {
    console.error('Ошибка при обновлении профиля:', err);
  }
}

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

export const fetchCourseWithLessons = async (courseId: string): Promise<Course> => {
  try {
    // Get course details
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (courseError) {
      console.error('Error fetching course:', courseError);
      throw new Error('Error fetching course');
    }
    
    // Get lessons for this course
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .select('*, practice_tests(*)')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });
    
    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
      return courseData; // Return course without lessons
    }
    
    return { 
      ...courseData, 
      lessons: lessonsData || [] 
    };
  } catch (error) {
    console.error('Unexpected error fetching course with lessons:', error);
    throw error;
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

export const updateCourseProgress = async (
  user_id: string,
  course_id: string,
  last_lesson_id: string,
  lessons_completed: number = 0,
  is_completed: boolean = false,
  update_completed_lessons: boolean = false,
  completed_lessons: string[] = []
): Promise<{ success: boolean, data?: any }> => {
  try {
    if (!user_id || !course_id) {
      return { success: false };
    }
    
    // Prepare progress data
    const progressData: any = {
      user_id,
      course_id,
      last_lesson_id,
      lessons_completed,
      is_completed
    };
    
    // Add completed_lessons if updating them
    if (update_completed_lessons && completed_lessons.length > 0) {
      progressData.completed_lessons = JSON.stringify(completed_lessons);
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
    
    // Update user profile with completed courses count if the course is completed
    if (is_completed) {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('courses_completed')
          .eq('id', user_id)
          .single();
        
        if (profileData) {
          await supabase
            .from('profiles')
            .update({ courses_completed: (profileData.courses_completed || 0) + 1 })
            .eq('id', user_id);
        }
      } catch (err) {
        console.error('Error updating profile courses count:', err);
      }
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
