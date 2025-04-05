
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

-- Удаляем старые уроки (если есть)
TRUNCATE TABLE lesson_options CASCADE;
TRUNCATE TABLE lesson_questions CASCADE;
TRUNCATE TABLE lesson_tests CASCADE;
TRUNCATE TABLE lesson_progress CASCADE;
TRUNCATE TABLE lessons CASCADE;

-- Добавляем 5 уроков по временам английского языка
INSERT INTO lessons (title, content, level, order_number) VALUES
('Present Simple: Базовые правила', 
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
</ul>

<h3>Где эти наречия ставятся в предложении:</h3>
<ul>
  <li>Перед смысловым глаголом: <em>I <strong>often go</strong> to the cinema.</em></li>
  <li>После глагола to be: <em>She <strong>is always</strong> late.</em></li>
  <li>Между вспомогательным и смысловым глаголом: <em>He <strong>doesn''t usually work</strong> on Saturdays.</em></li>
</ul>

<h3>Исключения и особые случаи</h3>
<p>Глагол "be" (быть) в Present Simple имеет особые формы и не требует вспомогательных глаголов:</p>
<ul>
  <li>I am (я есть)</li>
  <li>You/We/They are (ты/мы/они есть)</li>
  <li>He/She/It is (он/она/оно есть)</li>
</ul>

<p>Отрицание с "be":</p>
<ul>
  <li>I am not (I''m not)</li>
  <li>You/We/They are not (aren''t)</li>
  <li>He/She/It is not (isn''t)</li>
</ul>

<p>Вопрос с "be":</p>
<ul>
  <li>Am I...?</li>
  <li>Are you/we/they...?</li>
  <li>Is he/she/it...?</li>
</ul>

<h3>Примеры предложений в Present Simple</h3>
<ol>
  <li>I <strong>drink</strong> coffee every morning. (Я пью кофе каждое утро.)</li>
  <li>She <strong>doesn''t eat</strong> meat. (Она не ест мясо.)</li>
  <li><strong>Do they live</strong> in London? (Они живут в Лондоне?)</li>
  <li>The sun <strong>rises</strong> in the east. (Солнце встает на востоке.)</li>
  <li>I <strong>am</strong> a teacher. (Я учитель.)</li>
  <li>He <strong>isn''t</strong> at home now. (Его нет дома сейчас.)</li>
  <li><strong>Are</strong> you a student? (Ты студент?)</li>
</ol>', 
'Начальный', 1);

