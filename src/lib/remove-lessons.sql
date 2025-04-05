
-- SQL script to remove specified lessons
-- First, we need to remove any associated data (tests, questions, progress) to avoid foreign key constraint violations

-- 1. Remove lesson progress entries
DELETE FROM lesson_progress
WHERE lesson_id IN (3, 6, 7, 9, 10);

-- 2. Remove lesson questions associated with tests for these lessons
DELETE FROM lesson_questions
WHERE test_id IN (
  SELECT id FROM lesson_tests
  WHERE lesson_id IN (3, 6, 7, 9, 10)
);

-- 3. Remove lesson tests
DELETE FROM lesson_tests
WHERE lesson_id IN (3, 6, 7, 9, 10);

-- 4. Finally, remove the lessons
DELETE FROM lessons
WHERE id IN (3, 6, 7, 9, 10);

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
