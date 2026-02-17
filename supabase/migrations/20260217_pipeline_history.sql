-- Pipeline History Schema (for future Supabase integration)
-- Apply with: supabase db push
-- Not auto-applied; included for reference when auth is wired up.

CREATE TABLE IF NOT EXISTS pipeline_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'complete', 'failed', 'cancelled')),
  -- Product
  product_image_url TEXT NOT NULL,
  product_thumbnail_url TEXT,
  product_file_name TEXT,
  product_uploaded_at TIMESTAMPTZ DEFAULT now(),
  -- Agent outputs (JSONB)
  agent_product_analysis JSONB DEFAULT '{}'::jsonb,
  agent_script_writer JSONB DEFAULT '{}'::jsonb,
  agent_video_director JSONB DEFAULT '{}'::jsonb,
  agent_caption_generator JSONB DEFAULT '{}'::jsonb,
  -- Metadata
  total_duration_ms INTEGER,
  api_cost_estimate NUMERIC(6,3),
  retry_count INTEGER DEFAULT 0,
  parent_run_id UUID REFERENCES pipeline_history(id),
  tags TEXT[] DEFAULT '{}',
  notes TEXT DEFAULT ''
);

-- Indexes
CREATE INDEX idx_pipeline_history_user ON pipeline_history(user_id);
CREATE INDEX idx_pipeline_history_status ON pipeline_history(status);
CREATE INDEX idx_pipeline_history_created ON pipeline_history(created_at DESC);

-- RLS
ALTER TABLE pipeline_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own history"
  ON pipeline_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
  ON pipeline_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own history"
  ON pipeline_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own history"
  ON pipeline_history FOR DELETE
  USING (auth.uid() = user_id);

-- Product analysis cache
CREATE TABLE IF NOT EXISTS product_analysis_cache (
  hash TEXT PRIMARY KEY,
  analysis JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  history_ids UUID[] DEFAULT '{}'
);

CREATE INDEX idx_cache_created ON product_analysis_cache(created_at);
