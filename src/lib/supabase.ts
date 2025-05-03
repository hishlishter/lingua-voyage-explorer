
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
