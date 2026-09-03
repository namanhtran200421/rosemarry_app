type AuthenticationAction = "login" | "logout" | "restore";

export function getAuthenticationErrorMessage(
  action: AuthenticationAction,
  _error: unknown,
): string {
  switch (action) {
    case "login":
      return "We couldn't sign you in. Check your connection and try again.";
    case "logout":
      return "We couldn't log you out. Check your connection and try again.";
    case "restore":
      return "Your session couldn't be restored. Sign in to continue.";
  }
}
