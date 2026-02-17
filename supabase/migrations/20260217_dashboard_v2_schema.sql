-- Create creator_profiles table for dashboard v2
CREATE TABLE IF NOT EXISTS creator_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    full_name TEXT,
    email TEXT,
    tiktok_connected BOOLEAN DEFAULT FALSE,
    tiktok_username TEXT,
    tiktok_avatar_url TEXT,
    tiktok_followers INTEGER,
    tiktok_access_token TEXT,
    tiktok_refresh_token TEXT,
    tiktok_token_expires_at TIMESTAMPTZ,
    creator_score INTEGER DEFAULT 0,
    avg_engagement_rate DECIMAL DEFAULT 0,
    avg_views_per_video INTEGER DEFAULT 0,
    total_videos_analyzed INTEGER DEFAULT 0,
    onboarded BOOLEAN DEFAULT FALSE,
    onboarding_steps JSONB DEFAULT '{
      "tiktok_connected": false,
      "first_video_created": false,
      "portfolio_samples_added": false,
      "rates_set": false,
      "bio_completed": false
    }'::jsonb,
    hourly_rate_min DECIMAL,
    hourly_rate_max DECIMAL,
    availability TEXT DEFAULT 'available',
    creator_category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for dashboard performance
CREATE INDEX IF NOT EXISTS idx_creator_profiles_clerk_id ON creator_profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_onboarding ON creator_profiles(onboarded);

