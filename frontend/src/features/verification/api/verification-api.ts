import { environment } from "../../../shared/config/environment";
 
const VERIFICATION_REQUEST_TIMEOUT_MS = 10_000;
 
export type VerificationStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";
 
export interface VerificationState {
  ageVerified: boolean;
  status: VerificationStatus | null;
}
 
export interface VerificationSession {
  url: string;
  sessionId: string;
}
 
export class VerificationApiError extends Error {
  constructor(readonly status: number | null) {
    super("The verification request could not be completed.");
    this.name = "VerificationApiError";
  }
}
 
/**
 * Performs an authenticated request against the verification API.
 * Mirrors the timeout and error handling used by createApplicationSession, so
 * failures surface the same way regardless of which endpoint was called.
 */
async function request(
  path: string,
  accessToken: string,
  method: "GET" | "POST",
): Promise<unknown> {
  const abortController = new AbortController();
  const timeout = setTimeout(
    () => abortController.abort(),
    VERIFICATION_REQUEST_TIMEOUT_MS,
  );
 
  try {
    let response: Response;
 
    try {
      response = await fetch(`${environment.apiUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: abortController.signal,
      });
    } catch {
      throw new VerificationApiError(null);
    }
 
    if (!response.ok) {
      throw new VerificationApiError(response.status);
    }
 
    try {
      return await response.json();
    } catch {
      throw new VerificationApiError(response.status);
    }
  } finally {
    clearTimeout(timeout);
  }
}
 
/**
 * Starts a verification attempt and returns the hosted URL to open.
 *
 * The URL is single-use and scoped to one session, so it must be requested
 * fresh each time rather than cached.
 */
export async function startVerification(
  accessToken: string,
): Promise<VerificationSession> {
  const body = await request(
    "/api/v1/id-verification/start",
    accessToken,
    "POST",
  );
 
  if (!isVerificationSession(body)) {
    throw new VerificationApiError(null);
  }
 
  return body;
}
 
/**
 * Reads the caller's current verification state.
 *
 * Poll this after the user returns from the hosted flow — the result arrives
 * at the backend by webhook, which usually lands after the redirect.
 */
export async function fetchVerificationState(
  accessToken: string,
): Promise<VerificationState> {
  const body = await request(
    "/api/v1/id-verification/status",
    accessToken,
    "GET",
  );
 
  if (!isVerificationState(body)) {
    throw new VerificationApiError(null);
  }
 
  return body;
}
 
function isVerificationSession(value: unknown): value is VerificationSession {
  if (typeof value !== "object" || value === null) {
    return false;
  }
 
  const session = value as Record<string, unknown>;
 
  return (
    typeof session.url === "string" &&
    session.url.length > 0 &&
    typeof session.sessionId === "string" &&
    session.sessionId.length > 0
  );
}
 
function isVerificationStatus(value: unknown): value is VerificationStatus {
  return (
    value === "PENDING" ||
    value === "IN_REVIEW" ||
    value === "APPROVED" ||
    value === "REJECTED" ||
    value === "EXPIRED"
  );
}
 
function isVerificationState(value: unknown): value is VerificationState {
  if (typeof value !== "object" || value === null) {
    return false;
  }
 
  const state = value as Record<string, unknown>;
 
  return (
    typeof state.ageVerified === "boolean" &&
    (state.status === null || isVerificationStatus(state.status))
  );
}