function requirePublicEnvironmentVariable(
  name: string,
  value: string | undefined,
): string {
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

type AuthMode = "auth0" | "mock";

function readAuthMode(value: string | undefined): AuthMode {
  if (!value || value === "auth0") {
    return "auth0";
  }

  if (value === "mock") {
    const isDevelopment =
      typeof __DEV__ !== "undefined"
        ? __DEV__
        : process.env.NODE_ENV !== "production";

    if (!isDevelopment) {
      throw new Error("Mock authentication cannot run in a production build");
    }

    return "mock";
  }

  throw new Error("EXPO_PUBLIC_AUTH_MODE must be either auth0 or mock");
}

const authMode = readAuthMode(process.env.EXPO_PUBLIC_AUTH_MODE);

function requireForAuth0(name: string, value: string | undefined): string {
  return authMode === "auth0"
    ? requirePublicEnvironmentVariable(name, value)
    : (value ?? "");
}

export const environment = {
  apiUrl: requireForAuth0(
    "EXPO_PUBLIC_API_URL",
    process.env.EXPO_PUBLIC_API_URL,
  ),
  auth0Domain: requireForAuth0(
    "EXPO_PUBLIC_AUTH0_DOMAIN",
    process.env.EXPO_PUBLIC_AUTH0_DOMAIN,
  ),
  auth0ClientId: requireForAuth0(
    "EXPO_PUBLIC_AUTH0_CLIENT_ID",
    process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID,
  ),
  auth0Audience: requireForAuth0(
    "EXPO_PUBLIC_AUTH0_AUDIENCE",
    process.env.EXPO_PUBLIC_AUTH0_AUDIENCE,
  ),
  authMode,
} as const;
