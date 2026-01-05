const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.on('connect', () => {
  console.log('🟢 Neon Postgres connected');
});

pool.on('error', (err) => {
  console.error('🔴 Neon DB error:', err);
  process.exit(1);
});

module.exports = pool;