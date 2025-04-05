
-- Демонстрационные данные для тестирования

-- Добавление тестов
INSERT INTO tests (title, description, difficulty, questions_count, time_limit) VALUES
('Начальный тест по английскому', 'Тест для проверки базовых знаний английского языка', 'Начальный', 3, 5),
('Грамматика: Present Simple', 'Проверка знаний времени Present Simple', 'Средний', 3, 5),
('Фразовые глаголы', 'Тест на знание распространенных фразовых глаголов', 'Продвинутый', 3, 7);

-- Добавление вопросов для теста 1
INSERT INTO questions (test_id, text, order_num) VALUES
((SELECT id FROM tests WHERE title = 'Начальный тест по английскому' LIMIT 1), 'What ___ your name?', 1),
((SELECT id FROM tests WHERE title = 'Начальный тест по английскому' LIMIT 1), 'She ___ from Russia.', 2),
((SELECT id FROM tests WHERE title = 'Начальный тест по английскому' LIMIT 1), 'I ___ coffee every morning.', 3);

-- Добавление вариантов ответов для вопросов теста 1
INSERT INTO options (question_id, text, is_correct) VALUES
((SELECT id FROM questions WHERE text = 'What ___ your name?' LIMIT 1), 'are', false),
((SELECT id FROM questions WHERE text = 'What ___ your name?' LIMIT 1), 'is', true),
((SELECT id FROM questions WHERE text = 'What ___ your name?' LIMIT 1), 'am', false),
((SELECT id FROM questions WHERE text = 'What ___ your name?' LIMIT 1), 'be', false),
((SELECT id FROM questions WHERE text = 'She ___ from Russia.' LIMIT 1), 'are', false),
((SELECT id FROM questions WHERE text = 'She ___ from Russia.' LIMIT 1), 'is', true),
((SELECT id FROM questions WHERE text = 'She ___ from Russia.' LIMIT 1), 'am', false),
((SELECT id FROM questions WHERE text = 'She ___ from Russia.' LIMIT 1), 'be', false),
((SELECT id FROM questions WHERE text = 'I ___ coffee every morning.' LIMIT 1), 'drink', true),
((SELECT id FROM questions WHERE text = 'I ___ coffee every morning.' LIMIT 1), 'drinks', false),
((SELECT id FROM questions WHERE text = 'I ___ coffee every morning.' LIMIT 1), 'drinking', false),
((SELECT id FROM questions WHERE text = 'I ___ coffee every morning.' LIMIT 1), 'am drink', false);

-- Добавление курсов
INSERT INTO courses (title, description, level, lessons_count) VALUES
('Английский для начинающих (A1)', 'Изучите основы английского языка: алфавит, простые фразы, базовая грамматика.', 'Начальный', 5),
('Разговорный английский (A2-B1)', 'Практикуйте повседневное общение на английском языке.', 'Средний', 4),
('Деловой английский (B1-B2)', 'Освойте профессиональную лексику и навыки ведения бизнес-переговоров.', 'Продвинутый', 3);

-- Добавление уроков для курса "Английский для начинающих (A1)"
INSERT INTO lessons (course_id, title, content, order_number) VALUES
((SELECT id FROM courses WHERE title = 'Английский для начинающих (A1)' LIMIT 1), 
'Знакомство с алфавитом', 
'<h2>Английский алфавит</h2>
<p>Английский алфавит состоит из 26 букв:</p>
<div class="grid grid-cols-4 gap-2">
  <div class="bg-primary/10 p-2 rounded text-center">Aa</div>
  <div class="bg-primary/10 p-2 rounded text-center">Bb</div>
  <div class="bg-primary/10 p-2 rounded text-center">Cc</div>
  <div class="bg-primary/10 p-2 rounded text-center">Dd</div>
  <div class="bg-primary/10 p-2 rounded text-center">Ee</div>
  <div class="bg-primary/10 p-2 rounded text-center">Ff</div>
  <div class="bg-primary/10 p-2 rounded text-center">Gg</div>
  <div class="bg-primary/10 p-2 rounded text-center">Hh</div>
  <div class="bg-primary/10 p-2 rounded text-center">Ii</div>
  <div class="bg-primary/10 p-2 rounded text-center">Jj</div>
  <div class="bg-primary/10 p-2 rounded text-center">Kk</div>
  <div class="bg-primary/10 p-2 rounded text-center">Ll</div>
  <div class="bg-primary/10 p-2 rounded text-center">Mm</div>
  <div class="bg-primary/10 p-2 rounded text-center">Nn</div>
  <div class="bg-primary/10 p-2 rounded text-center">Oo</div>
  <div class="bg-primary/10 p-2 rounded text-center">Pp</div>
  <div class="bg-primary/10 p-2 rounded text-center">Qq</div>
  <div class="bg-primary/10 p-2 rounded text-center">Rr</div>
  <div class="bg-primary/10 p-2 rounded text-center">Ss</div>
  <div class="bg-primary/10 p-2 rounded text-center">Tt</div>
  <div class="bg-primary/10 p-2 rounded text-center">Uu</div>
  <div class="bg-primary/10 p-2 rounded text-center">Vv</div>
  <div class="bg-primary/10 p-2 rounded text-center">Ww</div>
  <div class="bg-primary/10 p-2 rounded text-center">Xx</div>
  <div class="bg-primary/10 p-2 rounded text-center">Yy</div>
  <div class="bg-primary/10 p-2 rounded text-center">Zz</div>
</div>
<p class="mt-4">При чтении английских слов важно правильно произносить буквы. Некоторые буквы английского алфавита произносятся не так, как в русском.</p>
<h3 class="mt-4">Гласные буквы</h3>
<p>В английском языке 5 гласных букв: A, E, I, O, U. Буква Y иногда может выступать в роли гласной.</p>
<h3 class="mt-4">Согласные буквы</h3>
<p>Остальные буквы являются согласными.</p>', 
1),

