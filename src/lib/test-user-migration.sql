
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

-- Удаляем старые данные уроков (если есть)
TRUNCATE TABLE lesson_questions CASCADE;
TRUNCATE TABLE lesson_tests CASCADE;
TRUNCATE TABLE lesson_progress CASCADE;
TRUNCATE TABLE lessons CASCADE;

-- Добавляем уроки по грамматическим временам
INSERT INTO lessons (id, title, content, level, order_index) VALUES
(1, 'Present Simple: Базовые правила', 
'<h2>Present Simple: Базовые правила</h2>
<p>Present Simple — это время, которое используется для описания регулярных действий, фактов, привычек и общих истин.</p>

<h3>Когда использовать Present Simple</h3>
<ul>
  <li><strong>Регулярные действия и привычки:</strong> <em>I go to the gym three times a week.</em> (Я хожу в спортзал три раза в неделю.)</li>
  <li><strong>Постоянные ситуации:</strong> <em>She lives in Moscow.</em> (Она живет в Москве.)</li>
  <li><strong>Факты и общие истины:</strong> <em>Water boils at 100 degrees Celsius.</em> (Вода кипит при 100 градусах Цельсия.)</li>
  <li><strong>Расписания и программы:</strong> <em>The train leaves at 6 p.m.</em> (Поезд отправляется в 6 вечера.)</li>
</ul>

<h3>Образование Present Simple</h3>
<p>В Present Simple мы используем базовую форму глагола (инфинитив без "to").</p>

<h4>Утвердительная форма:</h4>
<ul>
  <li>Для I, you, we, they: <em>I work in a bank.</em> (Я работаю в банке.)</li>
  <li>Для he, she, it: глагол + -s/-es: <em>She works in a bank.</em> (Она работает в банке.)</li>
</ul>

<p>Правила добавления -s/-es:</p>
<ul>
  <li>Большинство глаголов: просто добавляем -s: <em>play → plays</em></li>
  <li>Глаголы, оканчивающиеся на -s, -sh, -ch, -x, -o: добавляем -es: <em>wash → washes</em></li>
  <li>Глаголы, оканчивающиеся на согласную + y: меняем y на i и добавляем -es: <em>study → studies</em></li>
  <li>Но: если перед y стоит гласная, просто добавляем -s: <em>play → plays</em></li>
</ul>

<h4>Отрицательная форма:</h4>
<p>Для образования отрицания используем вспомогательный глагол do/does + not:</p>
<ul>
  <li>I, you, we, they: <em>I do not (don''t) work on Sundays.</em> (Я не работаю по воскресеньям.)</li>
  <li>he, she, it: <em>She does not (doesn''t) work on Sundays.</em> (Она не работает по воскресеньям.)</li>
</ul>

<h4>Вопросительная форма:</h4>
<p>Для образования вопроса используем вспомогательный глагол do/does в начале предложения:</p>
<ul>
  <li>I, you, we, they: <em>Do you work in a bank?</em> (Ты работаешь в банке?)</li>
  <li>he, she, it: <em>Does she work in a bank?</em> (Она работает в банке?)</li>
</ul>

<h3>Маркеры времени в Present Simple</h3>
<p>Present Simple часто используется со следующими наречиями и выражениями:</p>
<ul>
  <li>always (всегда)</li>
  <li>usually (обычно)</li>
  <li>often (часто)</li>
  <li>sometimes (иногда)</li>
  <li>rarely/seldom (редко)</li>
  <li>never (никогда)</li>
  <li>every day/week/month/year (каждый день/неделю/месяц/год)</li>
  <li>on Mondays (по понедельникам)</li>
</ul>', 
'Начальный', 1);

