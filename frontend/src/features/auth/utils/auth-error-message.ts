import { ApplicationSessionError } from "../api/auth-api";
import { PASSWORD_REQUIREMENT_MESSAGE } from "./email-credentials";

type AuthenticationAction =
  | "create-account"
  | "send-code"
  | "verify-code"
  | "sign-in"
  | "logout"
  | "restore";

/**
 * Returns true when the user intentionally closes Auth0's login screen.
 * Closing a login screen is not a failure, so the UI should not show an error.
 *
 * @param error - Unknown value returned by the Auth0 SDK.
 * @returns Whether Auth0 identified the action as user cancellation.
 */
export function isAuthenticationCancellation(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const authError = error as Record<string, unknown>;

  return (
    authError.type === "USER_CANCELLED" || authError.code === "USER_CANCELLED"
  );
}

/** Marks the recoverable case where sign-up worked but automatic login did not. */
export class AccountCreatedSignInError extends Error {
  constructor() {
    super("The account was created, but sign-in did not complete.");
    this.name = "AccountCreatedSignInError";
  }
}

interface AccountCreationFieldError {
  field: "email" | "password";
  message: string;
}

/**
 * Converts known Auth0 sign-up failures into a correction beside the field.
 * Unknown provider details stay hidden and use the safe form-level message.
 *
 * @param error - Unknown value returned by the Auth0 SDK during sign-up.
 * @returns A safe field error when the provider failure is recognised.
 */
export function getAccountCreationFieldError(
  error: unknown,
): AccountCreationFieldError | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const authError = error as Record<string, unknown>;
  const providerDetails = [authError.code, authError.name, authError.message]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();

  if (
    providerDetails.includes("invalid_password") ||
    providerDetails.includes("passwordstrengtherror") ||
    providerDetails.includes("password is too weak")
  ) {
    return {
      field: "password",
      message: PASSWORD_REQUIREMENT_MESSAGE,
    };
  }

  if (
    providerDetails.includes("user_exists") ||
    providerDetails.includes("username_exists") ||
    providerDetails.includes("user already exists")
  ) {
    return {
      field: "email",
      message: "An account already uses this email. Switch to Log in.",
    };
  }

  return null;
}

/** Keeps provider and network details out of user-facing authentication errors. */
export function getAuthenticationErrorMessage(
  action: AuthenticationAction,
  error: unknown,
): string {
  switch (action) {
    case "create-account":
      if (error instanceof AccountCreatedSignInError) {
        return "Your account was created. Switch to Log in and try again.";
      }

      return "We couldn't create your account. Try logging in if you already have one.";
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
    case "sign-in":
      return "We couldn't sign you in. Try again or choose another method.";
    case "logout":
      return "We couldn't log you out. Check your connection and try again.";
    case "restore":
      return "Your session couldn't be restored. Sign in to continue.";
  }
}
