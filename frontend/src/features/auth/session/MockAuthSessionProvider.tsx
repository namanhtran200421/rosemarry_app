import { type PropsWithChildren, useCallback, useMemo, useState } from "react";

import type { ApplicationSession } from "../api/auth-api";
import type { AuthSessionStatus } from "../types/auth.types";
import {
  AuthSessionContextProvider,
  type AuthSessionContextValue,
} from "./AuthSessionContext";

const MOCK_SESSION: ApplicationSession = {
  userId: 1,
  role: "USER",
  profileExists: false,
};

/** Local-only auth adapter that preserves the complete phone and OTP UI flow. */
export function MockAuthSessionProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthSessionStatus>("unauthenticated");
  const [session, setSession] = useState<ApplicationSession | null>(null);

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
      requestSmsCode,
      verifySmsCode,
      signInWithGoogle: signInWithMockProvider,
      signInWithEmailPassword: signInWithMockProvider,
      createAccountWithEmailPassword: signInWithMockProvider,
      logout,
    }),
    [
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
