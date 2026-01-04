-- Cleanup: Feature all new templates and remove old dummy templates
-- Date: 2026-01-04

-- Step 1: Set all 6 new templates (from hello@krisskross.ai) to featured
UPDATE templates
SET is_featured = true
WHERE creator_id = '6b3e600f-33d5-4e1b-9863-0ea8881f42af'
  AND status = 'active';

-- Step 2: Delete old marketplace dummy templates (NOT from hello@krisskross.ai)
DELETE FROM templates
WHERE creator_id != '6b3e600f-33d5-4e1b-9863-0ea8881f42af'
  AND status = 'active';

-- Verification: Check that only our 6 templates remain
SELECT 
  name,
  is_featured,
  category,
  creator_id
FROM templates
WHERE status = 'active'
ORDER BY is_featured DESC, name;