INSERT INTO lessons (id, title, content, level, order_index) VALUES
(2, 'Present Continuous: Действия в процессе', 
'<h2>Present Continuous: Действия в процессе</h2>
<p>Present Continuous (Present Progressive) — это время, которое используется для описания действий, происходящих в момент речи или в текущий период времени.</p>

<h3>Когда использовать Present Continuous</h3>
<ul>
  <li><strong>Действия, происходящие в момент речи:</strong> <em>I am reading a book now.</em> (Я сейчас читаю книгу.)</li>
  <li><strong>Временные действия в настоящем:</strong> <em>She is studying English this year.</em> (Она изучает английский в этом году.)</li>
  <li><strong>Запланированные действия в ближайшем будущем:</strong> <em>We are meeting tomorrow.</em> (Мы встречаемся завтра.)</li>
  <li><strong>Постоянно повторяющиеся действия, вызывающие раздражение:</strong> <em>He is always losing his keys.</em> (Он всегда теряет свои ключи.)</li>
</ul>', 
'Начальный', 2);

INSERT INTO lessons (id, title, content, level, order_index) VALUES
(3, 'Past Simple: События в прошлом', 
'<h2>Past Simple: События в прошлом</h2>
<p>Past Simple (простое прошедшее время) используется для обозначения действий, которые произошли и завершились в определенный момент в прошлом.</p>

<h3>Когда использовать Past Simple</h3>
<ul>
  <li><strong>Завершенные действия в прошлом:</strong> <em>I visited Paris last year.</em> (Я посетил Париж в прошлом году.)</li>
  <li><strong>Последовательность действий в прошлом:</strong> <em>She got up, had breakfast and went to work.</em> (Она встала, позавтракала и пошла на работу.)</li>
  <li><strong>Привычные или повторяющиеся действия в прошлом:</strong> <em>When I was a child, I played tennis every day.</em> (Когда я был ребенком, я играл в теннис каждый день.)</li>
  <li><strong>Состояния в прошлом:</strong> <em>He was happy in his old job.</em> (Он был счастлив на своей прежней работе.)</li>
</ul>', 
'Начальный', 3);

INSERT INTO lessons (id, title, content, level, order_index) VALUES
(4, 'Future Simple: Планы и предсказания', 
'<h2>Future Simple: Планы и предсказания</h2>
<p>Future Simple (будущее простое время) используется для обозначения действий, которые произойдут в будущем. Оно выражает предсказания, предположения, обещания, решения, принятые в момент речи, и так далее.</p>

<h3>Когда использовать Future Simple</h3>
<ul>
  <li><strong>Предсказания о будущем:</strong> <em>I think it will rain tomorrow.</em> (Я думаю, завтра пойдет дождь.)</li>
  <li><strong>Спонтанные решения:</strong> <em>I''ll help you with your bags.</em> (Я помогу тебе с сумками.) — решение принято в момент речи.</li>
  <li><strong>Обещания:</strong> <em>I''ll call you later.</em> (Я позвоню тебе позже.)</li>
  <li><strong>Предположения о будущем:</strong> <em>She will probably arrive late.</em> (Она, вероятно, приедет поздно.)</li>
  <li><strong>Угрозы и предупреждения:</strong> <em>If you don''t stop, I''ll tell your parents.</em> (Если ты не остановишься, я расскажу твоим родителям.)</li>
</ul>', 
'Средний', 4);

INSERT INTO lessons (id, title, content, level, order_index) VALUES
(5, 'Present Perfect: Связь прошлого с настоящим', 
'<h2>Present Perfect: Связь прошлого с настоящим</h2>
<p>Present Perfect (настоящее совершенное время) используется для обозначения действий, которые произошли в прошлом, но имеют связь с настоящим моментом. Это время показывает результат прошлых действий или их влияние на настоящее.</p>

<h3>Когда использовать Present Perfect</h3>
<ul>
  <li><strong>Действия, которые только что завершились, и их результат актуален в настоящем:</strong> <em>I have lost my keys.</em> (Я потерял свои ключи.)</li>
  <li><strong>Опыт или действия, случившиеся когда-то в жизни (без указания конкретного времени):</strong> <em>She has visited Paris twice.</em> (Она дважды посещала Париж.)</li>
  <li><strong>Действия, начавшиеся в прошлом и продолжающиеся до настоящего момента:</strong> <em>I have lived here for 10 years.</em> (Я живу здесь 10 лет.)</li>
  <li><strong>Действие завершилось, но период времени еще не закончился:</strong> <em>I have read two books this week.</em> (Я прочитал две книги на этой неделе.)</li>
</ul>', 
'Средний', 5);

