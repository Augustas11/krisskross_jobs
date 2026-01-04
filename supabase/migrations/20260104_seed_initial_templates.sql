-- KrissKross Jobs: Initial Templates Seed Data
-- Created: 2026-01-04
-- Purpose: Insert 6 data-driven templates based on user behavior analysis
-- Media Assets: Using real user-generated content from production batches

-- Add is_featured column if it doesn't exist
ALTER TABLE templates ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create index for featured templates
CREATE INDEX IF NOT EXISTS idx_templates_featured ON templates(is_featured) WHERE is_featured = true;

-- Create template_analytics table for tracking
CREATE TABLE IF NOT EXISTS template_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NULL,
  event_type TEXT CHECK (event_type IN ('view', 'click', 'use', 'signup')),
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_template_analytics_template ON template_analytics(template_id);
CREATE INDEX IF NOT EXISTS idx_template_analytics_event ON template_analytics(event_type);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_template_views(template_id_arg UUID)
RETURNS void AS $$
BEGIN
  UPDATE templates
  SET view_count = view_count + 1
  WHERE id = template_id_arg;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TEMPLATE 1: Vietnamese Fashion Essential (FEATURED/DEFAULT)
-- ============================================================================
-- Market Coverage: 60%
-- Use Case: TikTok Shop fashion sellers in Vietnam
-- Source Batch: "Vietnamese adult - Lace Floral Top"

INSERT INTO templates (
  id,
  creator_id,
  name,
  description,
  category,
  tags,
  price_usd,
  config,
  preview_video_url,
  thumbnail_url,
  status,
  is_featured,
  created_at,
  published_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'hello@krisskross.ai' LIMIT 1),
  'Vietnamese Fashion Essential',
  'Perfect for TikTok Shop sellers. Most popular template used by 60% of successful creators.',
  'Fashion',
  ARRAY['TikTok Shop', 'Vietnamese', 'Fashion', 'Popular'],
  4.99,
  jsonb_build_object(
    'prompt', 'A Vietnamese woman wearing elegant fashion clothing, gracefully dancing on an urban street during golden hour. Natural daylight creates warm, flattering tones. Professional fashion photography style with dynamic movement.',
    'mode', 'video',
    'refImages', ARRAY[
      'https://privatecdn.krisskross.ai/d260c615-721c-4097-b4ae-18ff82846432/gwen_swap_00001__d260c615-721c-4097-b4ae-18ff82846432.webp',
      'https://privatecdn.krisskross.ai/662ac305-be7c-4578-8d2d-515ecc0213f8/gwen_swap_00001__662ac305-be7c-4578-8d2d-515ecc0213f8.webp'
    ],
    'subjectConfig', jsonb_build_object(
      'race', 'vietnamese',
      'gender', 'woman',
      'age', 'adult',
      'build', 'plus_size'
    ),
    'sceneConfig', jsonb_build_object(
      'environment', 'urban_street',
      'lighting', 'golden_hour',
      'style', 'fashion_photography',
      'actions', ARRAY['dancing', 'walking', 'posing']
    )
  ),
  'https://privatecdn.krisskross.ai/987822bd-aada-4131-84e9-0c832e3ad963/ComfyUI_00001__987822bd-aada-4131-84e9-0c832e3ad963.mp4',
  'https://privatecdn.krisskross.ai/d260c615-721c-4097-b4ae-18ff82846432/gwen_swap_00001__d260c615-721c-4097-b4ae-18ff82846432.webp',
  'active',
  true, -- Featured template
  NOW(),
  NOW()
);

-- ============================================================================
-- TEMPLATE 2: Multi-Action Showcase
-- ============================================================================
-- Market Coverage: Universal
-- Use Case: Products needing dynamic presentation with multiple viewing angles
-- Source Batch: "Black adult - White Casual Outfit"

