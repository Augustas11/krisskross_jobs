const { execSync } = require('child_process');

console.log('🚀 Setting up Vercel + Supabase Integration...');

try {
    // Check if vercel is installed
    execSync('vercel --version', { stdio: 'ignore' });
} catch (e) {
    console.log('❌ Vercel CLI not found. Please install it with: npm install -g vercel');
    process.exit(1);
}

const vars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('\n--- Steps ---');
console.log('1. Go to https://vercel.com/integrations/supabase');
console.log('2. Click "Add Integration" and select your "krisskross_jobs" project.');
console.log('3. This will automatically add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
console.log('\n--- IMPORTANT ---');
console.log('The "Service Role Key" is needed for storage sync but is NOT added automatically by the integration.');
console.log('Please run the following command to add it securely:');
console.log('vercel env add SUPABASE_SERVICE_ROLE_KEY');