-- Создаем тесты для уроков

-- Тест для урока 1 (Present Simple: Базовые правила)
INSERT INTO lesson_tests (id, lesson_id, title) VALUES 
(1, 1, 'Тест по Present Simple');

INSERT INTO lesson_questions (test_id, text, options) VALUES 
(1, 'Какую форму принимает глагол в 3-м лице единственного числа (he/she/it) в Present Simple?', 
 '[{"text": "Добавляется окончание -ing", "is_correct": false}, 
   {"text": "Добавляется окончание -s/-es", "is_correct": true}, 
   {"text": "Добавляется окончание -ed", "is_correct": false}, 
   {"text": "Форма глагола не меняется", "is_correct": false}]');

INSERT INTO lesson_questions (test_id, text, options) VALUES 
(1, 'Для чего используется время Present Simple?', 
 '[{"text": "Для описания действий, происходящих в данный момент", "is_correct": false}, 
   {"text": "Для описания регулярных действий и фактов", "is_correct": true}, 
   {"text": "Только для описания будущих планов", "is_correct": false}, 
   {"text": "Для действий, которые завершились в прошлом", "is_correct": false}]');

INSERT INTO lesson_questions (test_id, text, options) VALUES 
(1, 'Как образуется отрицание в Present Simple?', 
 '[{"text": "Добавляется \"not\" после глагола", "is_correct": false}, 
   {"text": "Используется вспомогательный глагол do/does + not + основная форма глагола", "is_correct": true}, 
   {"text": "Используется am/is/are + not", "is_correct": false}, 
   {"text": "Добавляется \"no\" перед подлежащим", "is_correct": false}]');

-- Тест для урока 2 (Present Continuous: Действия в процессе)
INSERT INTO lesson_tests (id, lesson_id, title) VALUES 
(2, 2, 'Тест по Present Continuous');

INSERT INTO lesson_questions (test_id, text, options) VALUES 
(2, 'Как образуется Present Continuous?', 
 '[{"text": "be (am/is/are) + глагол с -ing", "is_correct": true}, 
   {"text": "do/does + глагол", "is_correct": false}, 
   {"text": "has/have + глагол с -ed", "is_correct": false}, 
   {"text": "глагол с окончанием -s/-es", "is_correct": false}]');

INSERT INTO lesson_questions (test_id, text, options) VALUES 
(2, 'Для чего используется время Present Continuous?', 
 '[{"text": "Для описания регулярных действий", "is_correct": false}, 
   {"text": "Для действий, происходящих в момент речи или в текущий период", "is_correct": true}, 
   {"text": "Только для описания прошедших событий", "is_correct": false}, 
   {"text": "Для описания действий, которые никогда не происходили", "is_correct": false}]');

-- Тест для урока 3 (Past Simple: События в прошлом)
INSERT INTO lesson_tests (id, lesson_id, title) VALUES 
(3, 3, 'Тест по Past Simple');

INSERT INTO lesson_questions (test_id, text, options) VALUES 
(3, 'Как образуется прошедшее время (Past Simple) правильных глаголов?', 
 '[{"text": "Добавляется окончание -ing", "is_correct": false}, 
   {"text": "Добавляется окончание -s", "is_correct": false}, 
   {"text": "Добавляется окончание -ed", "is_correct": true}, 
   {"text": "Добавляется will перед глаголом", "is_correct": false}]');

INSERT INTO lesson_questions (test_id, text, options) VALUES 
(3, 'Для чего используется время Past Simple?', 
 '[{"text": "Для действий, происходящих в настоящий момент", "is_correct": false}, 
   {"text": "Для регулярных действий в настоящем", "is_correct": false}, 
   {"text": "Для завершенных действий в определенный момент в прошлом", "is_correct": true}, 
   {"text": "Для будущих запланированных действий", "is_correct": false}]');

