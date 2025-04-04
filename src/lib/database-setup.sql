
-- Таблица профилей пользователей
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  tests_completed INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Создаем RLS (Row Level Security) для таблицы profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политики доступа для profiles
-- Пользователи могут читать свой собственный профиль
CREATE POLICY "Пользователи могут читать свой профиль" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Пользователи могут обновлять свой собственный профиль
CREATE POLICY "Пользователи могут обновлять свой профиль" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Разрешаем вставку профилей при регистрации (важно!)
CREATE POLICY "Разрешаем вставку новых профилей" 
  ON profiles FOR INSERT 
  WITH CHECK (true); -- Разрешаем вставку всем, так как профили создаются при регистрации

-- Таблица тестов
CREATE TABLE IF NOT EXISTS tests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Таблица вопросов
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Таблица вариантов ответов
CREATE TABLE IF NOT EXISTS options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false
);

-- Таблица результатов тестов
CREATE TABLE IF NOT EXISTS test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS для таблицы test_results
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Политики доступа для test_results
CREATE POLICY "Пользователи могут читать свои результаты" 
  ON test_results FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут добавлять свои результаты" 
  ON test_results FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Таблица курсов
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  level TEXT,
  lessons_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Таблица уроков
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  order_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Таблица прогресса по курсам
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  lessons_completed INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, course_id)
);

-- RLS для таблицы course_progress
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Политики доступа для course_progress
CREATE POLICY "Пользователи могут читать свой прогресс" 
  ON course_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут добавлять свой прогресс" 
  ON course_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять свой прогресс" 
  ON course_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- Таблица словаря
CREATE TABLE IF NOT EXISTS dictionary (
  id SERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  translation TEXT NOT NULL,
  example TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Таблица сетов слов (наборов для изучения)
CREATE TABLE IF NOT EXISTS word_sets (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Связующая таблица между словами и сетами
CREATE TABLE IF NOT EXISTS word_set_items (
  id SERIAL PRIMARY KEY,
  word_set_id INTEGER REFERENCES word_sets(id) ON DELETE CASCADE,
  word_id INTEGER REFERENCES dictionary(id) ON DELETE CASCADE,
  UNIQUE(word_set_id, word_id)
);

-- Таблица прогресса пользователя по словарю
CREATE TABLE IF NOT EXISTS user_word_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  word_id INTEGER REFERENCES dictionary(id) ON DELETE CASCADE,
  learned BOOLEAN DEFAULT false,
  last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, word_id)
);

-- RLS для таблицы user_word_progress
ALTER TABLE user_word_progress ENABLE ROW LEVEL SECURITY;

-- Политики доступа для user_word_progress
CREATE POLICY "Пользователи могут читать свой прогресс по словам" 
  ON user_word_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут добавлять свой прогресс по словам" 
  ON user_word_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять свой прогресс по словам" 
  ON user_word_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- Триггерная функция для обновления количества завершенных тестов
CREATE OR REPLACE FUNCTION update_tests_completed()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET tests_completed = (
    SELECT COUNT(DISTINCT test_id)
    FROM test_results
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления количества завершенных тестов
CREATE TRIGGER after_test_result_insert
AFTER INSERT ON test_results
FOR EACH ROW
EXECUTE FUNCTION update_tests_completed();

-- Триггерная функция для обновления количества завершенных курсов
CREATE OR REPLACE FUNCTION update_courses_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed = true THEN
    UPDATE profiles
    SET courses_completed = (
      SELECT COUNT(*)
      FROM course_progress
      WHERE user_id = NEW.user_id AND completed = true
    )
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления количества завершенных курсов
CREATE TRIGGER after_course_progress_update
AFTER UPDATE ON course_progress
FOR EACH ROW
WHEN (OLD.completed IS DISTINCT FROM NEW.completed)
EXECUTE FUNCTION update_courses_completed();
