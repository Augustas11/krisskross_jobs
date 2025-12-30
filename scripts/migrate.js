const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
    console.error('❌ Missing POSTGRES_URL in .env.local');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    console.log('🚀 Running database migrations...');
    try {
        await client.connect();

        // Create the uuid-ossp extension if it doesn't exist
        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS generations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        type TEXT NOT NULL,
        prompt TEXT,
        status TEXT DEFAULT 'pending',
        byteplus_task_id TEXT,
        internal_url TEXT,
        external_url TEXT,
        ref_images JSONB,
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
        await client.query(createTableQuery);

        const createIndexQuery = 'CREATE INDEX IF NOT EXISTS idx_generations_task_id ON generations(byteplus_task_id);';
        await client.query(createIndexQuery);

        console.log('✅ Database migrated successfully!');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await client.end();
    }
}

migrate();
