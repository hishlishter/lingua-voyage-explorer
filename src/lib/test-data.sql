
-- Add test data for tests
INSERT INTO tests (title, description, image, level) VALUES
('Грамматический тест', 'Проверьте свои знания английской грамматики', 'https://example.com/grammar.jpg', 'Средний'),
('Тест на знание слов', 'Расширьте свой словарный запас', 'https://example.com/vocabulary.jpg', 'Начальный'),
('Тест по идиомам', 'Проверьте знание английских идиом', 'https://example.com/idioms.jpg', 'Продвинутый'),
('Тест на аудирование', 'Проверьте свое понимание на слух', 'https://example.com/listening.jpg', 'Средний');

-- Add test data for questions
INSERT INTO questions (test_id, text) VALUES
(1, 'Which is correct?'),
(1, 'Select the correct tense for the sentence: "Yesterday I ____ to the store."'),
(1, 'Choose the correct article: "I saw ____ elephant at the zoo."'),
(1, 'What is the plural form of "child"?'),
(1, 'Which sentence uses the correct form of the verb?');

-- Add test data for options
INSERT INTO options (question_id, text, is_correct) VALUES
(1, 'She don''t like coffee', FALSE),
(1, 'She doesn''t like coffee', TRUE),
(1, 'She not like coffee', FALSE),
(2, 'go', FALSE),
(2, 'went', TRUE),
(2, 'going', FALSE),
(3, 'a', FALSE),
(3, 'an', TRUE),
(3, 'the', FALSE),
(4, 'childs', FALSE),
(4, 'childes', FALSE),
(4, 'children', TRUE),
(5, 'They was happy about the news', FALSE),
(5, 'They were happy about the news', TRUE),
(5, 'They be happy about the news', FALSE);

-- Add test data for dictionary
INSERT INTO dictionary (word, translation, example) VALUES
-- Idioms
('Break a leg', 'Ни пуха, ни пера', 'Break a leg at your performance tonight!'),
('Piece of cake', 'Проще простого', 'The exam was a piece of cake.'),
('Hit the books', 'Приступить к учебе', 'I need to hit the books before the test.'),
('Bite the bullet', 'Собраться с духом', 'Sometimes you just have to bite the bullet and do it.'),
('Under the weather', 'Неважно себя чувствовать', 'I''m feeling a bit under the weather today.'),

-- Locations
('London', 'Лондон', 'London is the capital of the UK.'),
('Paris', 'Париж', 'Paris is known as the city of love.'),
('Tokyo', 'Токио', 'Tokyo is the capital of Japan.'),
('New York', 'Нью-Йорк', 'New York is called the Big Apple.'),
('Moscow', 'Москва', 'Moscow is the capital of Russia.'),

-- Time expressions
('What time is it?', 'Который час?', 'What time is it? It''s 5 o''clock.'),
('Half past three', 'Половина четвертого', 'The meeting starts at half past three.'),
('Quarter to six', 'Без четверти шесть', 'I''ll meet you at quarter to six.'),
('Noon', 'Полдень', 'Let''s meet at noon for lunch.'),
('Midnight', 'Полночь', 'The party ended at midnight.');

-- Add word sets
INSERT INTO word_sets (title, description) VALUES
('Английские идиомы', 'Популярные английские идиомы и их значения'),
('Страны и города', 'Названия стран и городов на английском языке'),
('Который час?', 'Выражения для обозначения времени');

-- Link words to sets
INSERT INTO word_set_items (word_set_id, word_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 6), (2, 7), (2, 8), (2, 9), (2, 10),
(3, 11), (3, 12), (3, 13), (3, 14), (3, 15);

-- Add some test results for users to show in progress chart
INSERT INTO test_results (user_id, test_id, score, total_questions, completed_at)
SELECT 
  auth.uid(),
  test_id, 
  floor(random() * 10) + 1,  -- Random score between 1 and 10
  10, -- Total questions
  (current_date - (floor(random() * 300)::int || ' days')::interval)::timestamp -- Random date in the last 300 days
FROM 
  tests,
  (SELECT id FROM auth.users LIMIT 1) as u
WHERE 
  EXISTS (SELECT id FROM auth.users LIMIT 1)
LIMIT 20;