INSERT INTO lessons (title, content, level, order_number) VALUES
('Present Continuous: Действия в процессе', 
'<h2>Present Continuous: Действия в процессе</h2>
<p>Present Continuous (Present Progressive) — это время, которое используется для описания действий, происходящих в момент речи или в текущий период времени.</p>

<h3>Когда использовать Present Continuous</h3>
<ul>
  <li><strong>Действия, происходящие в момент речи:</strong> <em>I am reading a book now.</em> (Я сейчас читаю книгу.)</li>
  <li><strong>Временные действия в настоящем:</strong> <em>She is studying English this year.</em> (Она изучает английский в этом году.)</li>
  <li><strong>Запланированные действия в ближайшем будущем:</strong> <em>We are meeting tomorrow.</em> (Мы встречаемся завтра.)</li>
  <li><strong>Постоянно повторяющиеся действия, вызывающие раздражение:</strong> <em>He is always losing his keys.</em> (Он всегда теряет свои ключи.)</li>
</ul>

<h3>Образование Present Continuous</h3>
<p>Present Continuous образуется при помощи вспомогательного глагола be (am/is/are) и причастия настоящего времени (формы с -ing).</p>

<h4>Утвердительная форма:</h4>
<ul>
  <li>I am (I''m) + глагол с -ing: <em>I am working.</em> (Я работаю.)</li>
  <li>You/We/They are (You''re/We''re/They''re) + глагол с -ing: <em>You are working.</em> (Ты работаешь.)</li>
  <li>He/She/It is (He''s/She''s/It''s) + глагол с -ing: <em>She is working.</em> (Она работает.)</li>
</ul>

<p>Правила добавления -ing:</p>
<ul>
  <li>Большинство глаголов: добавляем -ing: <em>work → working</em></li>
  <li>Глаголы, оканчивающиеся на -e: убираем -e и добавляем -ing: <em>write → writing</em></li>
  <li>Односложные глаголы с краткой гласной между согласными: удваиваем последнюю согласную: <em>run → running</em></li>
  <li>Глаголы, оканчивающиеся на -ie: меняем -ie на -y и добавляем -ing: <em>lie → lying</em></li>
</ul>

<h4>Отрицательная форма:</h4>
<p>Для образования отрицания используем not после вспомогательного глагола:</p>
<ul>
  <li>I am not (I''m not) + глагол с -ing: <em>I am not working.</em> (Я не работаю.)</li>
  <li>You/We/They are not (aren''t) + глагол с -ing: <em>You are not working.</em> (Ты не работаешь.)</li>
  <li>He/She/It is not (isn''t) + глагол с -ing: <em>She is not working.</em> (Она не работает.)</li>
</ul>

<h4>Вопросительная форма:</h4>
<p>Для образования вопроса выносим вспомогательный глагол в начало предложения:</p>
<ul>
  <li>Am I + глагол с -ing?: <em>Am I working?</em> (Я работаю?)</li>
  <li>Are you/we/they + глагол с -ing?: <em>Are you working?</em> (Ты работаешь?)</li>
  <li>Is he/she/it + глагол с -ing?: <em>Is she working?</em> (Она работает?)</li>
</ul>

<h3>Маркеры времени в Present Continuous</h3>
<p>Present Continuous часто используется со следующими наречиями и выражениями:</p>
<ul>
  <li>now (сейчас)</li>
  <li>at the moment (в данный момент)</li>
  <li>today (сегодня)</li>
  <li>this week/month/year (на этой неделе/в этом месяце/в этом году)</li>
  <li>Look! (Смотри!)</li>
  <li>Listen! (Слушай!)</li>
</ul>

<h3>Глаголы, не используемые в Continuous</h3>
<p>Некоторые глаголы обычно не используются в формах Continuous, так как они выражают состояние, а не действие:</p>

<p><strong>Глаголы восприятия и чувств:</strong></p>
<ul>
  <li>see (видеть)</li>
  <li>hear (слышать)</li>
  <li>smell (пахнуть, нюхать)</li>
  <li>taste (пробовать на вкус)</li>
  <li>feel (чувствовать)</li>
</ul>

<p><strong>Глаголы мыслительной деятельности:</strong></p>
<ul>
  <li>know (знать)</li>
  <li>understand (понимать)</li>
  <li>believe (верить)</li>
  <li>remember (помнить)</li>
  <li>forget (забывать)</li>
  <li>think (в значении "считать, полагать")</li>
</ul>

<p><strong>Глаголы эмоционального состояния:</strong></p>
<ul>
  <li>love (любить)</li>
  <li>hate (ненавидеть)</li>
  <li>like (нравиться)</li>
  <li>prefer (предпочитать)</li>
  <li>want (хотеть)</li>
  <li>wish (желать)</li>
</ul>

<p><strong>Глаголы обладания:</strong></p>
<ul>
  <li>have (иметь)</li>
  <li>own (владеть)</li>
  <li>belong (принадлежать)</li>
  <li>contain (содержать)</li>
</ul>

<p><strong>Другие состояния:</strong></p>
<ul>
  <li>be (быть)</li>
  <li>seem (казаться)</li>
  <li>appear (представляться)</li>
  <li>consist (состоять)</li>
  <li>depend (зависеть)</li>
</ul>

<h3>Примеры предложений в Present Continuous</h3>
<ol>
  <li>I <strong>am watching</strong> TV now. (Я смотрю телевизор сейчас.)</li>
  <li>They <strong>are playing</strong> football at the moment. (Они играют в футбол в данный момент.)</li>
  <li><strong>Is she studying</strong> for her exam? (Она готовится к экзамену?)</li>
  <li>We <strong>are not working</strong> today. (Мы не работаем сегодня.)</li>
  <li>Look! The baby <strong>is sleeping</strong>. (Смотри! Ребенок спит.)</li>
  <li>He <strong>is always complaining</strong> about everything. (Он всегда на всё жалуется.)</li>
  <li>I <strong>am meeting</strong> my friends tomorrow. (Я встречаюсь с друзьями завтра.)</li>
</ol>

<h3>Сравнение Present Simple и Present Continuous</h3>
<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr>
    <th style="padding: 8px; text-align: center;">Present Simple</th>
    <th style="padding: 8px; text-align: center;">Present Continuous</th>
  </tr>
  <tr>
    <td style="padding: 8px;">Регулярные, повторяющиеся действия</td>
    <td style="padding: 8px;">Действия, происходящие в данный момент</td>
  </tr>
  <tr>
    <td style="padding: 8px;">I <strong>play</strong> tennis every Sunday.</td>
    <td style="padding: 8px;">I <strong>am playing</strong> tennis now.</td>
  </tr>
  <tr>
    <td style="padding: 8px;">Постоянные ситуации</td>
    <td style="padding: 8px;">Временные ситуации</td>
  </tr>
  <tr>
    <td style="padding: 8px;">She <strong>works</strong> in a bank.</td>
    <td style="padding: 8px;">She <strong>is working</strong> from home this week.</td>
  </tr>
  <tr>
    <td style="padding: 8px;">Факты и общие истины</td>
    <td style="padding: 8px;">Изменения и развития</td>
  </tr>
  <tr>
    <td style="padding: 8px;">Water <strong>boils</strong> at 100°C.</td>
    <td style="padding: 8px;">The world <strong>is changing</strong> rapidly.</td>
  </tr>
  <tr>
    <td style="padding: 8px;">always, usually, often, sometimes, rarely, never</td>
    <td style="padding: 8px;">now, at the moment, today, this week, Look!, Listen!</td>
  </tr>
</table>', 
'Начальный', 2);

