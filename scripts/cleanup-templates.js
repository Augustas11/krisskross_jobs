// Execute template cleanup SQL via Supabase client
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function cleanupTemplates() {
    console.log('🧹 Cleaning up templates...\n');

    // Step 1: Set all 6 new templates to featured
    console.log('Step 1: Setting all new templates to featured...');
    const { data: updated, error: updateError } = await supabase
        .from('templates')
        .update({ is_featured: true })
        .eq('creator_id', '6b3e600f-33d5-4e1b-9863-0ea8881f42af')
        .eq('status', 'active')
        .select();

    if (updateError) {
        console.error('❌ Error updating templates:', updateError);
        return;
    }

    console.log(`✅ Updated ${updated?.length || 0} templates to featured`);
    updated?.forEach(t => console.log(`   - ${t.name}`));

    // Step 2: Delete old marketplace dummy templates
    console.log('\nStep 2: Deleting old dummy templates...');
    const { data: deleted, error: deleteError } = await supabase
        .from('templates')
        .delete()
        .neq('creator_id', '6b3e600f-33d5-4e1b-9863-0ea8881f42af')
        .eq('status', 'active')
        .select();

    if (deleteError) {
        console.error('❌ Error deleting templates:', deleteError);
        return;
    }

    console.log(`✅ Deleted ${deleted?.length || 0} old templates`);
    deleted?.forEach(t => console.log(`   - ${t.name}`));

    // Step 3: Verify final state
    console.log('\nStep 3: Verifying final state...');
    const { data: remaining, error: verifyError } = await supabase
        .from('templates')
        .select('name, is_featured, category')
        .eq('status', 'active')
        .order('is_featured', { ascending: false });

    if (verifyError) {
        console.error('❌ Error verifying:', verifyError);
        return;
    }

    console.log(`\n📋 Final template count: ${remaining?.length || 0}`);
    console.log('\nActive templates:');
    remaining?.forEach((t, i) => {
        const badge = t.is_featured ? '⭐' : '  ';
        console.log(`${i + 1}. ${badge} ${t.name} (${t.category})`);
    });

    console.log('\n✅ Cleanup complete!');
}

cleanupTemplates()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('❌ Script failed:', err);
        process.exit(1);
    });
