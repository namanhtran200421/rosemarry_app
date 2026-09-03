function requirePublicEnvironmentVariable(
  name: string,
  value: string | undefined,
): string {
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

export const environment = {
  apiUrl: requirePublicEnvironmentVariable(
    "EXPO_PUBLIC_API_URL",
    process.env.EXPO_PUBLIC_API_URL,
  ),
  auth0Domain: requirePublicEnvironmentVariable(
    "EXPO_PUBLIC_AUTH0_DOMAIN",
    process.env.EXPO_PUBLIC_AUTH0_DOMAIN,
  ),
  auth0ClientId: requirePublicEnvironmentVariable(
    "EXPO_PUBLIC_AUTH0_CLIENT_ID",
    process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID,
  ),
  auth0Audience: requirePublicEnvironmentVariable(
    "EXPO_PUBLIC_AUTH0_AUDIENCE",
    process.env.EXPO_PUBLIC_AUTH0_AUDIENCE,
  ),
  auth0PhoneConnection: requirePublicEnvironmentVariable(
    "EXPO_PUBLIC_AUTH0_PHONE_CONNECTION",
    process.env.EXPO_PUBLIC_AUTH0_PHONE_CONNECTION,
  ),
} as const;
