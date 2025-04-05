
import { supabase } from './supabase';

// Типы для уроков и тестов
export type Lesson = {
  id: number;
  title: string;
  content: string;
  level: string;
  order_number: number;
  created_at?: string;
};

export type LessonTest = {
  id: number;
  lesson_id: number;
  title: string;
  created_at?: string;
  questions?: LessonQuestion[];
};

export type LessonQuestion = {
  id: number;
  test_id: number;
  text: string;
  order_number: number;
  created_at?: string;
  options?: LessonOption[];
};

export type LessonOption = {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
  created_at?: string;
};

export type LessonProgress = {
  id: number;
  user_id: string;
  lesson_id: number;
  is_completed: boolean;
  test_score?: number;
  last_attempt_at: string;
  created_at: string;
};

// Получение всех уроков
export const fetchLessons = async (): Promise<Lesson[]> => {
  try {
    console.log('Загрузка списка уроков...');
    
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_number');
    
    if (error) {
      console.error('Ошибка загрузки уроков:', error);
      throw error;
    }
    
    console.log('Успешно загружено уроков:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('Непредвиденная ошибка при загрузке уроков:', err);
    return [];
  }
};

// Получение урока с тестом по ID
export const fetchLessonWithTest = async (lessonId: number): Promise<{lesson: Lesson | null, test: LessonTest | null}> => {
  try {
    console.log(`Загрузка урока с ID ${lessonId}...`);
    
    // Получаем урок
    const { data: lessonData, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();
    
    if (lessonError) {
      console.error('Ошибка загрузки урока:', lessonError);
      throw lessonError;
    }
    
    // Получаем тест с вопросами и ответами
    const { data: testData, error: testError } = await supabase
      .from('lesson_tests')
      .select(`
        *,
        questions:lesson_questions(
          *,
          options:lesson_options(*)
        )
      `)
      .eq('lesson_id', lessonId)
      .single();
    
    if (testError && testError.code !== 'PGRST116') { // Игнорируем ошибку, если тест не найден
      console.error('Ошибка загрузки теста:', testError);
      throw testError;
    }
    
    if (testData && testData.questions) {
      // Сортируем вопросы и опции
      testData.questions = testData.questions.sort((a, b) => a.order_number - b.order_number);
    }
    
    console.log('Успешно загружен урок и тест');
    return { 
      lesson: lessonData, 
      test: testData || null 
    };
  } catch (err) {
    console.error('Непредвиденная ошибка при загрузке урока с тестом:', err);
    return { lesson: null, test: null };
  }
};

// Получение прогресса уроков для пользователя
export const fetchLessonProgress = async (userId: string): Promise<LessonProgress[]> => {
  try {
    console.log(`Загрузка прогресса уроков для пользователя ${userId}...`);
    
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at');
    
    if (error) {
      console.error('Ошибка загрузки прогресса уроков:', error);
      throw error;
    }
    
    console.log('Успешно загружен прогресс уроков:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('Непредвиденная ошибка при загрузке прогресса уроков:', err);
    return [];
  }
};

// Сохранение результатов теста и обновление прогресса урока
export const saveLessonTestResult = async (
  userId: string,
  lessonId: number,
  score: number,
  totalQuestions: number
): Promise<boolean> => {
  try {
    console.log(`Сохранение результатов теста: пользователь=${userId}, урок=${lessonId}, баллы=${score}/${totalQuestions}`);
    
    const isPerfectScore = score === totalQuestions;
    
    // Проверяем, существует ли уже запись о прогрессе
    const { data: existingProgress } = await supabase
      .from('lesson_progress')
      .select('id, is_completed, test_score')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle();
    
    // Если запись существует, обновляем её
    if (existingProgress) {
      // Обновляем только если новый результат лучше или урок еще не был завершен
      const shouldUpdate = !existingProgress.is_completed || 
                           (existingProgress.test_score || 0) < score;
      
      if (shouldUpdate) {
        const { error } = await supabase
          .from('lesson_progress')
          .update({
            test_score: score,
            is_completed: isPerfectScore,
            last_attempt_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
        
        if (error) {
          console.error('Ошибка обновления прогресса урока:', error);
          throw error;
        }
      }
    } else {
      // Создаем новую запись о прогрессе
      const { error } = await supabase
        .from('lesson_progress')
        .insert([{
          user_id: userId,
          lesson_id: lessonId,
          test_score: score,
          is_completed: isPerfectScore,
          last_attempt_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Ошибка создания прогресса урока:', error);
        throw error;
      }
    }
    
    console.log('Результаты теста успешно сохранены');
    return true;
  } catch (err) {
    console.error('Непредвиденная ошибка при сохранении результатов теста:', err);
    return false;
  }
};
