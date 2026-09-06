import { Pool } from "pg";

import { env } from "./env.js";

const pool = new Pool({
  connectionString: env.databaseUrl,

  // Neon uses a publicly trusted TLS certificate.
  ssl: {
    rejectUnauthorized: true,
  },

  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (error) => {
  console.error("Unexpected database pool error", {
    name: error.name,
    message: error.message,
  });
});

export default pool;