import type { ApplicationSession } from "../api/auth-api";

/** Marks onboarding complete without changing the authenticated user/session. */
export function markOnboardingCompleted(
  session: ApplicationSession | null,
): ApplicationSession | null {
  if (session === null || session.onboardingCompleted) {
    return session;
  }

  return { ...session, onboardingCompleted: true };
}