((SELECT id FROM courses WHERE title = 'Английский для начинающих (A1)' LIMIT 1), 
'Приветствия и знакомство', 
'<h2>Приветствия и знакомство</h2>
<p>В этом уроке мы изучим основные фразы для приветствия и знакомства на английском языке.</p>

<h3 class="mt-4">Приветствия</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>Hello!</strong> - Привет!</li>
  <li><strong>Hi!</strong> - Привет! (неформальное)</li>
  <li><strong>Good morning!</strong> - Доброе утро!</li>
  <li><strong>Good afternoon!</strong> - Добрый день!</li>
  <li><strong>Good evening!</strong> - Добрый вечер!</li>
  <li><strong>How are you?</strong> - Как дела?</li>
  <li><strong>I'm fine, thank you.</strong> - Я в порядке, спасибо.</li>
  <li><strong>Good, thanks.</strong> - Хорошо, спасибо.</li>
</ul>

<h3 class="mt-4">Знакомство</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>My name is ...</strong> - Меня зовут ...</li>
  <li><strong>I'm ...</strong> - Я ...</li>
  <li><strong>What's your name?</strong> - Как тебя зовут?</li>
  <li><strong>Nice to meet you.</strong> - Приятно познакомиться.</li>
  <li><strong>Where are you from?</strong> - Откуда ты?</li>
  <li><strong>I'm from ...</strong> - Я из ...</li>
</ul>

<h3 class="mt-4">Диалог знакомства</h3>
<div class="bg-primary/5 p-4 rounded mt-4">
  <p><strong>A:</strong> Hello!</p>
  <p><strong>B:</strong> Hi!</p>
  <p><strong>A:</strong> My name is John. What's your name?</p>
  <p><strong>B:</strong> I'm Sarah. Nice to meet you!</p>
  <p><strong>A:</strong> Nice to meet you too. Where are you from?</p>
  <p><strong>B:</strong> I'm from Canada. And you?</p>
  <p><strong>A:</strong> I'm from the United States.</p>
  <p><strong>B:</strong> How are you?</p>
  <p><strong>A:</strong> I'm fine, thank you. And you?</p>
  <p><strong>B:</strong> Good, thanks!</p>
</div>', 
2),