INSERT INTO templates (
  id,
  creator_id,
  name,
  description,
  category,
  tags,
  price_usd,
  config,
  preview_video_url,
  thumbnail_url,
  status,
  is_featured,
  created_at,
  published_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'hello@krisskross.ai' LIMIT 1),
  'Multi-Action Showcase',
  'Show your product from every angle with 6 different model actions. Great for versatile clothing.',
  'Fashion',
  ARRAY['Versatile', 'Dynamic', 'All Actions', 'Multi-Angle'],
  5.99,
  jsonb_build_object(
    'prompt', 'A fashionable woman showcasing clothing on an urban street with natural daylight. The model performs multiple dynamic actions: walking confidently, standing elegantly, sitting casually, striking poses, dancing playfully, and running energetically. Professional fashion photography style capturing the outfit from all angles.',
    'mode', 'video',
    'refImages', ARRAY[
      'https://privatecdn.krisskross.ai/bbaff4a7-8dc9-426e-ab09-2ea5311f1591/gwen_swap_00001__bbaff4a7-8dc9-426e-ab09-2ea5311f1591.webp',
      'https://privatecdn.krisskross.ai/f6337985-1402-4657-9421-d53a355084ce/gwen_swap_00001__f6337985-1402-4657-9421-d53a355084ce.webp'
    ],
    'subjectConfig', jsonb_build_object(
      'race', 'black',
      'gender', 'woman',
      'age', 'adult',
      'build', 'curvy'
    ),
    'sceneConfig', jsonb_build_object(
      'environment', 'urban_street',
      'lighting', 'natural_daylight',
      'style', 'fashion_photography',
      'actions', ARRAY['walking', 'standing', 'sitting', 'posing', 'dancing', 'running']
    )
  ),
  'https://privatecdn.krisskross.ai/068c60c1-933c-4942-af23-ea716d050f21/ComfyUI_00003__068c60c1-933c-4942-af23-ea716d050f21.mp4',
  'https://privatecdn.krisskross.ai/bbaff4a7-8dc9-426e-ab09-2ea5311f1591/gwen_swap_00001__bbaff4a7-8dc9-426e-ab09-2ea5311f1591.webp',
  'active',
  false,
  NOW(),
  NOW()
);

-- ============================================================================
-- TEMPLATE 3: Western Market Standard
-- ============================================================================
-- Market Coverage: 23%
-- Use Case: US/European market targeting
-- Source Batch: "T1"

INSERT INTO templates (
  id,
  creator_id,
  name,
  description,
  category,
  tags,
  price_usd,
  config,
  preview_video_url,
  thumbnail_url,
  status,
  is_featured,
  created_at,
  published_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'hello@krisskross.ai' LIMIT 1),
  'Western Market Standard',
  'Optimized for US and European audiences with proven fashion photography settings.',
  'Fashion',
  ARRAY['US Market', 'Europe', 'International', 'Western'],
  4.99,
  jsonb_build_object(
    'prompt', 'A Caucasian woman walking confidently down an urban street in natural daylight, wearing stylish fashion clothing. Clean, professional fashion photography style with bright, appealing tones perfect for Western markets.',
    'mode', 'video',
    'refImages', ARRAY[
      'https://privatecdn.krisskross.ai/b288683f-cbaf-48ea-91c6-c8d2c6134394/gwen_swap_00001__b288683f-cbaf-48ea-91c6-c8d2c6134394.webp',
      'https://privatecdn.krisskross.ai/fca4a11d-e184-41c2-a581-dd08adae19c6/gwen_swap_00001__fca4a11d-e184-41c2-a581-dd08adae19c6.webp'
    ],
    'subjectConfig', jsonb_build_object(
      'race', 'white',
      'gender', 'woman',
      'age', 'adult',
      'build', null
    ),
    'sceneConfig', jsonb_build_object(
      'environment', 'urban_street',
      'lighting', 'natural_daylight',
      'style', 'fashion_photography',
      'actions', ARRAY['walking', 'posing']
    )
  ),
  'https://privatecdn.krisskross.ai/e6d6375b-22e2-4f6f-b3f3-c79f125c253b/ComfyUI_00001__e6d6375b-22e2-4f6f-b3f3-c79f125c253b.mp4',
  'https://privatecdn.krisskross.ai/b288683f-cbaf-48ea-91c6-c8d2c6134394/gwen_swap_00001__b288683f-cbaf-48ea-91c6-c8d2c6134394.webp',
  'active',
  false,
  NOW(),
  NOW()
);

