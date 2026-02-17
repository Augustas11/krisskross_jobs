-- =====================================================
-- CREATOR PROFILES (Linked to Clerk Auth)
-- =====================================================
CREATE TABLE IF NOT EXISTS creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL, -- Clerk user ID (e.g., "user_2abc123...")
  
  -- Basic Info (auto-populated from Clerk user object)
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  
  -- TikTok Connection (from Clerk's externalAccounts)
  tiktok_connected BOOLEAN DEFAULT false,
  tiktok_username TEXT,
  tiktok_display_name TEXT,
  tiktok_avatar_url TEXT,
  tiktok_external_account_id TEXT,
  
  -- TikTok Enrichment Data (fetched via Apify/TikTok API)
  tiktok_followers INTEGER DEFAULT 0,
  tiktok_verified BOOLEAN DEFAULT false,
  tiktok_bio TEXT,
  
  -- Calculated Creator Score (from analytics engine)
  creator_score INTEGER DEFAULT 0, -- 0-100
  avg_engagement_rate DECIMAL(5,2),
  avg_views_per_video INTEGER,
  total_videos_analyzed INTEGER DEFAULT 0,
  primary_content_type TEXT, -- e.g., 'fashion', 'lifestyle'
  primary_niche TEXT[],
  
  -- Platform Status
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'active', 'suspended'
  portfolio_links TEXT[],
  skills TEXT[],
  monthly_capacity INTEGER,
  turnaround_time TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_tiktok_sync_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(tiktok_username)
);

-- =====================================================
-- CREATOR VIDEO PORTFOLIO
-- =====================================================
CREATE TABLE IF NOT EXISTS creator_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
  
  -- TikTok Video Data
  tiktok_video_id TEXT UNIQUE,
  tiktok_url TEXT,
  thumbnail_url TEXT,
  embed_code TEXT, -- Added for embedded play back
  caption TEXT,
  hashtags TEXT[],
  duration_seconds INTEGER,
  posted_at TIMESTAMP WITH TIME ZONE,
  
  -- Performance Metrics (latest snapshot)
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  
  -- Content Analysis (from analytics engine / Claude)
  content_type TEXT,
  hook_type TEXT,
  hook_text TEXT,
  hook_effectiveness_score INTEGER, -- 1-10 (from Content Engine)
  visual_environment TEXT,
  visual_quality_score INTEGER, -- 1-10
  analysis_confidence_score DECIMAL(3, 2), -- 0.00-1.00
  
  -- Metadata
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  analyzed_at TIMESTAMP WITH TIME ZONE,
  analysis_version TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_creator_videos_creator ON creator_videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_videos_engagement ON creator_videos(engagement_rate DESC);
CREATE INDEX IF NOT EXISTS idx_creator_videos_content_type ON creator_videos(content_type);

-- =====================================================
-- TIKTOK METRICS HISTORY
-- =====================================================
CREATE TABLE IF NOT EXISTS creator_tiktok_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES creator_videos(id) ON DELETE CASCADE,
  
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  
  collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hours_since_posted INTEGER,
  
  UNIQUE(video_id, collected_at)
);

-- =====================================================
-- CREATOR INSIGHTS (Pattern Detection)
-- =====================================================
CREATE TABLE IF NOT EXISTS creator_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
  
  insight_text TEXT NOT NULL,
  category TEXT, -- 'hook', 'content_type', etc.
  confidence_score DECIMAL(3, 2),
  supporting_video_ids UUID[],
  
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_tiktok_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_insights ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view approved/active creators and their public data
CREATE POLICY "Public view active creators" ON creator_profiles
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public view active creator videos" ON creator_videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM creator_profiles 
      WHERE id = creator_videos.creator_id 
      AND status = 'active'
    )
  );

-- 2. Creators can view and update their own profile
-- Matches Clerk User ID from JWT claim 'sub'
CREATE POLICY "Creators view own profile" ON creator_profiles
  FOR SELECT USING (
    clerk_user_id = (select auth.jwt() ->> 'sub')
  );

CREATE POLICY "Creators update own profile" ON creator_profiles
  FOR UPDATE USING (
    clerk_user_id = (select auth.jwt() ->> 'sub')
  );

-- 3. Creators can view their own videos
CREATE POLICY "Creators view own videos" ON creator_videos
  FOR SELECT USING (
    creator_id IN (
      SELECT id FROM creator_profiles 
      WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
    )
  );

-- Service Role (Edge Functions) bypasses RLS automatically
