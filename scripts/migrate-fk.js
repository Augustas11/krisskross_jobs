const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = process.env.POSTGRES_URL;

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    console.log('🚀 Adding foreign key for relationship...');
    try {
        await client.connect();

        await client.query(`
            ALTER TABLE generations 
            ADD CONSTRAINT generations_user_email_fkey 
            FOREIGN KEY (user_email) 
            REFERENCES creators(email)
            ON DELETE SET NULL;
        `);

        console.log('✅ Foreign key added successfully!');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await client.end();
    }
}

migrate();