-- ============================================================================
-- TEMPLATE 4: Cafe Lifestyle
-- ============================================================================
-- Market Coverage: 8.6% (Niche)
-- Use Case: Casual, lifestyle-oriented products
-- Source Batch: "Winter Outfit" (cafe environment)

INSERT INTO templates (
  id,
  creator_id,
  name,
  description,
  category,
  tags,
  price_usd,
  config,
  preview_video_url,
  thumbnail_url,
  status,
  is_featured,
  created_at,
  published_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'hello@krisskross.ai' LIMIT 1),
  'Cafe Lifestyle',
  'Relaxed cafe setting perfect for casual wear and comfortable clothing lines.',
  'Lifestyle',
  ARRAY['Lifestyle', 'Casual', 'Cafe', 'Comfortable'],
  3.99,
  jsonb_build_object(
    'prompt', 'A young Vietnamese woman in a cozy cafe setting with natural daylight streaming through windows. She dances playfully in casual, comfortable clothing. Relaxed lifestyle photography style with warm, inviting atmosphere.',
    'mode', 'video',
    'refImages', ARRAY[
      'https://privatecdn.krisskross.ai/e66e23e8-04ea-4f7e-bea0-826b0a4ecc80/gwen_swap_00001__e66e23e8-04ea-4f7e-bea0-826b0a4ecc80.webp',
      'https://privatecdn.krisskross.ai/17634bf6-84f3-4d0f-afb0-f72b36c788e3/gwen_swap_00001__17634bf6-84f3-4d0f-afb0-f72b36c788e3.webp'
    ],
    'subjectConfig', jsonb_build_object(
      'race', 'vietnamese',
      'gender', 'woman',
      'age', 'young_adult',
      'build', 'slim'
    ),
    'sceneConfig', jsonb_build_object(
      'environment', 'cafe',
      'lighting', 'natural_daylight',
      'style', 'lifestyle',
      'actions', ARRAY['dancing', 'sitting', 'walking']
    )
  ),
  'https://privatecdn.krisskross.ai/81b7c1e7-ae8b-40e6-bd52-de7a48b97e6e/ComfyUI_00001__81b7c1e7-ae8b-40e6-bd52-de7a48b97e6e.mp4',
  'https://privatecdn.krisskross.ai/e66e23e8-04ea-4f7e-bea0-826b0a4ecc80/gwen_swap_00001__e66e23e8-04ea-4f7e-bea0-826b0a4ecc80.webp',
  'active',
  false,
  NOW(),
  NOW()
);

-- ============================================================================
-- TEMPLATE 5: Men's Fashion
-- ============================================================================
-- Market Coverage: 17% (Growth Opportunity)
-- Use Case: Men's clothing and accessories
-- Source Batch: "Vietnamese young adult - Black Graphic Tee"

