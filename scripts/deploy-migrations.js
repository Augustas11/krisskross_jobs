const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
    console.error('❌ Missing POSTGRES_URL in .env.local');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

const MIGRATIONS = [
    'supabase/migrations/20260103_init_marketplace.sql',
    'supabase/migrations/20260103_add_stats_rpc.sql',
    'supabase/migrations/20260217_dashboard_v2_schema.sql'
];

async function deploy() {
    console.log('🚀 Deploying marketplace migrations...');
    try {
        await client.connect();

        for (const file of MIGRATIONS) {
            const filePath = path.join(process.cwd(), file);
            if (!fs.existsSync(filePath)) {
                console.error(`❌ Migration file not found: ${file}`);
                continue;
            }

            console.log(`\n📄 Executing ${file}...`);
            const sql = fs.readFileSync(filePath, 'utf8');

            // Execute
            await client.query(sql);
            console.log(`✅ ${file} applied.`);
        }

        // reload schema cache
        console.log('\n🔄 Reloading PostgREST schema cache...');
        try {
            await client.query(`NOTIFY pgrst, 'reload config';`);
            console.log('✅ Schema cache reloaded.');
        } catch (e) {
            console.warn('⚠️ Could not reload schema cache (might require superuser):', e.message);
        }

        console.log('\n🎉 All migrations deployed successfully!');

    } catch (err) {
        console.error('❌ Deployment failed:', err);
    } finally {
        await client.end();
    }
}

deploy();
