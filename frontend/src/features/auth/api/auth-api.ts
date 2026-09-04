import { environment } from "../../../shared/config/environment";

const SESSION_REQUEST_TIMEOUT_MS = 10_000;

export interface ApplicationSession {
  userId: number;
  role: "USER" | "STAFF";
  profileExists: boolean;
}

export class ApplicationSessionError extends Error {
  constructor(readonly status: number | null) {
    super("The application session could not be created.");
    this.name = "ApplicationSessionError";
  }
}

/**
 * Exchanges an Auth0 access token for Rosemarry's application-level session.
 * The response is checked at runtime because network data cannot be trusted from
 * its TypeScript type alone.
 */
export async function createApplicationSession(
  accessToken: string,
): Promise<ApplicationSession> {
  const abortController = new AbortController();
  const timeout = setTimeout(
    () => abortController.abort(),
    SESSION_REQUEST_TIMEOUT_MS,
  );

  try {
    let response: Response;

    try {
      response = await fetch(`${environment.apiUrl}/api/v1/auth/session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: abortController.signal,
      });
    } catch {
      throw new ApplicationSessionError(null);
    }

    if (!response.ok) {
      throw new ApplicationSessionError(response.status);
    }

    let responseBody: unknown;

    try {
      responseBody = await response.json();
    } catch {
      throw new ApplicationSessionError(response.status);
    }

    if (!isApplicationSession(responseBody)) {
      throw new ApplicationSessionError(response.status);
    }

    return responseBody;
  } finally {
    clearTimeout(timeout);
  }
}

function isApplicationSession(value: unknown): value is ApplicationSession {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const session = value as Record<string, unknown>;
  const userId = session.userId;

  return (
    typeof userId === "number" &&
    Number.isSafeInteger(userId) &&
    userId > 0 &&
    (session.role === "USER" || session.role === "STAFF") &&
    typeof session.profileExists === "boolean"
  );
}
