
import { supabase } from './supabase';

// Function to save lesson progress (completing a lesson)
export const saveLessonProgress = async (
  userId: string,
  lessonId: number,
  isCompleted: boolean
): Promise<boolean> => {
  try {
    // Check if progress entry already exists
    const { data: existingProgress } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();

    if (existingProgress) {
      // Update existing progress
      const { error } = await supabase
        .from('lesson_progress')
        .update({
          is_completed: isCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('lesson_id', lessonId);

      if (error) {
        console.error('Error updating lesson progress:', error);
        return false;
      }
    } else {
      // Create new progress entry
      const { error } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          is_completed: isCompleted,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating lesson progress:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving lesson progress:', error);
    return false;
  }
};

// Export any other functions needed for lessons without tests
