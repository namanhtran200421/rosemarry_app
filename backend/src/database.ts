import pg from "pg"
import dotenv from "dotenv"

dotenv.config();

const {Pool} = pg;

// TODO: At the moment there is no real database, make one and update .env
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
