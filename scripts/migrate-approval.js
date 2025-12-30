const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = process.env.POSTGRES_URL;

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    console.log('🚀 Running approval system migrations...');
    try {
        await client.connect();

        // 1. Add user_email to generations if it doesn't exist
        await client.query(`
            ALTER TABLE generations ADD COLUMN IF NOT EXISTS user_email TEXT;
        `);

        // 2. Create creators table
        await client.query(`
            CREATE TABLE IF NOT EXISTS creators (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email TEXT UNIQUE NOT NULL,
                status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
                approved_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        console.log('✅ Approval system migrated successfully!');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await client.end();
    }
}

migrate();
