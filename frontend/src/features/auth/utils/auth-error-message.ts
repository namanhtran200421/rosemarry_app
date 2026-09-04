import { ApplicationSessionError } from "../api/auth-api";

type AuthenticationAction = "send-code" | "verify-code" | "logout" | "restore";

/** Keeps provider and network details out of user-facing authentication errors. */
export function getAuthenticationErrorMessage(
  action: AuthenticationAction,
  error: unknown,
): string {
  switch (action) {
    case "send-code":
      return "We couldn't send a code. Check the number and try again.";
    case "verify-code":
      if (error instanceof ApplicationSessionError) {
        return (
          "Your number was verified, but we couldn't start your session. " +
          "Request a new code and try again."
        );
      }

      return "That code couldn't be verified. Check it and try again.";
    case "logout":
      return "We couldn't log you out. Check your connection and try again.";
    case "restore":
      return "Your session couldn't be restored. Sign in to continue.";
  }
}