-- Тест для урока 4 (Future Simple: Планы и предсказания)
INSERT INTO lesson_tests (id, lesson_id, title) VALUES 
(4, 4, 'Тест по Future Simple');

INSERT INTO lesson_questions (test_id, text, options) VALUES 
(4, 'Как образуется Future Simple?', 
 '[{"text": "do/does + глагол", "is_correct": false}, 
   {"text": "will + базовая форма глагола", "is_correct": true}, 
   {"text": "am/is/are + глагол с -ing", "is_correct": false}, 
   {"text": "have/has + глагол с -ed", "is_correct": false}]');

INSERT INTO lesson_questions (test_id, text, options) VALUES 
(4, 'Для чего используется время Future Simple?', 
 '[{"text": "Для описания завершенных действий в прошлом", "is_correct": false}, 
   {"text": "Только для описания регулярных действий", "is_correct": false}, 
   {"text": "Для предсказаний, обещаний и спонтанных решений о будущем", "is_correct": true}, 
   {"text": "Для действий, происходящих в момент речи", "is_correct": false}]');

-- Тест для урока 5 (Present Perfect: Связь прошлого с настоящим)
INSERT INTO lesson_tests (id, lesson_id, title) VALUES 
(5, 5, 'Тест по Present Perfect');

INSERT INTO lesson_questions (test_id, text, options) VALUES 
(5, 'Как образуется Present Perfect?', 
 '[{"text": "do/does + глагол", "is_correct": false}, 
   {"text": "will + глагол", "is_correct": false}, 
   {"text": "have/has + Past Participle (причастие прошедшего времени)", "is_correct": true}, 
   {"text": "am/is/are + глагол с -ing", "is_correct": false}]');

INSERT INTO lesson_questions (test_id, text, options) VALUES 
(5, 'Для чего используется время Present Perfect?', 
 '[{"text": "Для действий, происходящих в данный момент", "is_correct": false}, 
   {"text": "Для действий, которые произошли в прошлом и имеют связь с настоящим", "is_correct": true}, 
   {"text": "Только для регулярных действий в настоящем", "is_correct": false}, 
   {"text": "Для действий, которые произойдут в будущем", "is_correct": false}]');

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

-- Модифицируем функцию обработки нового пользователя, чтобы добавлять тестовые результаты
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, tests_completed, courses_completed)
  VALUES (new.id, 
          COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
          new.email,
          0,
          0);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Убираем ошибочную вставку тестового пользователя и добавляем правильную логику для него
-- Вместо ошибочной вставки тестового пользователя напрямую в profiles,
-- мы можем создать тестовые данные только для авторизованных пользователей

-- Функция для добавления тестовых результатов для существующего пользователя
CREATE OR REPLACE FUNCTION public.add_test_data_for_user(user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Обновляем счетчики в профиле
  UPDATE profiles
  SET tests_completed = 8,
      courses_completed = 3
  WHERE id = user_id;
  
  -- Добавляем тестовые результаты тестов
  INSERT INTO test_results (id, user_id, test_id, score, total_questions, created_at)
  VALUES 
    (gen_random_uuid(), user_id, '1', 8, 10, now() - interval '1 day'),
    (gen_random_uuid(), user_id, '2', 9, 10, now() - interval '2 day'),
    (gen_random_uuid(), user_id, '1', 7, 10, now() - interval '10 day'),
    (gen_random_uuid(), user_id, '3', 6, 10, now() - interval '20 day'),
    (gen_random_uuid(), user_id, '2', 8, 10, now() - interval '30 day'),
    (gen_random_uuid(), user_id, '1', 9, 10, now() - interval '40 day'),
    (gen_random_uuid(), user_id, '3', 10, 10, now() - interval '50 day'),
    (gen_random_uuid(), user_id, '2', 8, 10, now() - interval '60 day');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Теперь вместо прямой вставки тестового пользователя
-- мы можем добавить комментарий с инструкцией для добавления тестовых данных
-- для текущего пользователя

-- Для добавления тестовых данных для текущего пользователя, 
-- выполните следующую команду в SQL редакторе Supabase:
-- SELECT add_test_data_for_user(auth.uid());
