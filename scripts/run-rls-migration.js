const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = process.env.POSTGRES_URL;

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function runMigration() {
    console.log('🚀 Running RLS security migration...\n');

    try {
        await client.connect();

        // Step 1: Enable RLS on all tables
        console.log('📌 Step 1: Enabling RLS on tables...');
        const tables = ['generations', 'creators', 'applications', 'template_analytics'];

        for (const table of tables) {
            try {
                await client.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`);
                console.log(`   ✅ RLS enabled on ${table}`);
            } catch (err) {
                console.log(`   ⚠️  ${table}: ${err.message}`);
            }
        }

        // Step 2: Create policies for generations
        console.log('\n📌 Step 2: Creating policies for generations...');
        const generationsPolicies = [
            {
                name: 'Users view own generations',
                sql: `CREATE POLICY "Users view own generations" ON generations FOR SELECT USING (auth.jwt() ->> 'email' = user_email OR auth.role() = 'service_role')`
            },
            {
                name: 'Users insert own generations',
                sql: `CREATE POLICY "Users insert own generations" ON generations FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = user_email OR auth.role() = 'service_role')`
            },
            {
                name: 'Users update own generations',
                sql: `CREATE POLICY "Users update own generations" ON generations FOR UPDATE USING (auth.jwt() ->> 'email' = user_email OR auth.role() = 'service_role')`
            },
            {
                name: 'Service role deletes generations',
                sql: `CREATE POLICY "Service role deletes generations" ON generations FOR DELETE USING (auth.role() = 'service_role')`
            }
        ];

        for (const policy of generationsPolicies) {
            try {
                await client.query(policy.sql);
                console.log(`   ✅ ${policy.name}`);
            } catch (err) {
                if (err.message.includes('already exists')) {
                    console.log(`   ⚠️  ${policy.name} (already exists)`);
                } else {
                    console.log(`   ❌ ${policy.name}: ${err.message}`);
                }
            }
        }

        // Step 3: Create policies for creators
        console.log('\n📌 Step 3: Creating policies for creators...');
        const creatorsPolicies = [
            {
                name: 'Users view own creator status',
                sql: `CREATE POLICY "Users view own creator status" ON creators FOR SELECT USING (auth.jwt() ->> 'email' = email OR auth.role() = 'service_role')`
            },
            {
                name: 'Service role manages creators',
                sql: `CREATE POLICY "Service role manages creators" ON creators FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role')`
            }
        ];

        for (const policy of creatorsPolicies) {
            try {
                await client.query(policy.sql);
                console.log(`   ✅ ${policy.name}`);
            } catch (err) {
                if (err.message.includes('already exists')) {
                    console.log(`   ⚠️  ${policy.name} (already exists)`);
                } else {
                    console.log(`   ❌ ${policy.name}: ${err.message}`);
                }
            }
        }

        // Step 4: Create policies for applications
        console.log('\n📌 Step 4: Creating policies for applications...');
        const applicationsPolicies = [
            {
                name: 'Users view own application',
                sql: `CREATE POLICY "Users view own application" ON applications FOR SELECT USING (auth.jwt() ->> 'email' = email OR auth.role() = 'service_role')`
            },
            {
                name: 'Users submit application',
                sql: `CREATE POLICY "Users submit application" ON applications FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = email OR auth.role() = 'service_role')`
            },
            {
                name: 'Users update own application',
                sql: `CREATE POLICY "Users update own application" ON applications FOR UPDATE USING (auth.jwt() ->> 'email' = email OR auth.role() = 'service_role')`
            },
            {
                name: 'Service role deletes applications',
                sql: `CREATE POLICY "Service role deletes applications" ON applications FOR DELETE USING (auth.role() = 'service_role')`
            }
        ];

        for (const policy of applicationsPolicies) {
            try {
                await client.query(policy.sql);
                console.log(`   ✅ ${policy.name}`);
            } catch (err) {
                if (err.message.includes('already exists')) {
                    console.log(`   ⚠️  ${policy.name} (already exists)`);
                } else {
                    console.log(`   ❌ ${policy.name}: ${err.message}`);
                }
            }
        }

        // Step 5: Create policies for template_analytics
        console.log('\n📌 Step 5: Creating policies for template_analytics...');
        const analyticsPolicies = [
            {
                name: 'Creators view own template analytics',
                sql: `CREATE POLICY "Creators view own template analytics" ON template_analytics FOR SELECT USING (EXISTS (SELECT 1 FROM templates WHERE templates.id = template_analytics.template_id AND templates.creator_id = auth.uid()) OR auth.role() = 'service_role')`
            },
            {
                name: 'Service role inserts analytics',
                sql: `CREATE POLICY "Service role inserts analytics" ON template_analytics FOR INSERT WITH CHECK (auth.role() = 'service_role')`
            },
            {
                name: 'Service role manages analytics',
                sql: `CREATE POLICY "Service role manages analytics" ON template_analytics FOR UPDATE USING (auth.role() = 'service_role')`
            },
            {
                name: 'Service role deletes analytics',
                sql: `CREATE POLICY "Service role deletes analytics" ON template_analytics FOR DELETE USING (auth.role() = 'service_role')`
            }
        ];

        for (const policy of analyticsPolicies) {
            try {
                await client.query(policy.sql);
                console.log(`   ✅ ${policy.name}`);
            } catch (err) {
                if (err.message.includes('already exists')) {
                    console.log(`   ⚠️  ${policy.name} (already exists)`);
                } else {
                    console.log(`   ❌ ${policy.name}: ${err.message}`);
                }
            }
        }

        // Verify RLS is enabled
        console.log('\n🔍 Verifying RLS status...');
        const verifyResult = await client.query(`
            SELECT 
                c.relname as table_name,
                c.relrowsecurity as rls_enabled
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 'public' 
            AND c.relname IN ('generations', 'creators', 'applications', 'template_analytics')
            ORDER BY c.relname;
        `);

        console.log('\n📊 Final RLS Status:');
        console.log('━'.repeat(45));
        let allEnabled = true;
        for (const row of verifyResult.rows) {
            const status = row.rls_enabled ? '✅ ENABLED' : '❌ DISABLED';
            if (!row.rls_enabled) allEnabled = false;
            console.log(`  ${row.table_name.padEnd(20)} ${status}`);
        }
        console.log('━'.repeat(45));

        if (allEnabled) {
            console.log('\n🎉 All security vulnerabilities fixed!');
        } else {
            console.log('\n⚠️  Some tables still have RLS disabled');
        }

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigration();
