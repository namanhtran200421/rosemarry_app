import { environment } from "./environment";

export const authConfig = {
  domain: environment.auth0Domain,
  clientId: environment.auth0ClientId,
  audience: environment.auth0Audience,
  phoneConnection: environment.auth0PhoneConnection,
  customScheme: "rosemarry",
} as const;