INSERT INTO lessons (title, content, level, order_number) VALUES
('Past Simple: События в прошлом', 
'<h2>Past Simple: События в прошлом</h2>
<p>Past Simple (простое прошедшее время) используется для обозначения действий, которые произошли и завершились в определенный момент в прошлом.</p>

<h3>Когда использовать Past Simple</h3>
<ul>
  <li><strong>Завершенные действия в прошлом:</strong> <em>I visited Paris last year.</em> (Я посетил Париж в прошлом году.)</li>
  <li><strong>Последовательность действий в прошлом:</strong> <em>She got up, had breakfast and went to work.</em> (Она встала, позавтракала и пошла на работу.)</li>
  <li><strong>Привычные или повторяющиеся действия в прошлом:</strong> <em>When I was a child, I played tennis every day.</em> (Когда я был ребенком, я играл в теннис каждый день.)</li>
  <li><strong>Состояния в прошлом:</strong> <em>He was happy in his old job.</em> (Он был счастлив на своей прежней работе.)</li>
</ul>

<h3>Образование Past Simple</h3>
<p>Past Simple образуется по-разному для правильных и неправильных глаголов.</p>

<h4>Правильные глаголы:</h4>
<p>Для правильных глаголов добавляем окончание -ed к базовой форме глагола:</p>
<ul>
  <li>work → worked (работал)</li>
  <li>play → played (играл)</li>
  <li>start → started (начал)</li>
</ul>

<p>Правила добавления -ed:</p>
<ul>
  <li>Большинство глаголов: просто добавляем -ed: <em>work → worked</em></li>
  <li>Глаголы, оканчивающиеся на -e: добавляем только -d: <em>like → liked</em></li>
  <li>Глаголы, оканчивающиеся на согласную + y: y меняем на i и добавляем -ed: <em>study → studied</em></li>
  <li>Односложные глаголы с краткой гласной и одной согласной на конце: удваиваем последнюю согласную: <em>stop → stopped</em></li>
</ul>

<h4>Неправильные глаголы:</h4>
<p>Неправильные глаголы имеют особые формы прошедшего времени, которые нужно запомнить:</p>
<ul>
  <li>go → went (идти → пошел)</li>
  <li>see → saw (видеть → видел)</li>
  <li>have → had (иметь → имел)</li>
  <li>do → did (делать → сделал)</li>
  <li>make → made (делать → сделал)</li>
  <li>come → came (приходить → пришел)</li>
  <li>take → took (брать → взял)</li>
  <li>get → got (получать → получил)</li>
  <li>be → was/were (быть → был/были)</li>
</ul>

<h4>Утвердительная форма:</h4>
<ul>
  <li>Подлежащее + глагол в прошедшем времени: <em>I worked yesterday.</em> (Я работал вчера.)</li>
  <li>Для глагола be: I/he/she/it + was, you/we/they + were: <em>I was at home.</em> (Я был дома.)</li>
</ul>

<h4>Отрицательная форма:</h4>
<p>Для образования отрицания используем вспомогательный глагол did + not (didn''t) + базовая форма глагола:</p>
<ul>
  <li>I did not (didn''t) work yesterday. (Я не работал вчера.)</li>
  <li>She did not (didn''t) go to school. (Она не ходила в школу.)</li>
</ul>

<p>Для глагола be:</p>
<ul>
  <li>I was not (wasn''t) at home. (Я не был дома.)</li>
  <li>They were not (weren''t) happy. (Они не были счастливы.)</li>
</ul>

<h4>Вопросительная форма:</h4>
<p>Для образования вопроса используем вспомогательный глагол did в начале предложения:</p>
<ul>
  <li>Did you work yesterday? (Ты работал вчера?)</li>
  <li>Did she go to school? (Она ходила в школу?)</li>
</ul>

<p>Для глагола be:</p>
<ul>
  <li>Was I at home? (Я был дома?)</li>
  <li>Were they happy? (Они были счастливы?)</li>
</ul>

<h3>Маркеры времени в Past Simple</h3>
<p>Past Simple часто используется со следующими наречиями и выражениями:</p>
<ul>
  <li>yesterday (вчера)</li>
  <li>last night/week/month/year (прошлой ночью/на прошлой неделе/в прошлом месяце/в прошлом году)</li>
  <li>... ago (... назад): two days ago (два дня назад)</li>
  <li>in 1990, in the past (в 1990 году, в прошлом)</li>
  <li>when (когда)</li>
</ul>

<h3>Примеры предложений в Past Simple</h3>
<ol>
  <li>I <strong>visited</strong> my grandmother yesterday. (Я навестил свою бабушку вчера.)</li>
  <li>She <strong>didn''t call</strong> me last night. (Она не звонила мне прошлой ночью.)</li>
  <li><strong>Did you see</strong> that movie last week? (Ты смотрел тот фильм на прошлой неделе?)</li>
  <li>We <strong>went</strong> to Spain for our holiday last summer. (Мы ездили в Испанию на каникулы прошлым летом.)</li>
  <li>The Romans <strong>built</strong> this wall 2000 years ago. (Римляне построили эту стену 2000 лет назад.)</li>
  <li>I <strong>was</strong> very busy yesterday. (Я был очень занят вчера.)</li>
  <li>They <strong>weren''t</strong> at home when I called. (Их не было дома, когда я звонил.)</li>
  <li><strong>Was</strong> he at the meeting yesterday? (Он был на собрании вчера?)</li>
  <li>When I <strong>arrived</strong>, the party <strong>had already started</strong>. (Когда я пришел, вечеринка уже началась.)</li>
</ol>

<h3>Неправильные глаголы: список наиболее употребительных</h3>
<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr>
    <th style="padding: 8px; text-align: center;">Базовая форма</th>
    <th style="padding: 8px; text-align: center;">Past Simple</th>
    <th style="padding: 8px; text-align: center;">Перевод</th>
  </tr>
  <tr>
    <td style="padding: 8px;">be</td>
    <td style="padding: 8px;">was/were</td>
    <td style="padding: 8px;">быть</td>
  </tr>
  <tr>
    <td style="padding: 8px;">begin</td>
    <td style="padding: 8px;">began</td>
    <td style="padding: 8px;">начинать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">break</td>
    <td style="padding: 8px;">broke</td>
    <td style="padding: 8px;">ломать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">bring</td>
    <td style="padding: 8px;">brought</td>
    <td style="padding: 8px;">приносить</td>
  </tr>
  <tr>
    <td style="padding: 8px;">build</td>
    <td style="padding: 8px;">built</td>
    <td style="padding: 8px;">строить</td>
  </tr>
  <tr>
    <td style="padding: 8px;">buy</td>
    <td style="padding: 8px;">bought</td>
    <td style="padding: 8px;">покупать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">come</td>
    <td style="padding: 8px;">came</td>
    <td style="padding: 8px;">приходить</td>
  </tr>
  <tr>
    <td style="padding: 8px;">do</td>
    <td style="padding: 8px;">did</td>
    <td style="padding: 8px;">делать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">drink</td>
    <td style="padding: 8px;">drank</td>
    <td style="padding: 8px;">пить</td>
  </tr>
  <tr>
    <td style="padding: 8px;">eat</td>
    <td style="padding: 8px;">ate</td>
    <td style="padding: 8px;">есть</td>
  </tr>
  <tr>
    <td style="padding: 8px;">feel</td>
    <td style="padding: 8px;">felt</td>
    <td style="padding: 8px;">чувствовать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">find</td>
    <td style="padding: 8px;">found</td>
    <td style="padding: 8px;">находить</td>
  </tr>
  <tr>
    <td style="padding: 8px;">get</td>
    <td style="padding: 8px;">got</td>
    <td style="padding: 8px;">получать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">give</td>
    <td style="padding: 8px;">gave</td>
    <td style="padding: 8px;">давать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">go</td>
    <td style="padding: 8px;">went</td>
    <td style="padding: 8px;">идти</td>
  </tr>
</table>', 
'Начальный', 3);

