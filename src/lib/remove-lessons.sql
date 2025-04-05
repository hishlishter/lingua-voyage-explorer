
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
