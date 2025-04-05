
-- Create tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  tests_completed INT DEFAULT 0,
  courses_completed INT DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL,
  questions_count INT NOT NULL,
  time_limit INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  order_num INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses and lessons tables
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  level TEXT NOT NULL,
  lessons_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_number INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NEW: Practice tests for lessons
CREATE TABLE IF NOT EXISTS practice_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NEW: Practice test questions
CREATE TABLE IF NOT EXISTS practice_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_test_id UUID NOT NULL REFERENCES practice_tests(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  order_num INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NEW: Practice test options
CREATE TABLE IF NOT EXISTS practice_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_question_id UUID NOT NULL REFERENCES practice_questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NEW: Practice test results
CREATE TABLE IF NOT EXISTS practice_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  practice_test_id UUID NOT NULL REFERENCES practice_tests(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lessons_completed INT NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  last_lesson_id UUID REFERENCES lessons(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- NEW: Enable RLS for practice test tables
ALTER TABLE practice_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_results ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can update their own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tests
CREATE POLICY "Tests are viewable by everyone."
  ON tests FOR SELECT
  USING (TRUE);

-- Questions
CREATE POLICY "Questions are viewable by everyone."
  ON questions FOR SELECT
  USING (TRUE);

-- Options
CREATE POLICY "Options are viewable by everyone."
  ON options FOR SELECT
  USING (TRUE);

-- Test Results
CREATE POLICY "Users can view their own test results."
  ON test_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results."
  ON test_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Courses
CREATE POLICY "Courses are viewable by everyone."
  ON courses FOR SELECT
  USING (TRUE);

-- Lessons
CREATE POLICY "Lessons are viewable by everyone."
  ON lessons FOR SELECT
  USING (TRUE);

-- NEW: Practice test policies
CREATE POLICY "Practice tests are viewable by everyone."
  ON practice_tests FOR SELECT
  USING (TRUE);

CREATE POLICY "Practice questions are viewable by everyone."
  ON practice_questions FOR SELECT
  USING (TRUE);

CREATE POLICY "Practice options are viewable by everyone."
  ON practice_options FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can view their own practice results."
  ON practice_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own practice results."
  ON practice_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Course Progress
CREATE POLICY "Users can view their own course progress."
  ON course_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own course progress."
  ON course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress."
  ON course_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Create public storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
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

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert demo courses data
INSERT INTO courses (id, title, description, image, level, lessons_count)
VALUES 
  ('1', 'Русский язык для начинающих', 'Базовый курс для изучения русского языка с нуля', 'https://example.com/russian1.jpg', 'Начальный', 3),
  ('2', 'Русский язык - средний уровень', 'Углубленное изучение грамматики и словарного запаса', 'https://example.com/russian2.jpg', 'Средний', 3),
  ('3', 'Продвинутый русский', 'Сложные аспекты грамматики и стилистики', 'https://example.com/russian3.jpg', 'Продвинутый', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert demo lessons with theory content
INSERT INTO lessons (id, course_id, title, content, order_number)
VALUES 
  -- Начальный курс
  ('1', '1', 'Алфавит и произношение', '<h2>Русский алфавит</h2><p>Русский алфавит состоит из 33 букв: 10 гласных, 21 согласной и 2 специальных знаков.</p><p>Гласные: А, Е, Ё, И, О, У, Ы, Э, Ю, Я</p><p>Согласные: Б, В, Г, Д, Ж, З, К, Л, М, Н, П, Р, С, Т, Ф, Х, Ц, Ч, Ш, Щ</p><p>Специальные знаки: Ъ (твёрдый знак), Ь (мягкий знак)</p><h3>Произношение гласных</h3><p>Гласные в русском языке могут быть ударными и безударными. Ударные гласные произносятся чётко, безударные подвергаются редукции (ослаблению).</p><p>Примеры: вода́ [вада́], молоко́ [малако́]</p>', 1),
  ('2', '1', 'Базовые приветствия', '<h2>Основные фразы приветствия</h2><p>В русском языке есть несколько способов поздороваться:</p><ul><li>Здравствуйте - формальное приветствие</li><li>Привет - неформальное приветствие</li><li>Доброе утро - утреннее приветствие</li><li>Добрый день - дневное приветствие</li><li>Добрый вечер - вечернее приветствие</li></ul><h3>Как попрощаться</h3><p>Основные способы прощания:</p><ul><li>До свидания - формальное прощание</li><li>Пока - неформальное прощание</li><li>До встречи - "до следующей встречи"</li></ul>', 2),
  ('3', '1', 'Местоимения и числа', '<h2>Личные местоимения</h2><p>В русском языке есть следующие личные местоимения:</p><ul><li>Я - первое лицо единственного числа</li><li>Ты - второе лицо единственного числа</li><li>Он/Она/Оно - третье лицо единственного числа</li><li>Мы - первое лицо множественного числа</li><li>Вы - второе лицо множественного числа (также форма вежливого обращения)</li><li>Они - третье лицо множественного числа</li></ul><h3>Числа от 1 до 10</h3><p>Счёт от 1 до 10 по-русски:</p><ol><li>Один</li><li>Два</li><li>Три</li><li>Четыре</li><li>Пять</li><li>Шесть</li><li>Семь</li><li>Восемь</li><li>Девять</li><li>Десять</li></ol>', 3),
  
  -- Средний курс
  ('4', '2', 'Падежная система', '<h2>Падежи в русском языке</h2><p>В русском языке существует 6 падежей:</p><ol><li><strong>Именительный падеж</strong> - отвечает на вопросы "кто?", "что?"</li><li><strong>Родительный падеж</strong> - отвечает на вопросы "кого?", "чего?"</li><li><strong>Дательный падеж</strong> - отвечает на вопросы "кому?", "чему?"</li><li><strong>Винительный падеж</strong> - отвечает на вопросы "кого?", "что?"</li><li><strong>Творительный падеж</strong> - отвечает на вопросы "кем?", "чем?"</li><li><strong>Предложный падеж</strong> - отвечает на вопросы "о ком?", "о чём?"</li></ol><p>Каждый падеж имеет свои окончания и используется в определенных синтаксических конструкциях.</p>', 1),
  ('5', '2', 'Виды глаголов', '<h2>Виды глаголов в русском языке</h2><p>В русском языке глаголы делятся на два вида:</p><ul><li><strong>Совершенный вид</strong> - обозначает завершенное действие, результат.</li><li><strong>Несовершенный вид</strong> - обозначает процесс, повторяющееся действие.</li></ul><p>Примеры пар глаголов:</p><ul><li>делать (несов.) - сделать (сов.)</li><li>читать (несов.) - прочитать (сов.)</li><li>писать (несов.) - написать (сов.)</li></ul><p>Выбор вида глагола зависит от контекста и цели высказывания.</p>', 2),
  ('6', '2', 'Предлоги и союзы', '<h2>Предлоги в русском языке</h2><p>Предлоги - служебные слова, которые указывают на отношения между словами в предложении:</p><ul><li><strong>В, на</strong> - указывают на место (в доме, на столе)</li><li><strong>К, от</strong> - указывают на направление (к другу, от дома)</li><li><strong>С, без</strong> - указывают на совместность или отсутствие (с другом, без книги)</li></ul><h3>Союзы</h3><p>Союзы соединяют слова и предложения:</p><ul><li><strong>И, а, но</strong> - сочинительные союзы</li><li><strong>Что, чтобы, если</strong> - подчинительные союзы</li></ul><p>Правильное использование предлогов и союзов важно для построения грамматически верных предложений.</p>', 3),
  
  -- Продвинутый курс
  ('7', '3', 'Причастие и деепричастие', '<h2>Причастия</h2><p>Причастие - это особая форма глагола, которая обозначает признак предмета по действию и отвечает на вопросы "какой?", "что делающий?", "что сделавший?".</p><p>Различают:</p><ul><li>Действительные причастия (читающий, прочитавший)</li><li>Страдательные причастия (читаемый, прочитанный)</li></ul><h3>Деепричастия</h3><p>Деепричастие - это особая форма глагола, которая обозначает добавочное действие при основном действии, выраженном глаголом.</p><p>Деепричастия бывают:</p><ul><li>Несовершенного вида (читая, делая)</li><li>Совершенного вида (прочитав, сделав)</li></ul><p>Пример: "Читая книгу, я делал заметки."</p>', 1),
  ('8', '3', 'Сложные предложения', '<h2>Сложные предложения в русском языке</h2><p>Сложные предложения состоят из двух или более простых предложений (частей), объединенных по смыслу и интонационно.</p><h3>Типы сложных предложений:</h3><ol><li><strong>Сложносочиненные</strong> - части равноправны и соединены сочинительными союзами: "Солнце светило, <strong>и</strong> птицы пели".</li><li><strong>Сложноподчиненные</strong> - одна часть зависит от другой: "Я знал, <strong>что</strong> он придет".</li><li><strong>Бессоюзные</strong> - части соединены без союзов: "Солнце взошло; начался новый день".</li></ol><p>Правильное построение сложных предложений требует понимания смысловых отношений между частями и правил пунктуации.</p>', 2),
  ('9', '3', 'Стилистика и выразительные средства', '<h2>Функциональные стили русского языка</h2><p>В русском языке выделяют следующие функциональные стили:</p><ul><li><strong>Разговорный</strong> - используется в повседневном общении</li><li><strong>Научный</strong> - используется в научных работах</li><li><strong>Официально-деловой</strong> - используется в документах</li><li><strong>Публицистический</strong> - используется в СМИ</li><li><strong>Художественный</strong> - используется в литературе</li></ul><h3>Выразительные средства</h3><p>К выразительным средствам русского языка относятся:</p><ul><li>Тропы (метафора, эпитет, сравнение)</li><li>Фигуры речи (анафора, эпифора, градация)</li><li>Фразеологизмы и пословицы</li></ul><p>Умелое использование выразительных средств обогащает речь и делает ее более яркой.</p>', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert practice tests for lessons
INSERT INTO practice_tests (id, lesson_id, title, description)
VALUES 
  ('1', '1', 'Тест: Алфавит и произношение', 'Проверьте свое знание русского алфавита и правил произношения'),
  ('2', '2', 'Тест: Приветствия и прощания', 'Проверьте свое знание фраз приветствия и прощания'),
  ('3', '3', 'Тест: Местоимения и числа', 'Проверьте свое знание местоимений и чисел от 1 до 10'),
  ('4', '4', 'Тест: Падежная система', 'Проверьте свое знание падежей русского языка'),
  ('5', '5', 'Тест: Виды глаголов', 'Проверьте свое знание видов глаголов'),
  ('6', '6', 'Тест: Предлоги и союзы', 'Проверьте свое знание предлогов и союзов'),
  ('7', '7', 'Тест: Причастия и деепричастия', 'Проверьте свое знание причастий и деепричастий'),
  ('8', '8', 'Тест: Сложные предложения', 'Проверьте свое знание типов сложных предложений'),
  ('9', '9', 'Тест: Стилистика', 'Проверьте свое знание стилей и выразительных средств русского языка')
ON CONFLICT (id) DO NOTHING;

-- Insert practice questions and options for the first test (example)
INSERT INTO practice_questions (id, practice_test_id, text, order_num)
VALUES 
  ('1', '1', 'Сколько букв в русском алфавите?', 1),
  ('2', '1', 'Какая буква появляется в русском алфавите после "А"?', 2),
  ('3', '1', 'Какие из следующих букв являются гласными?', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO practice_options (practice_question_id, text, is_correct)
VALUES 
  ('1', '32', false),
  ('1', '33', true),
  ('1', '31', false),
  ('1', '36', false),
  
  ('2', 'Б', true),
  ('2', 'В', false),
  ('2', 'Г', false),
  ('2', 'Ё', false),
  
  ('3', 'А, О, К, Л', false),
  ('3', 'А, О, И, Э', true),
  ('3', 'Б, В, А, Е', false),
  ('3', 'П, О, У, Т', false);

-- Insert practice questions and options for the second test (example)
INSERT INTO practice_questions (id, practice_test_id, text, order_num)
VALUES 
  ('4', '2', 'Какое приветствие является формальным?', 1),
  ('5', '2', 'Как правильно попрощаться в формальной обстановке?', 2),
  ('6', '2', 'В какое время суток используют приветствие "Добрый вечер"?', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO practice_options (practice_question_id, text, is_correct)
VALUES 
  ('4', 'Привет', false),
  ('4', 'Здравствуйте', true),
  ('4', 'Хай', false),
  ('4', 'Здорово', false),
  
  ('5', 'Пока', false),
  ('5', 'Бывай', false),
  ('5', 'До свидания', true),
  ('5', 'Чао', false),
  
  ('6', 'Утром', false),
  ('6', 'Днём', false),
  ('6', 'Вечером', true),
  ('6', 'В любое время', false);
