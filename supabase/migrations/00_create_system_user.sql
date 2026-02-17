-- Create hello@krisskross.ai user for template ownership
-- This user will own all initial/system templates

-- Note: Supabase auth.users requires signup through auth flow
-- This script provides the SQL structure, but user creation should be done via:
-- 1. Supabase Dashboard > Authentication > Users > Add User
-- 2. Or programmatically via Supabase Admin API

-- Manual creation instructions:
-- Email: hello@krisskross.ai
-- Password: [Set a secure password]
-- Email Confirmed: true

-- If running via Supabase Admin SDK:
/*
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const { data, error } = await supabase.auth.admin.createUser({
  email: 'hello@krisskross.ai',
  password: 'SECURE_PASSWORD_HERE',
  email_confirm: true,
  user_metadata: {
    role: 'system',
    name: 'KrissKross System'
  }
})
*/

-- Verify user exists before running seed:
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'hello@krisskross.ai';
