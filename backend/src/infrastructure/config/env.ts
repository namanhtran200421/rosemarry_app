import "dotenv/config";

/**
 * Reads a required environment variable.
 *
 * @param name - Environment variable name.
 * @returns The trimmed environment value.
 * @throws Error when the variable is missing.
 */
function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readPort(): number {
  const value = Number(process.env.PORT ?? "3000");

  if (!Number.isInteger(value) || value < 1 || value > 65_535) {
    throw new Error("PORT must be a valid port number");
  }

  return value;
}

const issuerBaseUrl =
  required("AUTH0_ISSUER_BASE_URL").replace(/\/+$/, "") + "/";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: readPort(),
  databaseUrl: required("DATABASE_URL"),

  // Supports one or more comma-separated web origins.
  corsOrigins: required("CORS_ORIGIN")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  auth0: {
    issuerBaseUrl,
    audience: required("AUTH0_AUDIENCE"),
  },
} as const;