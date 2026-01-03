-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES auth.users(id) NOT NULL,
  
  -- Template identity
  name text NOT NULL CHECK (length(name) <= 60),
  description text CHECK (length(description) <= 300),
  category text NOT NULL,
  tags text[],
  
  -- Pricing
  price_usd decimal(10,2) NOT NULL CHECK (price_usd >= 0.99 AND price_usd <= 49.99),
  
  -- Template configuration (JSON storage)
  config jsonb NOT NULL,
  
  -- Media assets
  preview_video_url text NOT NULL,
  thumbnail_url text NOT NULL,
  
  -- Status & metrics
  status text DEFAULT 'active' CHECK (status IN ('draft', 'active', 'inactive', 'removed')),
  purchase_count integer DEFAULT 0,
  total_revenue decimal(10,2) DEFAULT 0,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone,
  
  -- Validators
  CONSTRAINT valid_preview CHECK (preview_video_url ~ '^https://.+'),
  CONSTRAINT valid_thumbnail CHECK (thumbnail_url ~ '^https://.+')
);

-- Indexes for marketplace filtering and sorting
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_creator ON templates(creator_id);
CREATE INDEX IF NOT EXISTS idx_templates_status ON templates(status);
CREATE INDEX IF NOT EXISTS idx_templates_popularity ON templates(purchase_count DESC);
CREATE INDEX IF NOT EXISTS idx_templates_price ON templates(price_usd);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at DESC);


-- Create template_purchases table
CREATE TABLE IF NOT EXISTS template_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES templates(id) NOT NULL,
  buyer_id uuid REFERENCES auth.users(id) NOT NULL,
  
  -- Transaction details
  purchase_price decimal(10,2) NOT NULL,
  platform_fee decimal(10,2) NOT NULL,
  creator_earnings decimal(10,2) NOT NULL,
  
  -- Payment processing
  stripe_payment_intent_id text UNIQUE,
  stripe_transfer_id text,
  
  -- Status tracking
  payment_status text DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'completed', 'failed', 'refunded')
  ),
  payout_status text DEFAULT 'pending' CHECK (
    payout_status IN ('pending', 'held', 'paid', 'failed')
  ),
  
  created_at timestamp with time zone DEFAULT now(),
  
  -- Prevent duplicate purchases
  UNIQUE(template_id, buyer_id)
);

CREATE INDEX IF NOT EXISTS idx_purchases_template ON template_purchases(template_id);
CREATE INDEX IF NOT EXISTS idx_purchases_buyer ON template_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON template_purchases(payment_status);


-- Create creator_earnings table
CREATE TABLE IF NOT EXISTS creator_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  
  -- Balance tracking
  total_earned decimal(10,2) DEFAULT 0,
  total_withdrawn decimal(10,2) DEFAULT 0,
  pending_balance decimal(10,2) DEFAULT 0,
  available_balance decimal(10,2) DEFAULT 0,
  
  -- Stripe Connect
  stripe_account_id text UNIQUE,
  stripe_account_status text,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create payout_requests table
CREATE TABLE IF NOT EXISTS payout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES auth.users(id) NOT NULL,
  
  amount decimal(10,2) NOT NULL CHECK (amount >= 10.00),
  
  stripe_payout_id text UNIQUE,
  status text DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')
  ),
  
  failure_reason text,
  
  requested_at timestamp with time zone DEFAULT now(),
  processed_at timestamp with time zone
);

CREATE INDEX IF NOT EXISTS idx_payouts_creator ON payout_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payout_requests(status);


-- Enable Row Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Templates
-- active templates are visible to everyone
CREATE POLICY "Public templates readable"
ON templates FOR SELECT
USING (status = 'active');

-- creators can see all their own templates (including drafts)
CREATE POLICY "Creators see own templates"
ON templates FOR SELECT
USING (auth.uid() = creator_id);

-- only creator can insert their own templates
CREATE POLICY "Creators insert own templates"
ON templates FOR INSERT
WITH CHECK (auth.uid() = creator_id);

-- only creator can update their own templates
CREATE POLICY "Creators update own templates"
ON templates FOR UPDATE
USING (auth.uid() = creator_id);

-- Template Purchases
-- buyers can see their own purchases
CREATE POLICY "Users see own purchases"
ON template_purchases FOR SELECT
USING (auth.uid() = buyer_id);

-- service role can insert purchases (usually done via payment webhook/api)
-- Note: You might need to add a policy for authenticated users if initiating purchase from client, 
-- but usually purchase records are created by server-side logic after payment intent confirmation.
-- We'll allow read for creator too?
CREATE POLICY "Creators see sales of their templates"
ON template_purchases FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM templates 
    WHERE templates.id = template_purchases.template_id 
    AND templates.creator_id = auth.uid()
  )
);

-- Creator Earnings
-- creators see only their own earnings
CREATE POLICY "Creators see own earnings"
ON creator_earnings FOR SELECT
USING (auth.uid() = creator_id);

-- Payout Requests
-- creators see only their own requests
CREATE POLICY "Creators see own payout requests"
ON payout_requests FOR SELECT
USING (auth.uid() = creator_id);

-- creators can insert payout requests
CREATE POLICY "Creators request payouts"
ON payout_requests FOR INSERT
WITH CHECK (auth.uid() = creator_id);


-- Database Functions for Logic

-- Function to increment template stats
CREATE OR REPLACE FUNCTION increment_template_purchases(
  template_id_arg uuid,
  revenue_amount decimal
) RETURNS void AS $$
BEGIN
  UPDATE templates
  SET 
    purchase_count = purchase_count + 1,
    total_revenue = total_revenue + revenue_amount,
    updated_at = now()
  WHERE id = template_id_arg;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add earnings
CREATE OR REPLACE FUNCTION add_creator_earnings(
  creator_id_arg uuid,
  amount decimal
) RETURNS void AS $$
BEGIN
  INSERT INTO creator_earnings (creator_id, total_earned, available_balance)
  VALUES (creator_id_arg, amount, amount)
  ON CONFLICT (creator_id) DO UPDATE
  SET 
    total_earned = creator_earnings.total_earned + amount,
    available_balance = creator_earnings.available_balance + amount,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