INSERT INTO lessons (title, content, level, order_number) VALUES
('Future Simple: Планы и предсказания', 
'<h2>Future Simple: Планы и предсказания</h2>
<p>Future Simple (будущее простое время) используется для обозначения действий, которые произойдут в будущем. Оно выражает предсказания, предположения, обещания, решения, принятые в момент речи, и так далее.</p>

<h3>Когда использовать Future Simple</h3>
<ul>
  <li><strong>Предсказания о будущем:</strong> <em>I think it will rain tomorrow.</em> (Я думаю, завтра пойдет дождь.)</li>
  <li><strong>Спонтанные решения:</strong> <em>I''ll help you with your bags.</em> (Я помогу тебе с сумками.) — решение принято в момент речи.</li>
  <li><strong>Обещания:</strong> <em>I''ll call you later.</em> (Я позвоню тебе позже.)</li>
  <li><strong>Предположения о будущем:</strong> <em>She will probably arrive late.</em> (Она, вероятно, приедет поздно.)</li>
  <li><strong>Угрозы и предупреждения:</strong> <em>If you don''t stop, I''ll tell your parents.</em> (Если ты не остановишься, я расскажу твоим родителям.)</li>
</ul>

<h3>Образование Future Simple</h3>
<p>Future Simple образуется с помощью вспомогательного глагола will (или shall для I/we в формальной речи) и базовой формы глагола (инфинитива без to).</p>

<h4>Утвердительная форма:</h4>
<ul>
  <li>I/You/He/She/It/We/They + will + глагол: <em>I will work tomorrow.</em> (Я буду работать завтра.)</li>
  <li>Сокращенная форма: I''ll, you''ll, he''ll, she''ll, it''ll, we''ll, they''ll: <em>I''ll call you later.</em> (Я позвоню тебе позже.)</li>
</ul>

<h4>Отрицательная форма:</h4>
<p>Для образования отрицания используем will + not (won''t):</p>
<ul>
  <li>I/You/He/She/It/We/They + will not (won''t) + глагол: <em>I won''t be at home tomorrow.</em> (Меня не будет дома завтра.)</li>
</ul>

<h4>Вопросительная форма:</h4>
<p>Для образования вопроса выносим will в начало предложения:</p>
<ul>
  <li>Will + I/you/he/she/it/we/they + глагол?: <em>Will you help me?</em> (Ты поможешь мне?)</li>
</ul>

<h3>Shall вместо will</h3>
<p>В формальном британском английском иногда используется shall вместо will с местоимениями I и we:</p>
<ul>
  <li>I shall attend the meeting tomorrow. (Я буду присутствовать на собрании завтра.) — формально</li>
  <li>We shall overcome these difficulties. (Мы преодолеем эти трудности.) — формально</li>
</ul>

<p>Shall также используется в вопросах для выражения предложения:</p>
<ul>
  <li>Shall I open the window? (Мне открыть окно?)</li>
  <li>Shall we go to the cinema? (Пойдем в кино?)</li>
</ul>

<h3>Маркеры времени в Future Simple</h3>
<p>Future Simple часто используется со следующими наречиями и выражениями:</p>
<ul>
  <li>tomorrow (завтра)</li>
  <li>the day after tomorrow (послезавтра)</li>
  <li>next week/month/year (на следующей неделе/в следующем месяце/в следующем году)</li>
  <li>tonight (сегодня вечером)</li>
  <li>soon (скоро)</li>
  <li>in the future (в будущем)</li>
  <li>in 2030, in three days (в 2030 году, через три дня)</li>
</ul>

<h3>Другие способы выражения будущего</h3>
<p>Важно отметить, что Future Simple — не единственный способ выражения будущего времени в английском языке. Другие способы включают:</p>

<h4>be going to + инфинитив</h4>
<p>Используется для выражения намерений и планов, а также для предсказаний на основе видимых признаков:</p>
<ul>
  <li>I am going to study tonight. (Я собираюсь заниматься сегодня вечером.) — намерение</li>
  <li>Look at those clouds! It is going to rain. (Посмотри на эти облака! Собирается дождь.) — предсказание на основе признаков</li>
</ul>

<h4>Present Continuous для запланированных действий</h4>
<p>Используется для выражения запланированных, договоренных действий в ближайшем будущем:</p>
<ul>
  <li>I am meeting John at 6 tomorrow. (Я встречаюсь с Джоном завтра в 6.) — запланированная встреча</li>
  <li>We are flying to Paris next week. (Мы летим в Париж на следующей неделе.) — запланированный полет</li>
</ul>

<h4>Present Simple для расписаний</h4>
<p>Используется для действий, происходящих по расписанию или программе:</p>
<ul>
  <li>The train leaves at 5 pm. (Поезд отправляется в 5 вечера.)</li>
  <li>The semester begins on September 1. (Семестр начинается 1 сентября.)</li>
</ul>

<h3>Future Simple в условных предложениях</h3>
<p>Future Simple используется в условных предложениях первого типа (реальные условия в будущем) в главной части предложения:</p>
<ul>
  <li>If it rains tomorrow, I will stay at home. (Если завтра пойдет дождь, я останусь дома.)</li>
  <li>I will help you if I have time. (Я помогу тебе, если у меня будет время.)</li>
</ul>

<p>Важно помнить, что в придаточных предложениях условия и времени (after, before, when, as soon as, until, unless) мы используем Present Simple вместо Future Simple:</p>
<ul>
  <li>I will call you when I arrive (not "will arrive"). (Я позвоню тебе, когда приеду.)</li>
  <li>He will be happy if he passes the exam (not "will pass"). (Он будет счастлив, если сдаст экзамен.)</li>
</ul>

<h3>Примеры предложений в Future Simple</h3>
<ol>
  <li>I <strong>will call</strong> you tomorrow. (Я позвоню тебе завтра.)</li>
  <li>She <strong>won''t come</strong> to the party. (Она не придет на вечеринку.)</li>
  <li><strong>Will they visit</strong> us next week? (Они навестят нас на следующей неделе?)</li>
  <li>I think it <strong>will be</strong> sunny tomorrow. (Я думаю, завтра будет солнечно.)</li>
  <li>Don''t worry, everything <strong>will be</strong> fine. (Не волнуйся, все будет хорошо.)</li>
  <li>I''m sure he <strong>will understand</strong> the situation. (Я уверен, он поймет ситуацию.)</li>
  <li>If you study hard, you <strong>will pass</strong> the exam. (Если ты будешь усердно учиться, ты сдашь экзамен.)</li>
  <li><strong>Shall we go</strong> to the cinema tonight? (Пойдем в кино сегодня вечером?)</li>
  <li>I <strong>shall never forget</strong> this day. (Я никогда не забуду этот день.) — формально</li>
</ol>', 
'Средний', 4);