((SELECT id FROM courses WHERE title = 'Английский для начинающих (A1)' LIMIT 1), 
'Числа от 1 до 100', 
'<h2>Числа от 1 до 100</h2>
<p>В этом уроке мы изучим числа от 1 до 100 на английском языке.</p>

<h3 class="mt-4">Числа от 1 до 10</h3>
<div class="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
  <div class="bg-primary/10 p-2 rounded text-center">1 - one</div>
  <div class="bg-primary/10 p-2 rounded text-center">2 - two</div>
  <div class="bg-primary/10 p-2 rounded text-center">3 - three</div>
  <div class="bg-primary/10 p-2 rounded text-center">4 - four</div>
  <div class="bg-primary/10 p-2 rounded text-center">5 - five</div>
  <div class="bg-primary/10 p-2 rounded text-center">6 - six</div>
  <div class="bg-primary/10 p-2 rounded text-center">7 - seven</div>
  <div class="bg-primary/10 p-2 rounded text-center">8 - eight</div>
  <div class="bg-primary/10 p-2 rounded text-center">9 - nine</div>
  <div class="bg-primary/10 p-2 rounded text-center">10 - ten</div>
</div>

<h3 class="mt-4">Числа от 11 до 20</h3>
<div class="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
  <div class="bg-primary/10 p-2 rounded text-center">11 - eleven</div>
  <div class="bg-primary/10 p-2 rounded text-center">12 - twelve</div>
  <div class="bg-primary/10 p-2 rounded text-center">13 - thirteen</div>
  <div class="bg-primary/10 p-2 rounded text-center">14 - fourteen</div>
  <div class="bg-primary/10 p-2 rounded text-center">15 - fifteen</div>
  <div class="bg-primary/10 p-2 rounded text-center">16 - sixteen</div>
  <div class="bg-primary/10 p-2 rounded text-center">17 - seventeen</div>
  <div class="bg-primary/10 p-2 rounded text-center">18 - eighteen</div>
  <div class="bg-primary/10 p-2 rounded text-center">19 - nineteen</div>
  <div class="bg-primary/10 p-2 rounded text-center">20 - twenty</div>
</div>

<h3 class="mt-4">Десятки до 100</h3>
<div class="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
  <div class="bg-primary/10 p-2 rounded text-center">10 - ten</div>
  <div class="bg-primary/10 p-2 rounded text-center">20 - twenty</div>
  <div class="bg-primary/10 p-2 rounded text-center">30 - thirty</div>
  <div class="bg-primary/10 p-2 rounded text-center">40 - forty</div>
  <div class="bg-primary/10 p-2 rounded text-center">50 - fifty</div>
  <div class="bg-primary/10 p-2 rounded text-center">60 - sixty</div>
  <div class="bg-primary/10 p-2 rounded text-center">70 - seventy</div>
  <div class="bg-primary/10 p-2 rounded text-center">80 - eighty</div>
  <div class="bg-primary/10 p-2 rounded text-center">90 - ninety</div>
  <div class="bg-primary/10 p-2 rounded text-center">100 - one hundred</div>
</div>

<h3 class="mt-4">Правила формирования чисел</h3>
<p>Числа от 21 до 99 образуются путем сочетания названия десятков и единиц, например:</p>
<ul class="list-disc pl-5 space-y-1">
  <li>21 - twenty-one</li>
  <li>35 - thirty-five</li>
  <li>42 - forty-two</li>
  <li>56 - fifty-six</li>
  <li>89 - eighty-nine</li>
</ul>

<h3 class="mt-4">Использование чисел</h3>
<p>Числа в английском языке используются во многих ситуациях:</p>
<ul class="list-disc pl-5 space-y-1">
  <li>Для указания возраста: <em>I am twenty-five years old.</em> (Мне 25 лет)</li>
  <li>Для указания цены: <em>The book costs fifteen dollars.</em> (Книга стоит 15 долларов)</li>
  <li>Для указания времени: <em>The meeting starts at nine o'clock.</em> (Собрание начинается в 9 часов)</li>
  <li>Для указания даты: <em>My birthday is on May twelfth.</em> (Мой день рождения 12 мая)</li>
</ul>', 
3),

((SELECT id FROM courses WHERE title = 'Английский для начинающих (A1)' LIMIT 1), 
'Личные местоимения', 
'<h2>Личные местоимения</h2>
<p>Личные местоимения заменяют существительные в предложениях и являются основой для построения многих конструкций в английском языке.</p>

<h3 class="mt-4">Основные личные местоимения</h3>
<div class="overflow-x-auto mt-2">
  <table class="w-full border-collapse">
    <thead>
      <tr class="bg-primary/10">
        <th class="border p-2 text-left">Английский</th>
        <th class="border p-2 text-left">Русский</th>
        <th class="border p-2 text-left">Пример</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border p-2"><strong>I</strong></td>
        <td class="border p-2">я</td>
        <td class="border p-2">I am a student. (Я студент.)</td>
      </tr>
      <tr>
        <td class="border p-2"><strong>You</strong></td>
        <td class="border p-2">ты/вы</td>
        <td class="border p-2">You are my friend. (Ты мой друг.)</td>
      </tr>
      <tr>
        <td class="border p-2"><strong>He</strong></td>
        <td class="border p-2">он</td>
        <td class="border p-2">He is a doctor. (Он доктор.)</td>
      </tr>
      <tr>
        <td class="border p-2"><strong>She</strong></td>
        <td class="border p-2">она</td>
        <td class="border p-2">She is a teacher. (Она учитель.)</td>
      </tr>
      <tr>
        <td class="border p-2"><strong>It</strong></td>
        <td class="border p-2">оно (про неодушевленные предметы)</td>
        <td class="border p-2">It is a book. (Это книга.)</td>
      </tr>
      <tr>
        <td class="border p-2"><strong>We</strong></td>
        <td class="border p-2">мы</td>
        <td class="border p-2">We are friends. (Мы друзья.)</td>
      </tr>
      <tr>
        <td class="border p-2"><strong>They</strong></td>
        <td class="border p-2">они</td>
        <td class="border p-2">They are students. (Они студенты.)</td>
      </tr>
    </tbody>
  </table>
</div>

<h3 class="mt-4">Особенности использования личных местоимений</h3>
<ul class="list-disc pl-5 space-y-2">
  <li>В английском языке местоимение <strong>I</strong> всегда пишется с большой буквы.</li>
  <li>Местоимение <strong>you</strong> может означать как "ты" (единственное число), так и "вы" (множественное число).</li>
  <li>Местоимение <strong>it</strong> используется для обозначения неодушевленных предметов и часто при описании погоды, времени, расстояний.</li>
</ul>

<h3 class="mt-4">Использование в предложениях</h3>
<p>Личные местоимения обычно ставятся в начале предложения, выступая в роли подлежащего:</p>
<div class="bg-primary/5 p-4 rounded mt-2">
  <p><strong>I</strong> speak English. (Я говорю по-английски.)</p>
  <p><strong>You</strong> work at the office. (Ты работаешь в офисе.)</p>
  <p><strong>He</strong> plays football. (Он играет в футбол.)</p>
  <p><strong>She</strong> reads books. (Она читает книги.)</p>
  <p><strong>It</strong> rains often in autumn. (Осенью часто идет дождь.)</p>
  <p><strong>We</strong> study together. (Мы учимся вместе.)</p>
  <p><strong>They</strong> live in London. (Они живут в Лондоне.)</p>
</div>', 
4),

