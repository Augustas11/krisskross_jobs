const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function init() {
    console.log('🚀 Initializing Supabase Storage...');

    // 1. Create the bucket
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('user-generations', {
        public: true, // Set to true so users can view their videos/images directly
    });

    if (bucketError) {
        if (bucketError.message.includes('already exists')) {
            console.log('✅ Bucket "user-generations" already exists.');
        } else {
            console.error('❌ Error creating bucket:', bucketError.message);
        }
    } else {
        console.log('✅ Bucket "user-generations" created successfully.');
    }

    console.log('\n--- NEXT STEP: SQL ---');
    console.log('Please run the following SQL in your Supabase SQL Editor to create the table:');
    console.log(`
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  prompt TEXT,
  status TEXT DEFAULT 'pending',
  byteplus_task_id TEXT,
  internal_url TEXT,
  external_url TEXT,
  ref_images JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT NOW()
);

CREATE INDEX idx_generations_task_id ON generations(byteplus_task_id);
  `);
}

init();
