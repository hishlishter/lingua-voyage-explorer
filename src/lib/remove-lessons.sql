
-- SQL script to remove all lessons EXCEPT the specified ones
-- First, we need to identify which lessons to keep based on titles

-- Get IDs of lessons we want to keep
WITH lessons_to_keep AS (
  SELECT id FROM lessons 
  WHERE title LIKE 'Present Simple: Базовые правила%' 
     OR title LIKE 'Present Continuous: Действия в процессе%'
     OR title LIKE 'Past Simple: События в прошлом%'
     OR title LIKE 'Future Simple: Планы и предсказания%'
     OR title LIKE 'Present Perfect: Связь прошлого с настоящим%'
)

-- 1. Remove lesson progress entries for lessons NOT in our keep list
DELETE FROM lesson_progress
WHERE lesson_id NOT IN (SELECT id FROM lessons_to_keep);

-- 2. Remove lesson questions associated with tests for lessons NOT in our keep list
DELETE FROM lesson_questions
WHERE test_id IN (
  SELECT id FROM lesson_tests
  WHERE lesson_id NOT IN (SELECT id FROM lessons_to_keep)
);

-- 3. Remove lesson tests for lessons NOT in our keep list
DELETE FROM lesson_tests
WHERE lesson_id NOT IN (SELECT id FROM lessons_to_keep);

-- 4. Finally, remove the lessons NOT in our keep list
DELETE FROM lessons
WHERE id NOT IN (SELECT id FROM lessons_to_keep);

-- Optional: Reorder the remaining lessons to ensure continuity
-- This updates the order_index to maintain sequential ordering
WITH ordered_lessons AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY order_index) as new_order
  FROM lessons
)
UPDATE lessons
SET order_index = ol.new_order
FROM ordered_lessons ol
WHERE lessons.id = ol.id;

-- Add tests for the kept lessons if they don't already have tests
DO $$
DECLARE
  lesson_rec RECORD;
  test_exists BOOLEAN;
  new_test_id UUID;
BEGIN
  -- For each lesson we're keeping
  FOR lesson_rec IN 
    SELECT id, title FROM lessons 
    WHERE title LIKE 'Present Simple: Базовые правила%' 
       OR title LIKE 'Present Continuous: Действия в процессе%'
       OR title LIKE 'Past Simple: События в прошлом%'
       OR title LIKE 'Future Simple: Планы и предсказания%'
       OR title LIKE 'Present Perfect: Связь прошлого с настоящим%'
  LOOP
    -- Check if test already exists
    SELECT EXISTS(SELECT 1 FROM lesson_tests WHERE lesson_id = lesson_rec.id) INTO test_exists;
    
    -- If no test exists, create one
    IF NOT test_exists THEN
      -- Create a new test
      INSERT INTO lesson_tests (lesson_id, title, description) 
      VALUES (lesson_rec.id, 'Тест по теме: ' || lesson_rec.title, 'Проверьте свои знания по теме: ' || lesson_rec.title)
      RETURNING id INTO new_test_id;
      
      -- Add questions to the test (5 sample questions per test)
      
      -- Question 1
      WITH q1 AS (
        INSERT INTO lesson_questions (test_id, text, explanation)
        VALUES (new_test_id, 'Вопрос 1 по теме ' || lesson_rec.title, 'Объяснение к вопросу 1')
        RETURNING id
      )
      INSERT INTO lesson_question_options (question_id, text, is_correct)
      VALUES 
        ((SELECT id FROM q1), 'Ответ 1', TRUE),
        ((SELECT id FROM q1), 'Ответ 2', FALSE),
        ((SELECT id FROM q1), 'Ответ 3', FALSE),
        ((SELECT id FROM q1), 'Ответ 4', FALSE);
      
      -- Question 2
      WITH q2 AS (
        INSERT INTO lesson_questions (test_id, text, explanation)
        VALUES (new_test_id, 'Вопрос 2 по теме ' || lesson_rec.title, 'Объяснение к вопросу 2')
        RETURNING id
      )
      INSERT INTO lesson_question_options (question_id, text, is_correct)
      VALUES 
        ((SELECT id FROM q2), 'Ответ 1', FALSE),
        ((SELECT id FROM q2), 'Ответ 2', TRUE),
        ((SELECT id FROM q2), 'Ответ 3', FALSE),
        ((SELECT id FROM q2), 'Ответ 4', FALSE);
      
      -- Question 3
      WITH q3 AS (
        INSERT INTO lesson_questions (test_id, text, explanation)
        VALUES (new_test_id, 'Вопрос 3 по теме ' || lesson_rec.title, 'Объяснение к вопросу 3')
        RETURNING id
      )
      INSERT INTO lesson_question_options (question_id, text, is_correct)
      VALUES 
        ((SELECT id FROM q3), 'Ответ 1', FALSE),
        ((SELECT id FROM q3), 'Ответ 2', FALSE),
        ((SELECT id FROM q3), 'Ответ 3', TRUE),
        ((SELECT id FROM q3), 'Ответ 4', FALSE);
      
      -- Question 4
      WITH q4 AS (
        INSERT INTO lesson_questions (test_id, text, explanation)
        VALUES (new_test_id, 'Вопрос 4 по теме ' || lesson_rec.title, 'Объяснение к вопросу 4')
        RETURNING id
      )
      INSERT INTO lesson_question_options (question_id, text, is_correct)
      VALUES 
        ((SELECT id FROM q4), 'Ответ 1', FALSE),
        ((SELECT id FROM q4), 'Ответ 2', FALSE),
        ((SELECT id FROM q4), 'Ответ 3', FALSE),
        ((SELECT id FROM q4), 'Ответ 4', TRUE);
      
      -- Question 5
      WITH q5 AS (
        INSERT INTO lesson_questions (test_id, text, explanation)
        VALUES (new_test_id, 'Вопрос 5 по теме ' || lesson_rec.title, 'Объяснение к вопросу 5')
        RETURNING id
      )
      INSERT INTO lesson_question_options (question_id, text, is_correct)
      VALUES 
        ((SELECT id FROM q5), 'Ответ 1', TRUE),
        ((SELECT id FROM q5), 'Ответ 2', FALSE),
        ((SELECT id FROM q5), 'Ответ 3', FALSE),
        ((SELECT id FROM q5), 'Ответ 4', FALSE);
    END IF;
  END LOOP;
END $$;
