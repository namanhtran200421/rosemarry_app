export type EmailAuthMode = "login" | "create";

export interface EmailCredentialErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface EmailCredentialValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const MINIMUM_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Removes accidental outer spaces without changing the email address. */
export function normalizeEmail(email: string): string {
  return email.trim();
}

/**
 * Validates the native email login or account-creation fields.
 *
 * @param mode - Whether the user is logging in or creating an account.
 * @param values - Current email and password field values.
 * @returns Plain-language errors keyed by the field that needs attention.
 */
export function validateEmailCredentials(
  mode: EmailAuthMode,
  values: EmailCredentialValues,
): EmailCredentialErrors {
  const errors: EmailCredentialErrors = {};
  const email = normalizeEmail(values.email);

  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address, such as name@example.com.";
  }

  if (!values.password) {
    errors.password = "Enter your password.";
  } else if (
    mode === "create" &&
    values.password.length < MINIMUM_PASSWORD_LENGTH
  ) {
    errors.password = "Use at least 8 characters for your password.";
  }

  if (mode === "create") {
    if (!values.confirmPassword) {
      errors.confirmPassword = "Enter your password again.";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "The passwords do not match. Try again.";
    }
  }

  return errors;
}
