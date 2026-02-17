-- Enable Row Level Security for public tables
-- Created: 2026-01-07
-- Purpose: Fix security vulnerabilities - RLS disabled on public tables
-- Affected tables: generations, creators, applications, template_analytics

-- =============================================================================
-- 1. GENERATIONS TABLE
-- =============================================================================
-- Contains user-generated content (videos/images)
-- Access: Users can view their own generations, service role can manage all

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Users can view their own generations (by email)
CREATE POLICY "Users view own generations"
ON generations FOR SELECT
USING (
  auth.jwt() ->> 'email' = user_email
  OR auth.role() = 'service_role'
);

-- Users can insert their own generations
CREATE POLICY "Users insert own generations"
ON generations FOR INSERT
WITH CHECK (
  auth.jwt() ->> 'email' = user_email
  OR auth.role() = 'service_role'
);

-- Users can update their own generations
CREATE POLICY "Users update own generations"
ON generations FOR UPDATE
USING (
  auth.jwt() ->> 'email' = user_email
  OR auth.role() = 'service_role'
);

-- Only service role can delete generations
CREATE POLICY "Service role deletes generations"
ON generations FOR DELETE
USING (auth.role() = 'service_role');


-- =============================================================================
-- 2. CREATORS TABLE
-- =============================================================================
-- Contains creator approval status
-- Access: Users can check their own approval status, admins can manage

ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

-- Users can view their own creator status
CREATE POLICY "Users view own creator status"
ON creators FOR SELECT
USING (
  auth.jwt() ->> 'email' = email
  OR auth.role() = 'service_role'
);

-- Only service role can manage creators
CREATE POLICY "Service role manages creators"
ON creators FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- =============================================================================
-- 3. APPLICATIONS TABLE  
-- =============================================================================
-- Contains creator applications (sensitive personal data)
-- Access: Users can view/submit their own application, admins can manage

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own application
CREATE POLICY "Users view own application"
ON applications FOR SELECT
USING (
  auth.jwt() ->> 'email' = email
  OR auth.role() = 'service_role'
);

-- Users can submit their own application
CREATE POLICY "Users submit application"
ON applications FOR INSERT
WITH CHECK (
  auth.jwt() ->> 'email' = email
  OR auth.role() = 'service_role'
);

-- Users can update their own application
CREATE POLICY "Users update own application"
ON applications FOR UPDATE
USING (
  auth.jwt() ->> 'email' = email
  OR auth.role() = 'service_role'
);

-- Only service role can delete applications
CREATE POLICY "Service role deletes applications"
ON applications FOR DELETE
USING (auth.role() = 'service_role');


-- =============================================================================
-- 4. TEMPLATE_ANALYTICS TABLE
-- =============================================================================
-- Contains analytics with session_id (sensitive data flagged by linter)
-- Access: Template creators can view analytics for their templates, 
--         service role manages all

ALTER TABLE template_analytics ENABLE ROW LEVEL SECURITY;

-- Creators can view analytics for their own templates
CREATE POLICY "Creators view own template analytics"
ON template_analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM templates 
    WHERE templates.id = template_analytics.template_id 
    AND templates.creator_id = auth.uid()
  )
  OR auth.role() = 'service_role'
);

-- Only service role can insert analytics (typically via server-side tracking)
CREATE POLICY "Service role inserts analytics"
ON template_analytics FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Only service role can update/delete analytics
CREATE POLICY "Service role manages analytics"
ON template_analytics FOR UPDATE
USING (auth.role() = 'service_role');

CREATE POLICY "Service role deletes analytics"
ON template_analytics FOR DELETE
USING (auth.role() = 'service_role');


-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- Check that RLS is enabled on all tables

DO $$
DECLARE
  tbl TEXT;
  rls_enabled BOOLEAN;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['generations', 'creators', 'applications', 'template_analytics'])
  LOOP
    SELECT relrowsecurity INTO rls_enabled
    FROM pg_class
    WHERE relname = tbl AND relnamespace = 'public'::regnamespace;
    
    IF NOT rls_enabled THEN
      RAISE EXCEPTION 'RLS not enabled on table: %', tbl;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'RLS verification passed for all tables';
END $$;
