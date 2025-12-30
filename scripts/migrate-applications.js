const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = process.env.POSTGRES_URL;

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    console.log('🚀 Creating applications table...');
    try {
        await client.connect();

        await client.query(`
            CREATE TABLE IF NOT EXISTS applications (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                full_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                portfolio_url TEXT,
                samples_url TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        console.log('✅ Applications table created successfully!');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await client.end();
    }
}

migrate();
