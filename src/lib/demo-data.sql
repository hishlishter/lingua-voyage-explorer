
-- Демонстрационные данные для тестирования

-- Добавление тестов
INSERT INTO tests (title, description, image, level) VALUES
('Начальный тест по английскому', 'Тест для проверки базовых знаний английского языка', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', 'Начальный'),
('Грамматика: Present Simple', 'Проверка знаний времени Present Simple', 'https://images.unsplash.com/photo-1517842645767-c639042777db', 'Средний'),
('Фразовые глаголы', 'Тест на знание распространенных фразовых глаголов', 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17', 'Продвинутый');

-- Добавление вопросов для теста 1
INSERT INTO questions (test_id, text) VALUES
(1, 'What ___ your name?'),
(1, 'She ___ from Russia.'),
(1, 'I ___ coffee every morning.');

-- Добавление вариантов ответов для вопросов теста 1
INSERT INTO options (question_id, text, is_correct) VALUES
(1, 'are', false),
(1, 'is', true),
(1, 'am', false),
(1, 'be', false),
(2, 'are', false),
(2, 'is', true),
(2, 'am', false),
(2, 'be', false),
(3, 'drink', true),
(3, 'drinks', false),
(3, 'drinking', false),
(3, 'am drink', false);

-- Добавление вопросов для теста 2
INSERT INTO questions (test_id, text) VALUES
(2, 'He ___ to the gym three times a week.'),
(2, 'They ___ in the same office.'),
(2, '___ she study English?');

-- Добавление вариантов ответов для вопросов теста 2
INSERT INTO options (question_id, text, is_correct) VALUES
(4, 'go', false),
(4, 'goes', true),
(4, 'going', false),
(4, 'is going', false),
(5, 'work', true),
(5, 'works', false),
(5, 'are work', false),
(5, 'are working', false),
(6, 'Do', true),
(6, 'Does', false),
(6, 'Is', false),
(6, 'Are', false);

-- Добавление курсов
INSERT INTO courses (title, description, image, level, lessons_count) VALUES
('Английский для начинающих', 'Базовый курс английского языка для начинающих с нуля', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b', 'Начальный', 10),
('Разговорный английский', 'Курс для улучшения разговорных навыков', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', 'Средний', 8),
('Деловой английский', 'Курс для изучения делового английского языка', 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca', 'Продвинутый', 12);

-- Добавление уроков для курса 1
INSERT INTO lessons (course_id, title, content, order_number) VALUES
(1, 'Знакомство с алфавитом', 'Содержание урока по алфавиту...', 1),
(1, 'Приветствия и знакомство', 'Содержание урока по приветствиям...', 2),
(1, 'Числа от 1 до 100', 'Содержание урока по числам...', 3);

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
