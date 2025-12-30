const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verify() {
    console.log('🔍 Verifying Supabase setup...');

    // 1. Check Bucket
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
        console.error('❌ Error listing buckets:', bucketError.message);
    } else {
        const exists = buckets.find(b => b.name === 'user-generations');
        if (exists) {
            console.log('✅ Bucket "user-generations" exists.');
        } else {
            console.error('❌ Bucket "user-generations" NOT found. Please run scripts/init-supabase.js');
        }
    }

    // 2. Check Table
    const { data: tableData, error: tableError } = await supabase
        .from('generations')
        .select('id')
        .limit(1);

    if (tableError) {
        if (tableError.code === '42P01') {
            console.error('❌ Table "generations" does NOT exist. Please run the provided SQL in Supabase SQL Editor.');
        } else {
            console.error('❌ Database error:', tableError.message);
        }
    } else {
        console.log('✅ Table "generations" exists and is accessible.');
    }
}

verify();