INSERT INTO lessons (title, content, level, order_number) VALUES
('Present Perfect: Связь прошлого с настоящим', 
'<h2>Present Perfect: Связь прошлого с настоящим</h2>
<p>Present Perfect (настоящее совершенное время) используется для обозначения действий, которые произошли в прошлом, но имеют связь с настоящим моментом. Это время показывает результат прошлых действий или их влияние на настоящее.</p>

<h3>Когда использовать Present Perfect</h3>
<ul>
  <li><strong>Действия, которые только что завершились, и их результат актуален в настоящем:</strong> <em>I have lost my keys.</em> (Я потерял свои ключи.)</li>
  <li><strong>Опыт или действия, случившиеся когда-то в жизни (без указания конкретного времени):</strong> <em>She has visited Paris twice.</em> (Она дважды посещала Париж.)</li>
  <li><strong>Действия, начавшиеся в прошлом и продолжающиеся до настоящего момента:</strong> <em>I have lived here for 10 years.</em> (Я живу здесь 10 лет.)</li>
  <li><strong>Действие завершилось, но период времени еще не закончился:</strong> <em>I have read two books this week.</em> (Я прочитал две книги на этой неделе.)</li>
</ul>

<h3>Образование Present Perfect</h3>
<p>Present Perfect образуется с помощью вспомогательного глагола have/has и причастия прошедшего времени (Past Participle).</p>

<h4>Утвердительная форма:</h4>
<ul>
  <li>I/You/We/They + have (I''ve/You''ve/We''ve/They''ve) + Past Participle: <em>I have worked.</em> (Я работал.)</li>
  <li>He/She/It + has (He''s/She''s/It''s) + Past Participle: <em>She has worked.</em> (Она работала.)</li>
</ul>

<p>Причастие прошедшего времени (Past Participle):</p>
<ul>
  <li>Для правильных глаголов: добавляем -ed (как в Past Simple): <em>work → worked</em></li>
  <li>Для неправильных глаголов: используем третью колонку таблицы неправильных глаголов: <em>go → gone, see → seen, have → had</em></li>
</ul>

<h4>Отрицательная форма:</h4>
<p>Для образования отрицания используем have/has + not (haven''t/hasn''t):</p>
<ul>
  <li>I/You/We/They + have not (haven''t) + Past Participle: <em>I have not worked.</em> (Я не работал.)</li>
  <li>He/She/It + has not (hasn''t) + Past Participle: <em>She has not worked.</em> (Она не работала.)</li>
</ul>

<h4>Вопросительная форма:</h4>
<p>Для образования вопроса выносим have/has в начало предложения:</p>
<ul>
  <li>Have + I/you/we/they + Past Participle?: <em>Have you worked?</em> (Ты работал?)</li>
  <li>Has + he/she/it + Past Participle?: <em>Has she worked?</em> (Она работала?)</li>
</ul>

<h3>Маркеры времени в Present Perfect</h3>
<p>Present Perfect часто используется со следующими наречиями и выражениями:</p>
<ul>
  <li>just (только что): <em>I have just finished my homework.</em> (Я только что закончил свою домашнюю работу.)</li>
  <li>already (уже): <em>She has already seen that movie.</em> (Она уже смотрела этот фильм.)</li>
  <li>yet (уже/еще) в вопросах и отрицаниях: <em>Have you done it yet?</em> (Ты уже сделал это?) / <em>I haven''t done it yet.</em> (Я еще не сделал это.)</li>
  <li>ever (когда-либо): <em>Have you ever been to Japan?</em> (Ты когда-нибудь был в Японии?)</li>
  <li>never (никогда): <em>I have never eaten sushi.</em> (Я никогда не ел суши.)</li>
  <li>for (в течение): <em>She has studied English for 5 years.</em> (Она изучает английский 5 лет.)</li>
  <li>since (с): <em>I have lived here since 2015.</em> (Я живу здесь с 2015 года.)</li>
  <li>recently/lately (недавно): <em>They have recently moved to a new house.</em> (Они недавно переехали в новый дом.)</li>
  <li>this week/month/year: <em>I have read three books this month.</em> (Я прочитал три книги в этом месяце.)</li>
</ul>

<h3>Сравнение Present Perfect и Past Simple</h3>
<p>Одна из самых сложных тем в английской грамматике — это различие между Present Perfect и Past Simple. Вот основные отличия:</p>

<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr>
    <th style="padding: 8px; text-align: center;">Present Perfect</th>
    <th style="padding: 8px; text-align: center;">Past Simple</th>
  </tr>
  <tr>
    <td style="padding: 8px;">Связь с настоящим</td>
    <td style="padding: 8px;">Нет связи с настоящим</td>
  </tr>
  <tr>
    <td style="padding: 8px;">I <strong>have lost</strong> my keys (and I still can''t find them).</td>
    <td style="padding: 8px;">I <strong>lost</strong> my keys yesterday (but I found them later).</td>
  </tr>
  <tr>
    <td style="padding: 8px;">Без указания конкретного времени</td>
    <td style="padding: 8px;">С указанием конкретного времени</td>
  </tr>
  <tr>
    <td style="padding: 8px;">I <strong>have visited</strong> Paris twice.</td>
    <td style="padding: 8px;">I <strong>visited</strong> Paris last summer.</td>
  </tr>
  <tr>
    <td style="padding: 8px;">Действие или период продолжается</td>
    <td style="padding: 8px;">Действие завершено в прошлом</td>
  </tr>
  <tr>
    <td style="padding: 8px;">I <strong>have lived</strong> here for 10 years.</td>
    <td style="padding: 8px;">I <strong>lived</strong> in London for 10 years (but now I live elsewhere).</td>
  </tr>
  <tr>
    <td style="padding: 8px;">ever, never, just, already, yet, for, since</td>
    <td style="padding: 8px;">yesterday, last week, ... ago, in 1990, when</td>
  </tr>
</table>

<p>Следующие слова обычно используются с Past Simple, а не с Present Perfect:</p>
<ul>
  <li>yesterday (вчера)</li>
  <li>last night/week/month/year (прошлой ночью/на прошлой неделе/в прошлом месяце/в прошлом году)</li>
  <li>... ago (... назад)</li>
  <li>in + прошлый год (in 1995)</li>
  <li>when (когда)</li>
</ul>

<h3>Present Perfect Continuous</h3>
<p>Существует также время Present Perfect Continuous, которое образуется как have/has + been + глагол с окончанием -ing. Оно используется для действий, которые начались в прошлом и продолжались в течение некоторого времени до настоящего момента, часто с акцентом на длительность:</p>
<ul>
  <li>I have been working for 3 hours. (Я работаю уже 3 часа.)</li>
  <li>She has been studying English since 2018. (Она изучает английский с 2018 года.)</li>
</ul>

<h3>Примеры предложений в Present Perfect</h3>
<ol>
  <li>I <strong>have lost</strong> my keys. Can you help me find them? (Я потерял свои ключи. Можешь помочь мне их найти?)</li>
  <li>She <strong>has worked</strong> here for five years. (Она работает здесь пять лет.)</li>
  <li><strong>Have you ever visited</strong> New York? (Ты когда-нибудь был в Нью-Йорке?)</li>
  <li>They <strong>haven''t finished</strong> their project yet. (Они еще не закончили свой проект.)</li>
  <li>I <strong>have already seen</strong> that movie twice. (Я уже дважды смотрел этот фильм.)</li>
  <li>She <strong>has just arrived</strong> home. (Она только что пришла домой.)</li>
  <li>We <strong>have known</strong> each other since childhood. (Мы знаем друг друга с детства.)</li>
  <li><strong>Have you read</strong> any good books recently? (Ты читал какие-нибудь хорошие книги в последнее время?)</li>
  <li>I <strong>have never tried</strong> sushi before. (Я никогда раньше не пробовал суши.)</li>
  <li>How many countries <strong>have you visited</strong> in your life? (Сколько стран ты посетил в своей жизни?)</li>
</ol>

<h3>Список неправильных глаголов в Past Simple и Present Perfect</h3>
<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr>
    <th style="padding: 8px; text-align: center;">Инфинитив</th>
    <th style="padding: 8px; text-align: center;">Past Simple</th>
    <th style="padding: 8px; text-align: center;">Past Participle</th>
    <th style="padding: 8px; text-align: center;">Перевод</th>
  </tr>
  <tr>
    <td style="padding: 8px;">be</td>
    <td style="padding: 8px;">was/were</td>
    <td style="padding: 8px;">been</td>
    <td style="padding: 8px;">быть</td>
  </tr>
  <tr>
    <td style="padding: 8px;">begin</td>
    <td style="padding: 8px;">began</td>
    <td style="padding: 8px;">begun</td>
    <td style="padding: 8px;">начинать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">break</td>
    <td style="padding: 8px;">broke</td>
    <td style="padding: 8px;">broken</td>
    <td style="padding: 8px;">ломать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">bring</td>
    <td style="padding: 8px;">brought</td>
    <td style="padding: 8px;">brought</td>
    <td style="padding: 8px;">приносить</td>
  </tr>
  <tr>
    <td style="padding: 8px;">buy</td>
    <td style="padding: 8px;">bought</td>
    <td style="padding: 8px;">bought</td>
    <td style="padding: 8px;">покупать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">come</td>
    <td style="padding: 8px;">came</td>
    <td style="padding: 8px;">come</td>
    <td style="padding: 8px;">приходить</td>
  </tr>
  <tr>
    <td style="padding: 8px;">do</td>
    <td style="padding: 8px;">did</td>
    <td style="padding: 8px;">done</td>
    <td style="padding: 8px;">делать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">drink</td>
    <td style="padding: 8px;">drank</td>
    <td style="padding: 8px;">drunk</td>
    <td style="padding: 8px;">пить</td>
  </tr>
  <tr>
    <td style="padding: 8px;">eat</td>
    <td style="padding: 8px;">ate</td>
    <td style="padding: 8px;">eaten</td>
    <td style="padding: 8px;">есть</td>
  </tr>
  <tr>
    <td style="padding: 8px;">find</td>
    <td style="padding: 8px;">found</td>
    <td style="padding: 8px;">found</td>
    <td style="padding: 8px;">находить</td>
  </tr>
  <tr>
    <td style="padding: 8px;">get</td>
    <td style="padding: 8px;">got</td>
    <td style="padding: 8px;">got/gotten</td>
    <td style="padding: 8px;">получать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">give</td>
    <td style="padding: 8px;">gave</td>
    <td style="padding: 8px;">given</td>
    <td style="padding: 8px;">давать</td>
  </tr>
  <tr>
    <td style="padding: 8px;">go</td>
    <td style="padding: 8px;">went</td>
    <td style="padding: 8px;">gone</td>
    <td style="padding: 8px;">идти</td>
  </tr>
  <tr>
    <td style="padding: 8px;">have</td>
    <td style="padding: 8px;">had</td>
    <td style="padding: 8px;">had</td>
    <td style="padding: 8px;">иметь</td>
  </tr>
  <tr>
    <td style="padding: 8px;">know</td>
    <td style="padding: 8px;">knew</td>
    <td style="padding: 8px;">known</td>
    <td style="padding: 8px;">знать</td>
  </tr>
</table>', 
'Средний', 5);

