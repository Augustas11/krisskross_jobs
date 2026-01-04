// Script to create hello@krisskross.ai user via Supabase Admin API
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables!');
    console.error('Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createSystemUser() {
    console.log('Creating hello@krisskross.ai user...');

    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    const existing = existingUsers.users.find(u => u.email === 'hello@krisskross.ai');

    if (existing) {
        console.log('✅ User already exists!');
        console.log('   ID:', existing.id);
        console.log('   Email:', existing.email);
        console.log('   Created:', existing.created_at);
        return existing;
    }

    // Create new user
    const { data, error } = await supabase.auth.admin.createUser({
        email: 'hello@krisskross.ai',
        password: 'KrissKross2026!SystemUser', // Change this in production
        email_confirm: true,
        user_metadata: {
            role: 'system',
            name: 'KrissKross System',
            description: 'System user for default templates and content'
        }
    });

    if (error) {
        console.error('❌ Error creating user:', error);
        return null;
    }

    console.log('✅ User created successfully!');
    console.log('   ID:', data.user.id);
    console.log('   Email:', data.user.email);
    console.log('   ⚠️  Remember to change the password in production!');

    return data.user;
}

// Run the function
createSystemUser()
    .then(() => {
        console.log('\n✅ Script completed');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Script failed:', err);
        process.exit(1);
    });
