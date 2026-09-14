import { type PropsWithChildren, useCallback, useMemo, useState } from "react";

import type { ApplicationSession } from "../api/auth-api";
import type { AuthSessionStatus } from "../types/auth.types";
import {
  AuthSessionContextProvider,
  type AuthSessionContextValue,
} from "./AuthSessionContext";
import { markOnboardingCompleted } from "./auth-session-state";

const MOCK_SESSION: ApplicationSession = {
  userId: 1,
  role: "USER",
  onboardingCompleted: false,
};

/** Local-only auth adapter that preserves the complete phone and OTP UI flow. */
export function MockAuthSessionProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthSessionStatus>("unauthenticated");
  const [session, setSession] = useState<ApplicationSession | null>(null);

  const getAccessToken = useCallback(async (): Promise<string> => {
    return "mock-access-token";
  }, []);

  const requestSmsCode = useCallback(async (): Promise<void> => {
    setStatus("sending-code");
    await Promise.resolve();
    setStatus("unauthenticated");
  }, []);

  const verifySmsCode = useCallback(async (): Promise<void> => {
    setStatus("verifying-code");
    await Promise.resolve();
    setSession(MOCK_SESSION);
    setStatus("authenticated");
  }, []);

  /**
   * Completes either additional login method without contacting Auth0.
   * This keeps local UI development working when mock authentication is on.
   */
  const signInWithMockProvider = useCallback(async (): Promise<void> => {
    setStatus("signing-in");
    await Promise.resolve();
    setSession(MOCK_SESSION);
    setStatus("authenticated");
  }, []);

  const completeOnboarding = useCallback((): void => {
    setSession(markOnboardingCompleted);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setStatus("logging-out");
    await Promise.resolve();
    setSession(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      status,
      session,
      startupError: null,
      getAccessToken,
      requestSmsCode,
      verifySmsCode,
      signInWithGoogle: signInWithMockProvider,
      signInWithEmailPassword: signInWithMockProvider,
      createAccountWithEmailPassword: signInWithMockProvider,
      completeOnboarding,
      logout,
    }),
    [
      completeOnboarding,
      getAccessToken,
      logout,
      requestSmsCode,
      session,
      signInWithMockProvider,
      status,
      verifySmsCode,
    ],
  );

  return (
    <AuthSessionContextProvider value={value}>
      {children}
    </AuthSessionContextProvider>
  );
}
