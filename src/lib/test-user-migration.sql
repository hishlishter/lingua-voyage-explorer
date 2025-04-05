
-- Создаем таблицу для уроков, если ее еще нет
CREATE TABLE IF NOT EXISTS public.lessons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  level VARCHAR(50) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создаем таблицу для тестов уроков, если ее еще нет
CREATE TABLE IF NOT EXISTS public.lesson_tests (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES public.lessons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создаем таблицу для вопросов тестов, если ее еще нет
CREATE TABLE IF NOT EXISTS public.lesson_questions (
  id SERIAL PRIMARY KEY,
  test_id INTEGER REFERENCES public.lesson_tests(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создаем таблицу для прогресса пользователей по урокам, если ее еще нет
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES public.lessons(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Добавляем тестовые данные для профиля пользователя
INSERT INTO profiles (id, name, email, tests_completed, courses_completed, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Тестовый Пользователь', 'test@example.com', 8, 3, now())
ON CONFLICT (id) DO UPDATE 
  SET name = EXCLUDED.name, 
      email = EXCLUDED.email;

-- Добавляем тестовые данные для результатов тестов
INSERT INTO test_results (id, user_id, test_id, score, total_questions, created_at)
VALUES 
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', '1', 8, 10, now() - interval '1 day'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', '2', 9, 10, now() - interval '2 day'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', '1', 7, 10, now() - interval '10 day'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', '3', 6, 10, now() - interval '20 day'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', '2', 8, 10, now() - interval '30 day'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', '1', 9, 10, now() - interval '40 day'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', '3', 10, 10, now() - interval '50 day'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', '2', 8, 10, now() - interval '60 day');

-- Добавляем колонку для URL аватара, если ее еще нет
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Создаем бакет для аватаров, если его еще нет
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO NOTHING;

-- RLS политика для бакета аватаров
CREATE POLICY "Avatar files are publicly accessible."
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars."
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatars."
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can delete their own avatars."
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars');
