import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import type { DB } from "./db.js";
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

// --camel-case on kysely-codegen and CamelCasePlugin here are two halves of one
// decision. The generated types promise camelCase keys; the plugin makes the
// driver deliver them. Change one without the other and rows silently stop
// matching their types.
export const db = new Kysely<DB>({
  dialect: new PostgresDialect({ pool }),
  plugins: [new CamelCasePlugin()],
});

export default pool;