INSERT INTO templates (
  id,
  creator_id,
  name,
  description,
  category,
  tags,
  price_usd,
  config,
  preview_video_url,
  thumbnail_url,
  status,
  is_featured,
  created_at,
  published_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'hello@krisskross.ai' LIMIT 1),
  'Men''s Fashion',
  'Tailored for men''s clothing brands. Athletic and stylish urban settings.',
  'Fashion',
  ARRAY['Men''s', 'Fashion', 'Urban', 'Athletic'],
  4.99,
  jsonb_build_object(
    'prompt', 'A young Vietnamese man with athletic build walking confidently on an urban street during golden hour. He wears fashionable men''s clothing, shot in professional fashion photography style with warm, flattering natural light.',
    'mode', 'video',
    'refImages', ARRAY[
      'https://privatecdn.krisskross.ai/2e633d90-db4f-4d1b-9f27-81e0d0750480/gwen_swap_00002__2e633d90-db4f-4d1b-9f27-81e0d0750480.webp'
    ],
    'subjectConfig', jsonb_build_object(
      'race', 'vietnamese',
      'gender', 'man',
      'age', 'young_adult',
      'build', 'athletic'
    ),
    'sceneConfig', jsonb_build_object(
      'environment', 'urban_street',
      'lighting', 'golden_hour',
      'style', 'fashion_photography',
      'actions', ARRAY['walking', 'standing', 'posing']
    )
  ),
  'https://privatecdn.krisskross.ai/da846b9e-6660-4dc9-bf28-4507969fe3ee/ComfyUI_00001__da846b9e-6660-4dc9-bf28-4507969fe3ee.mp4',
  'https://privatecdn.krisskross.ai/2e633d90-db4f-4d1b-9f27-81e0d0750480/gwen_swap_00002__2e633d90-db4f-4d1b-9f27-81e0d0750480.webp',
  'active',
  false,
  NOW(),
  NOW()
);

-- ============================================================================
-- TEMPLATE 6: Kids' Clothing
-- ============================================================================
-- Market Coverage: 8.6% (Niche)
-- Use Case: Children's fashion products
-- Source Batch: "Vietnamese child - Outfit set" (park environment)

INSERT INTO templates (
  id,
  creator_id,
  name,
  description,
  category,
  tags,
  price_usd,
  config,
  preview_video_url,
  thumbnail_url,
  status,
  is_featured,
  created_at,
  published_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'hello@krisskross.ai' LIMIT 1),
  'Kids'' Clothing',
  'Fun park settings perfect for children''s fashion. Captures playful energy.',
  'Kids',
  ARRAY['Kids', 'Children', 'Playful', 'Park'],
  3.99,
  jsonb_build_object(
    'prompt', 'A Vietnamese child (age 5-10) playing energetically in a park with natural daylight. The child runs, walks, and poses playfully while wearing children''s fashion clothing. Professional fashion photography style capturing youthful energy and joy.',
    'mode', 'video',
    'refImages', ARRAY[
      'https://privatecdn.krisskross.ai/908559e3-dc5d-4df3-ba12-f4bc3aa53f18/gwen_swap_00003__908559e3-dc5d-4df3-ba12-f4bc3aa53f18.webp',
      'https://privatecdn.krisskross.ai/0e616d58-8704-4992-b8f4-26f881317fda/gwen_swap_00007__0e616d58-8704-4992-b8f4-26f881317fda.webp'
    ],
    'subjectConfig', jsonb_build_object(
      'race', 'vietnamese',
      'gender', 'child',
      'age', 'child_5_10',
      'build', null
    ),
    'sceneConfig', jsonb_build_object(
      'environment', 'park',
      'lighting', 'natural_daylight',
      'style', 'fashion_photography',
      'actions', ARRAY['walking', 'standing', 'sitting', 'posing', 'running']
    )
  ),
  'https://privatecdn.krisskross.ai/27c25b44-0859-4974-9d5c-be3c63fc779b/ComfyUI_00003__27c25b44-0859-4974-9d5c-be3c63fc779b.mp4',
  'https://privatecdn.krisskross.ai/908559e3-dc5d-4df3-ba12-f4bc3aa53f18/gwen_swap_00003__908559e3-dc5d-4df3-ba12-f4bc3aa53f18.webp',
  'active',
  false,
  NOW(),
  NOW()
);

-- Verify insertion
SELECT 
  name,
  category,
  price_usd,
  is_featured,
  array_length(tags, 1) as tag_count,
  status
FROM templates
WHERE creator_id = (SELECT id FROM auth.users WHERE email = 'system@krisskross.ai' LIMIT 1)
ORDER BY is_featured DESC, created_at DESC;