((SELECT id FROM courses WHERE title = 'Английский для начинающих (A1)' LIMIT 1), 
'Глагол to be', 
'<h2>Глагол to be (быть)</h2>
<p>Глагол <strong>to be</strong> является одним из самых важных и часто используемых глаголов в английском языке. Он используется для обозначения состояния, профессии, возраста, национальности и многого другого.</p>

<h3 class="mt-4">Формы глагола to be в настоящем времени</h3>
<div class="overflow-x-auto mt-2">
  <table class="w-full border-collapse">
    <thead>
      <tr class="bg-primary/10">
        <th class="border p-2 text-left">Местоимение</th>
        <th class="border p-2 text-left">Форма глагола</th>
        <th class="border p-2 text-left">Пример</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border p-2">I</td>
        <td class="border p-2"><strong>am</strong></td>
        <td class="border p-2">I am a student. (Я студент.)</td>
      </tr>
      <tr>
        <td class="border p-2">You</td>
        <td class="border p-2"><strong>are</strong></td>
        <td class="border p-2">You are my friend. (Ты мой друг.)</td>
      </tr>
      <tr>
        <td class="border p-2">He</td>
        <td class="border p-2"><strong>is</strong></td>
        <td class="border p-2">He is a doctor. (Он доктор.)</td>
      </tr>
      <tr>
        <td class="border p-2">She</td>
        <td class="border p-2"><strong>is</strong></td>
        <td class="border p-2">She is a teacher. (Она учитель.)</td>
      </tr>
      <tr>
        <td class="border p-2">It</td>
        <td class="border p-2"><strong>is</strong></td>
        <td class="border p-2">It is a book. (Это книга.)</td>
      </tr>
      <tr>
        <td class="border p-2">We</td>
        <td class="border p-2"><strong>are</strong></td>
        <td class="border p-2">We are friends. (Мы друзья.)</td>
      </tr>
      <tr>
        <td class="border p-2">They</td>
        <td class="border p-2"><strong>are</strong></td>
        <td class="border p-2">They are students. (Они студенты.)</td>
      </tr>
    </tbody>
  </table>
</div>

<h3 class="mt-4">Сокращенные формы</h3>
<p>В разговорной речи и неформальном письме часто используются сокращенные формы глагола to be:</p>
<ul class="list-disc pl-5 space-y-1">
  <li>I am = I'm</li>
  <li>You are = You're</li>
  <li>He is = He's</li>
  <li>She is = She's</li>
  <li>It is = It's</li>
  <li>We are = We're</li>
  <li>They are = They're</li>
</ul>

<h3 class="mt-4">Отрицательные формы</h3>
<p>Для образования отрицательной формы после глагола to be добавляется частица "not":</p>
<ul class="list-disc pl-5 space-y-1">
  <li>I am not (I'm not)</li>
  <li>You are not (You aren't / You're not)</li>
  <li>He is not (He isn't / He's not)</li>
  <li>She is not (She isn't / She's not)</li>
  <li>It is not (It isn't / It's not)</li>
  <li>We are not (We aren't / We're not)</li>
  <li>They are not (They aren't / They're not)</li>
</ul>

<h3 class="mt-4">Вопросительные формы</h3>
<p>Для образования вопроса формы глагола to be ставятся перед подлежащим:</p>
<ul class="list-disc pl-5 space-y-1">
  <li>Am I...? - Я...?</li>
  <li>Are you...? - Ты...?</li>
  <li>Is he...? - Он...?</li>
  <li>Is she...? - Она...?</li>
  <li>Is it...? - Это...?</li>
  <li>Are we...? - Мы...?</li>
  <li>Are they...? - Они...?</li>
</ul>

<h3 class="mt-4">Примеры использования глагола to be</h3>
<div class="bg-primary/5 p-4 rounded mt-2">
  <p><strong>Утверждения:</strong></p>
  <p>I'm 25 years old. (Мне 25 лет.)</p>
  <p>She's from Spain. (Она из Испании.)</p>
  <p>They're at the cinema. (Они в кинотеатре.)</p>
  
  <p class="mt-2"><strong>Отрицания:</strong></p>
  <p>He isn't at home. (Его нет дома.)</p>
  <p>We aren't ready yet. (Мы еще не готовы.)</p>
  <p>I'm not hungry. (Я не голоден.)</p>
  
  <p class="mt-2"><strong>Вопросы:</strong></p>
  <p>Are you OK? (Ты в порядке?)</p>
  <p>Is she a doctor? (Она доктор?)</p>
  <p>Are they coming to the party? (Они придут на вечеринку?)</p>
</div>', 
5);

-- Добавление уроков для курса "Разговорный английский (A2-B1)"
INSERT INTO lessons (course_id, title, content, order_number) VALUES
((SELECT id FROM courses WHERE title = 'Разговорный английский (A2-B1)' LIMIT 1), 
'Повседневные разговоры', 
'<h2>Повседневные разговоры</h2>
<p>В этом уроке мы изучим фразы и выражения, которые помогут вам вести повседневные разговоры на английском языке.</p>

<h3 class="mt-4">Начало разговора</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>Excuse me...</strong> - Извините... (чтобы привлечь внимание)</li>
  <li><strong>Hi there!</strong> - Привет! (неформальное)</li>
  <li><strong>How's it going?</strong> - Как дела? (неформальное)</li>
  <li><strong>Nice weather today, isn't it?</strong> - Хорошая сегодня погода, не так ли? (разговор о погоде - традиционный способ начать беседу)</li>
  <li><strong>How have you been?</strong> - Как у тебя дела в последнее время?</li>
</ul>

<h3 class="mt-4">Поддержание разговора</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>Really? That's interesting!</strong> - Правда? Это интересно!</li>
  <li><strong>I see what you mean.</strong> - Я понимаю, о чем ты.</li>
  <li><strong>That reminds me...</strong> - Это напоминает мне...</li>
  <li><strong>By the way...</strong> - Кстати...</li>
  <li><strong>What do you think about...?</strong> - Что ты думаешь о...?</li>
</ul>

<h3 class="mt-4">Выражение мнения</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>I think that...</strong> - Я думаю, что...</li>
  <li><strong>In my opinion...</strong> - По моему мнению...</li>
  <li><strong>I believe...</strong> - Я считаю...</li>
  <li><strong>It seems to me that...</strong> - Мне кажется, что...</li>
  <li><strong>I agree / I don't agree.</strong> - Я согласен / Я не согласен.</li>
</ul>

<h3 class="mt-4">Завершение разговора</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>It was nice talking to you.</strong> - Было приятно поговорить с тобой.</li>
  <li><strong>I should be going now.</strong> - Мне пора идти.</li>
  <li><strong>I'll catch you later.</strong> - Увидимся позже. (неформальное)</li>
  <li><strong>Let's keep in touch.</strong> - Давай оставаться на связи.</li>
  <li><strong>Take care!</strong> - Береги себя!</li>
</ul>

<h3 class="mt-4">Пример диалога</h3>
<div class="bg-primary/5 p-4 rounded mt-2">
  <p><strong>A:</strong> Hi there! How's it going?</p>
  <p><strong>B:</strong> I'm doing well, thanks. How about you?</p>
  <p><strong>A:</strong> Not bad. The weather is nice today, isn't it?</p>
  <p><strong>B:</strong> Yes, it's perfect for a walk. Did you hear about the new café that opened downtown?</p>
  <p><strong>A:</strong> No, I didn't. What's it like?</p>
  <p><strong>B:</strong> It's really cozy and they serve amazing pastries. We should go there sometime.</p>
  <p><strong>A:</strong> That sounds great! I'm free this weekend if you want to check it out.</p>
  <p><strong>B:</strong> Perfect! Let's say Saturday around noon?</p>
  <p><strong>A:</strong> Works for me. Anyway, I should be going now. I have a meeting in 10 minutes.</p>
  <p><strong>B:</strong> No problem. It was nice talking to you. See you on Saturday!</p>
  <p><strong>A:</strong> Definitely. Take care!</p>
</div>

<h3 class="mt-4">Полезные советы</h3>
<ul class="list-disc pl-5 space-y-2">
  <li>Слушайте собеседника внимательно и показывайте интерес к разговору.</li>
  <li>Используйте короткие фразы подтверждения, такие как "I see", "Right", "Exactly", чтобы показать, что вы слушаете.</li>
  <li>Задавайте открытые вопросы (те, на которые нельзя ответить просто "да" или "нет").</li>
  <li>Будьте вежливы и уважайте мнение собеседника, даже если вы не согласны.</li>
  <li>Практикуйтесь в разговорах на английском языке как можно чаще.</li>
</ul>', 
1),

((SELECT id FROM courses WHERE title = 'Разговорный английский (A2-B1)' LIMIT 1), 
'В ресторане', 
'<h2>В ресторане</h2>
<p>В этом уроке мы изучим фразы и выражения, которые помогут вам общаться в ресторане на английском языке.</p>

<h3 class="mt-4">Бронирование столика</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>I'd like to make a reservation.</strong> - Я хотел бы забронировать столик.</li>
  <li><strong>A table for two, please.</strong> - Столик на двоих, пожалуйста.</li>
  <li><strong>Could we have a table for four at 7 pm?</strong> - Можно нам столик на четверых в 7 вечера?</li>
  <li><strong>Do you have a table by the window?</strong> - У вас есть столик у окна?</li>
  <li><strong>What name should I put the reservation under?</strong> - На какое имя записать бронь?</li>
</ul>

<h3 class="mt-4">Заказ</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>May I see the menu, please?</strong> - Можно мне меню, пожалуйста?</li>
  <li><strong>What's today's special?</strong> - Какое сегодня фирменное блюдо?</li>
  <li><strong>I'll have the...</strong> - Я буду...</li>
  <li><strong>How would you like your steak?</strong> - Как вы хотите свой стейк? (прожарку)</li>
  <li><strong>Rare / Medium / Well-done</strong> - С кровью / Средней прожарки / Хорошо прожаренный</li>
  <li><strong>Could I get that without onions?</strong> - Можно мне это без лука?</li>
  <li><strong>What would you recommend?</strong> - Что бы вы порекомендовали?</li>
</ul>

<h3 class="mt-4">Напитки</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>What would you like to drink?</strong> - Что бы вы хотели выпить?</li>
  <li><strong>Could we see the wine list?</strong> - Можно нам винную карту?</li>
  <li><strong>I'll have a glass of red wine.</strong> - Я буду бокал красного вина.</li>
  <li><strong>Still or sparkling water?</strong> - Негазированная или газированная вода?</li>
  <li><strong>Can I get a refill, please?</strong> - Можно мне еще, пожалуйста? (о напитках)</li>
</ul>

<h3 class="mt-4">Во время еды</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>Excuse me, could we get some more bread?</strong> - Извините, можно нам еще хлеба?</li>
  <li><strong>Could I have some salt/pepper, please?</strong> - Можно мне соль/перец, пожалуйста?</li>
  <li><strong>This is delicious!</strong> - Это восхитительно!</li>
  <li><strong>I need another fork/knife/spoon.</strong> - Мне нужна еще одна вилка/нож/ложка.</li>
  <li><strong>Is everything to your liking?</strong> - Вам всё нравится? (вопрос от официанта)</li>
</ul>

<h3 class="mt-4">Оплата счета</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>Could we have the bill/check, please?</strong> - Можно нам счет, пожалуйста?</li>
  <li><strong>We'd like to pay separately.</strong> - Мы хотели бы заплатить отдельно.</li>
  <li><strong>I'll pay for everyone.</strong> - Я заплачу за всех.</li>
  <li><strong>Do you accept credit cards?</strong> - Вы принимаете кредитные карты?</li>
  <li><strong>Is service included?</strong> - Обслуживание включено?</li>
  <li><strong>Keep the change.</strong> - Сдачи не надо.</li>
</ul>

<h3 class="mt-4">Пример диалога в ресторане</h3>
<div class="bg-primary/5 p-4 rounded mt-2">
  <p><strong>Host:</strong> Good evening. Do you have a reservation?</p>
  <p><strong>Customer:</strong> Yes, we have a reservation for two under the name Smith at 8:00.</p>
  <p><strong>Host:</strong> Let me check... Yes, here it is. Please follow me to your table.</p>
  <p><em>(После того, как они сели за столик)</em></p>
  <p><strong>Waiter:</strong> Good evening. Here are your menus. Would you like to hear about our specials today?</p>
  <p><strong>Customer:</strong> Yes, please.</p>
  <p><strong>Waiter:</strong> Today's special is grilled salmon with roasted vegetables and mashed potatoes.</p>
  <p><strong>Customer:</strong> That sounds good. I'll have that.</p>
  <p><strong>Waiter:</strong> Excellent choice. And for you, sir?</p>
  <p><strong>Customer 2:</strong> I'll have the steak, please.</p>
  <p><strong>Waiter:</strong> How would you like your steak?</p>
  <p><strong>Customer 2:</strong> Medium, please.</p>
  <p><strong>Waiter:</strong> And what would you like to drink?</p>
  <p><strong>Customer:</strong> A bottle of sparkling water and a glass of white wine for me.</p>
  <p><strong>Customer 2:</strong> I'll have a glass of red wine, please.</p>
  <p><strong>Waiter:</strong> Thank you. I'll be right back with your drinks.</p>
  <p><em>(После ужина)</em></p>
  <p><strong>Customer:</strong> Could we have the bill, please?</p>
  <p><strong>Waiter:</strong> Of course. How was everything?</p>
  <p><strong>Customer:</strong> Everything was delicious, thank you.</p>
  <p><strong>Waiter:</strong> Here's your bill. You can pay at the table or at the front desk.</p>
  <p><strong>Customer:</strong> We'll pay here. Do you accept credit cards?</p>
  <p><strong>Waiter:</strong> Yes, we do.</p>
  <p><strong>Customer:</strong> Great, thank you.</p>
</div>', 
2);

-- Добавление уроков для курса "Деловой английский (B1-B2)"
INSERT INTO lessons (course_id, title, content, order_number) VALUES
((SELECT id FROM courses WHERE title = 'Деловой английский (B1-B2)' LIMIT 1), 
'Деловая переписка', 
'<h2>Деловая переписка на английском языке</h2>
<p>Умение правильно составлять деловые письма на английском языке является важным навыком для профессионального общения. В этом уроке мы рассмотрим основные принципы и форматы деловой переписки.</p>

<h3 class="mt-4">Структура делового письма</h3>
<p>Типичное деловое письмо на английском языке имеет следующую структуру:</p>

<ol class="list-decimal pl-5 space-y-2">
  <li><strong>Sender's Address (Адрес отправителя)</strong> - ваш адрес и контактные данные в правом верхнем углу.</li>
  <li><strong>Date (Дата)</strong> - дата написания письма (обычно в формате Month Day, Year: April 15, 2025).</li>
  <li><strong>Recipient's Address (Адрес получателя)</strong> - адрес и контактные данные получателя.</li>
  <li><strong>Subject Line (Тема письма)</strong> - краткое описание содержания письма.</li>
  <li><strong>Salutation (Приветствие)</strong> - формальное обращение к получателю.</li>
  <li><strong>Body (Основная часть)</strong> - содержание письма, разделенное на абзацы.</li>
  <li><strong>Closing (Заключение)</strong> - формальное завершение письма.</li>
  <li><strong>Signature (Подпись)</strong> - ваше имя и должность.</li>
</ol>

<h3 class="mt-4">Формальные приветствия</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>Dear Mr. Smith,</strong> - если вы знаете фамилию мужчины.</li>
  <li><strong>Dear Ms. Johnson,</strong> - если вы знаете фамилию женщины (Ms. используется независимо от семейного положения).</li>
  <li><strong>Dear Sir/Madam,</strong> - если вы не знаете имя получателя.</li>
  <li><strong>Dear Sir or Madam,</strong> - формальное обращение, если вы не знаете имя получателя.</li>
  <li><strong>To Whom It May Concern,</strong> - очень формальное обращение, используется в официальных документах.</li>
  <li><strong>Dear HR Department,</strong> - обращение к отделу или группе людей.</li>
</ul>

<h3 class="mt-4">Формальные заключения</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>Yours sincerely,</strong> - используется, когда вы знаете имя получателя (британский вариант).</li>
  <li><strong>Sincerely,</strong> или <strong>Sincerely yours,</strong> - американский вариант.</li>
  <li><strong>Yours faithfully,</strong> - используется, когда вы не знаете имя получателя (британский вариант).</li>
  <li><strong>Respectfully yours,</strong> - очень формальное заключение.</li>
  <li><strong>Best regards,</strong> или <strong>Kind regards,</strong> - менее формальное заключение для деловых партнеров, с которыми у вас уже установлены отношения.</li>
</ul>

<h3 class="mt-4">Полезные фразы для деловой переписки</h3>

<p><strong>Начало письма:</strong></p>
<ul class="list-disc pl-5 space-y-1">
  <li>I am writing to inquire about... (Я пишу, чтобы узнать о...)</li>
  <li>I am writing in reference to... (Я пишу относительно...)</li>
  <li>I am writing in response to... (Я пишу в ответ на...)</li>
  <li>Thank you for your email regarding... (Спасибо за ваше письмо относительно...)</li>
  <li>Further to our telephone conversation... (В продолжение нашего телефонного разговора...)</li>
</ul>

<p class="mt-2"><strong>Основная часть письма:</strong></p>
<ul class="list-disc pl-5 space-y-1">
  <li>I would like to draw your attention to... (Я хотел бы обратить ваше внимание на...)</li>
  <li>With reference to... (Относительно...)</li>
  <li>I am pleased to inform you that... (Я рад сообщить вам, что...)</li>
  <li>I regret to inform you that... (К сожалению, должен сообщить вам, что...)</li>
  <li>We would be grateful if you could... (Мы были бы признательны, если бы вы могли...)</li>
  <li>Please find attached... (Во вложении вы найдете...)</li>
  <li>I would appreciate it if you could... (Я был бы признателен, если бы вы могли...)</li>
</ul>

<p class="mt-2"><strong>Заключение письма:</strong></p>
<ul class="list-disc pl-5 space-y-1">
  <li>I look forward to hearing from you. (С нетерпением жду вашего ответа.)</li>
  <li>Please do not hesitate to contact me if you require any further information. (Пожалуйста, не стесняйтесь обращаться ко мне, если вам потребуется дополнительная информация.)</li>
  <li>Thank you for your attention to this matter. (Спасибо за внимание к этому вопросу.)</li>
  <li>I would appreciate a response at your earliest convenience. (Я был бы признателен за ответ при первой возможности.)</li>
</ul>

<h3 class="mt-4">Пример делового письма</h3>
<div class="bg-primary/5 p-4 rounded mt-2 font-mono text-sm">
<pre>
123 Business Street
London, W1 8XX
United Kingdom

April 15, 2025

Mr. John Smith
Marketing Director
ABC Company
456 Corporate Avenue
New York, NY 10001
USA

Subject: Proposal for Marketing Collaboration

Dear Mr. Smith,

I am writing to propose a potential collaboration between our companies in the upcoming international trade fair in Frankfurt.

Our research indicates that both our companies target similar market segments, and a joint marketing effort could be beneficial for both parties. We believe that by sharing a booth and promotional materials, we could reduce costs by approximately 30% while increasing our visibility at the event.

I have attached a detailed proposal outlining the potential benefits and cost savings. I would be happy to discuss this further in a call or video meeting at your convenience.

I look forward to your response and hopefully to a successful collaboration.

Yours sincerely,

Jane Doe
Business Development Manager
XYZ Corporation
jane.doe@xyzcompany.com
+44 20 1234 5678
</pre>
</div>

<h3 class="mt-4">Советы по деловой переписке</h3>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>Будьте лаконичны</strong> - деловые письма должны быть краткими и по существу.</li>
  <li><strong>Используйте профессиональный тон</strong> - избегайте сленга, сокращений и эмоциональных выражений.</li>
  <li><strong>Проверяйте правописание и грамматику</strong> - ошибки могут создать негативное впечатление.</li>
  <li><strong>Используйте простой и понятный язык</strong> - избегайте слишком сложных конструкций.</li>
  <li><strong>Будьте вежливы и уважительны</strong> - даже если вы обсуждаете проблемы или жалобы.</li>
  <li><strong>Четко указывайте тему письма</strong> - это поможет получателю быстро понять цель вашего сообщения.</li>
  <li><strong>Всегда отвечайте на деловые письма</strong> - даже если просто подтверждаете получение.</li>
</ul>', 
1);

-- Добавление слов в словарь
INSERT INTO dictionary (word, translation, example) VALUES
('hello', 'привет', 'Hello, how are you?'),
('goodbye', 'до свидания', 'I said goodbye to my friends.'),
('apple', 'яблоко', 'I eat an apple every day.'),
('book', 'книга', 'I read a book before sleep.'),
('friend', 'друг', 'She is my best friend.');

-- Создание набора слов
INSERT INTO word_sets (title, description) VALUES
('Базовые слова', 'Набор самых необходимых слов для начинающих'),
('Еда', 'Слова, связанные с едой и питанием'),
('Приветствия', 'Слова и фразы для знакомства и общения');

-- Связывание слов с наборами
INSERT INTO word_set_items (word_set_id, word_id) VALUES
(1, 1), -- hello в наборе Базовые слова
(1, 2), -- goodbye в наборе Базовые слова
(1, 5), -- friend в наборе Базовые слова
(2, 3), -- apple в наборе Еда
(3, 1), -- hello в наборе Приветствия
(3, 2); -- goodbye в наборе Приветствия
