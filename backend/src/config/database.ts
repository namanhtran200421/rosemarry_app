import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true},
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

export default pool;