-- Создаем тесты для каждого урока

-- Тест для урока 1 (Present Simple: Базовые правила)
INSERT INTO lesson_tests (lesson_id, title) VALUES (1, 'Тест по Present Simple');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (1, 'Какую форму принимает глагол в 3-м лице единственного числа (he/she/it) в Present Simple?', 1);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (1, 'Для чего используется время Present Simple?', 2);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (1, 'Как образуется отрицание в Present Simple?', 3);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (1, 'Выберите правильную форму глагола "study" в 3-м лице единственного числа:', 4);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (1, 'Какое из следующих предложений содержит правильную форму глагола в Present Simple?', 5);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (1, 'Добавляется окончание -ing', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (1, 'Добавляется окончание -s/-es', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (1, 'Добавляется окончание -ed', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (1, 'Форма глагола не меняется', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (2, 'Для описания действий, происходящих в данный момент', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (2, 'Для описания регулярных действий и фактов', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (2, 'Только для описания будущих планов', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (2, 'Для действий, которые завершились в прошлом', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (3, 'Добавляется "not" после глагола', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (3, 'Используется вспомогательный глагол do/does + not + основная форма глагола', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (3, 'Используется am/is/are + not', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (3, 'Добавляется "no" перед подлежащим', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (4, 'studys', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (4, 'studyes', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (4, 'studies', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (4, 'studying', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (5, 'She reading books every day.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (5, 'He play tennis on Sundays.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (5, 'They goes to school by bus.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (5, 'She watches TV in the evening.', true);

-- Тест для урока 2 (Present Continuous: Действия в процессе)
INSERT INTO lesson_tests (lesson_id, title) VALUES (2, 'Тест по Present Continuous');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (6, 'Как образуется Present Continuous?', 1);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (6, 'Для чего используется время Present Continuous?', 2);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (6, 'Выберите правильную форму глагола "write" в Present Continuous для "he":', 3);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (6, 'Какие глаголы обычно НЕ используются в форме Continuous?', 4);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (6, 'Какое из предложений содержит ошибку в использовании Present Continuous?', 5);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (6, 'be (am/is/are) + глагол с -ing', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (6, 'do/does + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (6, 'has/have + глагол с -ed', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (6, 'глагол с окончанием -s/-es', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (7, 'Для описания регулярных действий', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (7, 'Для действий, происходящих в момент речи или в текущий период', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (7, 'Только для описания прошедших событий', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (7, 'Для описания действий, которые никогда не происходили', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (8, 'he write', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (8, 'he is writing', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (8, 'he writing', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (8, 'he writes', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (9, 'Глаголы движения (run, walk)', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (9, 'Глаголы чувственного восприятия (see, hear)', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (9, 'Глаголы речи (say, tell)', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (9, 'Глаголы действия (do, make)', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (10, 'I am studying English now.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (10, 'They are watching TV at the moment.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (10, 'She is knowing the answer.', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (10, 'We are having dinner right now.', false);

-- Тест для урока 3 (Past Simple: События в прошлом)
INSERT INTO lesson_tests (lesson_id, title) VALUES (3, 'Тест по Past Simple');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (11, 'Как образуется прошедшее время (Past Simple) правильных глаголов?', 1);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (11, 'Для чего используется время Past Simple?', 2);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (11, 'Выберите правильную форму прошедшего времени глагола "go":', 3);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (11, 'Как образуется отрицание в Past Simple (кроме глагола "be")?', 4);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (11, 'Какое из следующих предложений содержит правильное использование Past Simple?', 5);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (11, 'Добавляется окончание -ing', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (11, 'Добавляется окончание -s', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (11, 'Добавляется окончание -ed', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (11, 'Добавляется will перед глаголом', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (12, 'Для действий, происходящих в настоящий момент', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (12, 'Для регулярных действий в настоящем', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (12, 'Для завершенных действий в определенный момент в прошлом', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (12, 'Для будущих запланированных действий', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (13, 'goed', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (13, 'went', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (13, 'gone', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (13, 'going', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (14, 'no + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (14, 'do not + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (14, 'did not + базовая форма глагола', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (14, 'not + глагол с -ed', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (15, 'I am visited my grandmother yesterday.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (15, 'She working last week.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (15, 'They didn''t went to the party.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (15, 'We arrived at 8 o''clock last night.', true);

-- Тест для урока 4 (Future Simple: Планы и предсказания)
INSERT INTO lesson_tests (lesson_id, title) VALUES (4, 'Тест по Future Simple');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (16, 'Как образуется Future Simple?', 1);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (16, 'Для чего используется время Future Simple?', 2);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (16, 'Какая сокращенная форма "will not" является правильной?', 3);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (16, 'Какое из следующих предложений содержит правильное использование Future Simple?', 4);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (16, 'Какое время используется в придаточных предложениях условия и времени вместо Future Simple?', 5);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (16, 'do/does + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (16, 'will + базовая форма глагола', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (16, 'am/is/are + глагол с -ing', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (16, 'have/has + глагол с -ed', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (17, 'Для описания завершенных действий в прошлом', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (17, 'Только для описания регулярных действий', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (17, 'Для предсказаний, обещаний и спонтанных решений о будущем', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (17, 'Для действий, происходящих в момент речи', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (18, 'willn''t', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (18, 'will''nt', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (18, 'won''t', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (18, 'will not''', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (19, 'She go to London tomorrow.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (19, 'I am will visit you next week.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (19, 'We will help you with your project.', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (19, 'They will going to the cinema tonight.', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (20, 'Future Simple', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (20, 'Present Simple', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (20, 'Past Simple', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (20, 'Present Continuous', false);

-- Тест для урока 5 (Present Perfect: Связь прошлого с настоящим)
INSERT INTO lesson_tests (lesson_id, title) VALUES (5, 'Тест по Present Perfect');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (21, 'Как образуется Present Perfect?', 1);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (21, 'Для чего используется время Present Perfect?', 2);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (21, 'Какая из форм третьего лица единственного числа в Present Perfect является правильной?', 3);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (21, 'С какими словами обычно используется Present Perfect?', 4);
INSERT INTO lesson_questions (test_id, text, order_number) VALUES (21, 'Какое из следующих предложений содержит правильное использование Present Perfect?', 5);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (21, 'do/does + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (21, 'will + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (21, 'have/has + Past Participle (причастие прошедшего времени)', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (21, 'am/is/are + глагол с -ing', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (22, 'Для действий, происходящих в данный момент', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (22, 'Для действий, которые произошли в прошлом и имеют связь с настоящим', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (22, 'Только для регулярных действий в настоящем', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (22, 'Для действий, которые произойдут в будущем', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (23, 'He have gone', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (23, 'He has go', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (23, 'He has gone', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (23, 'He have went', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (24, 'yesterday, last week, three days ago', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (24, 'already, just, ever, never, yet, since, for', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (24, 'tomorrow, next week, in two days', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (24, 'now, at the moment, look!, listen!', false);

INSERT INTO lesson_options (question_id, text, is_correct) VALUES (25, 'I have gone to France last year.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (25, 'She has saw that movie.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (25, 'They have lived here since 2010.', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (25, 'We have studying English for two hours.', false);

