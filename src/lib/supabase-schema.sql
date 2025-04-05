
-- Схема для уроков и тестов

-- Таблица уроков
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  level TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица тестов для уроков
CREATE TABLE IF NOT EXISTS lesson_tests (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица вопросов для тестов к урокам
CREATE TABLE IF NOT EXISTS lesson_questions (
  id SERIAL PRIMARY KEY,
  test_id INTEGER REFERENCES lesson_tests(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица вариантов ответов на вопросы
CREATE TABLE IF NOT EXISTS lesson_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES lesson_questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица прогресса уроков пользователя
CREATE TABLE IF NOT EXISTS lesson_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  test_score INTEGER,
  last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Демонстрационные данные
INSERT INTO lessons (title, content, level, order_number) VALUES
('Английский алфавит и фонетика', 
'<h2>Английский алфавит</h2>
<p>Английский алфавит состоит из 26 букв: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z.</p>

<h3>Гласные звуки</h3>
<p>В английском языке 5 гласных букв (A, E, I, O, U), но они могут произноситься по-разному, образуя около 20 различных гласных звуков.</p>

<p>Например:</p>
<ul>
  <li><strong>A</strong> может звучать как [æ] (cat), [eɪ] (make), [ɑː] (car)</li>
  <li><strong>E</strong> может звучать как [e] (bed), [iː] (me)</li>
  <li><strong>I</strong> может звучать как [ɪ] (sit), [aɪ] (fine)</li>
  <li><strong>O</strong> может звучать как [ɒ] (hot), [əʊ] (go)</li>
  <li><strong>U</strong> может звучать как [ʌ] (cup), [juː] (tune)</li>
</ul>

<h3>Согласные звуки</h3>
<p>Согласные буквы также могут произноситься по-разному в зависимости от их положения в слове или сочетания с другими буквами.</p>

<p>Некоторые особенности произношения согласных:</p>
<ul>
  <li><strong>Th</strong> может произноситься как [θ] (think) или [ð] (this)</li>
  <li><strong>Ch</strong> обычно произносится как [tʃ] (church)</li>
  <li><strong>Sh</strong> произносится как [ʃ] (ship)</li>
  <li><strong>Ph</strong> произносится как [f] (photo)</li>
</ul>

<h3>Правила чтения</h3>
<p>В английском языке существуют определённые правила чтения, которые помогают понять, как произносить слова:</p>

<ol>
  <li>Открытый и закрытый слог: в открытом слоге гласная обычно произносится как в алфавите, в закрытом - кратко.</li>
  <li>Немая "e" в конце слова часто делает предыдущую гласную долгой.</li>
  <li>Сочетания гласных могут давать специфические звуки: "ea" часто произносится как [iː].</li>
</ol>', 
'Начальный', 1);

INSERT INTO lessons (title, content, level, order_number) VALUES
('Present Simple (Настоящее простое время)', 
'<h2>Present Simple</h2>
<p>Present Simple (настоящее простое время) используется для описания регулярных действий, фактов, привычек, а также общих истин.</p>

<h3>Образование Present Simple</h3>
<p>Для большинства глаголов форма Present Simple совпадает с базовой формой глагола (инфинитивом без частицы "to").</p>

<h4>Утвердительные предложения:</h4>
<ul>
  <li>I / You / We / They + глагол основной формы: <em>I work every day.</em></li>
  <li>He / She / It + глагол + -s/-es: <em>She works every day.</em></li>
</ul>

<p>Правила добавления окончаний -s/-es:</p>
<ul>
  <li>Обычно добавляется -s: work → works</li>
  <li>После s, z, x, ch, sh добавляется -es: watch → watches</li>
  <li>Если глагол оканчивается на -y после согласной, -y меняется на -i и добавляется -es: study → studies</li>
</ul>

<h4>Отрицательные предложения:</h4>
<p>Для образования отрицания используется вспомогательный глагол do/does + not + основная форма глагола.</p>
<ul>
  <li>I / You / We / They + do not (don\'t) + глагол: <em>I don\'t work on Sundays.</em></li>
  <li>He / She / It + does not (doesn\'t) + глагол: <em>She doesn\'t work on Sundays.</em></li>
</ul>

<h4>Вопросительные предложения:</h4>
<p>Для образования вопроса используется инверсия с вспомогательным глаголом do/does.</p>
<ul>
  <li>Do + I / you / we / they + глагол...? <em>Do you work on Mondays?</em></li>
  <li>Does + he / she / it + глагол...? <em>Does she work on Mondays?</em></li>
</ul>

<h3>Случаи употребления Present Simple</h3>
<ol>
  <li>Регулярные, повторяющиеся действия: <em>I go to the gym three times a week.</em></li>
  <li>Постоянные ситуации и состояния: <em>She lives in London.</em></li>
  <li>Общие истины и факты: <em>The Earth rotates around the Sun.</em></li>
  <li>Расписания и программы: <em>The train leaves at 5 pm.</em></li>
</ol>

<h3>Маркеры времени в Present Simple</h3>
<p>Часто Present Simple используется со следующими наречиями и выражениями:</p>
<ul>
  <li>always, usually, often, sometimes, seldom, rarely, never</li>
  <li>every day/week/month/year</li>
  <li>once/twice a week/month</li>
  <li>on Mondays, in the morning</li>
</ul>', 
'Начальный', 2);

-- Добавим тест для первого урока
INSERT INTO lesson_tests (lesson_id, title) VALUES (1, 'Тест по алфавиту и фонетике');

-- Добавим вопросы для теста первого урока
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (1, 'Сколько букв в английском алфавите?', 1);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (1, 'Какой звук обозначает сочетание букв "th" в слове "think"?', 2);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (1, 'Сколько гласных букв в английском алфавите?', 3);

-- Добавим варианты ответов для вопросов первого теста
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (1, '24', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (1, '26', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (1, '28', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (1, '33', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (2, '[f]', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (2, '[ð]', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (2, '[θ]', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (2, '[s]', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (3, '5', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (3, '6', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (3, '8', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (3, '10', false);

-- Добавим тест для второго урока
INSERT INTO lesson_tests (lesson_id, title) VALUES (2, 'Тест по Present Simple');

-- Добавим вопросы для теста второго урока
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (2, 'Какое окончание добавляется к глаголу в 3-м лице единственного числа (he/she/it)?', 1);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (2, 'Выберите правильную форму глагола "study" в 3-м лице единственного числа:', 2);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (2, 'Какая форма используется для образования отрицания с "he"?', 3);

-- Добавим варианты ответов для вопросов второго теста
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (4, '-ing', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (4, '-s/-es', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (4, '-ed', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (4, 'никакое', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (5, 'studys', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (5, 'studyes', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (5, 'studies', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (5, 'studying', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (6, 'he do not', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (6, 'he does not', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (6, 'he not', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (6, 'he is not', false);
