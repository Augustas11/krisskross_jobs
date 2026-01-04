-- Fix Western Market Standard template with more realistic media
-- Replace unrealistic "T1" batch media with "Caucasian adult - Striped Casual Sneakers" batch

UPDATE templates
SET 
  preview_video_url = 'https://privatecdn.krisskross.ai/de12285f-451d-4529-9cf4-fd227229fcdb/ComfyUI_00001__de12285f-451d-4529-9cf4-fd227229fcdb.mp4',
  thumbnail_url = 'https://privatecdn.krisskross.ai/79ce1133-451f-4338-9169-33bbc25b4315/gwen_swap_00001__79ce1133-451f-4338-9169-33bbc25b4315.webp',
  config = jsonb_set(
    config,
    '{refImages}',
    '["https://privatecdn.krisskross.ai/79ce1133-451f-4338-9169-33bbc25b4315/gwen_swap_00001__79ce1133-451f-4338-9169-33bbc25b4315.webp", "https://privatecdn.krisskross.ai/c15125eb-6c9d-4c91-9036-707f6b4fa0c5/gwen_swap_00001__c15125eb-6c9d-4c91-9036-707f6b4fa0c5.webp"]'::jsonb
  )
WHERE name = 'Western Market Standard';

-- Verify the update
SELECT name, preview_video_url, thumbnail_url
FROM templates
WHERE name = 'Western Market Standard';
