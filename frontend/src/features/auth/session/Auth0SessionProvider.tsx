import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth0 } from "react-native-auth0";

import { authConfig } from "../../../shared/config/auth-config";
import {
  ApplicationSessionError,
  createApplicationSession,
  type ApplicationSession,
} from "../api/auth-api";
import type { AuthSessionStatus } from "../types/auth.types";
import { getAuthenticationErrorMessage } from "../utils/auth-error-message";
import {
  AuthSessionContextProvider,
  type AuthSessionContextValue,
} from "./AuthSessionContext";

const AUTH0_LOGIN_SCOPE = "openid profile email phone offline_access";
const AUTH_OPERATION_IN_PROGRESS =
  "An authentication operation is already in progress.";

/** Production Auth0-backed authentication and application-session lifecycle. */
export function Auth0SessionProvider({ children }: PropsWithChildren) {
  const {
    authorizeWithSMS,
    clearCredentials,
    getCredentials,
    isLoading: isAuth0Loading,
    sendSMSCode,
    user,
  } = useAuth0();
  const [status, setStatus] = useState<AuthSessionStatus>("initializing");
  const [session, setSession] = useState<ApplicationSession | null>(null);
  const [startupError, setStartupError] = useState<string | null>(null);
  const bootstrapStarted = useRef(false);
  const operationRunning = useRef(false);

  useEffect(() => {
    if (isAuth0Loading || bootstrapStarted.current) {
      return;
    }

    bootstrapStarted.current = true;
    let isCurrent = true;

    async function restoreSession(): Promise<void> {
      if (!user) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const credentials = await getCredentials();

        if (!credentials?.accessToken) {
          throw new ApplicationSessionError(null);
        }

        const restoredSession = await createApplicationSession(
          credentials.accessToken,
        );

        if (isCurrent) {
          setSession(restoredSession);
          setStatus("authenticated");
        }
      } catch (error) {
        if (isCurrent) {
          setStartupError(getAuthenticationErrorMessage("restore", error));
          setStatus("unauthenticated");
        }
      }
    }

    void restoreSession();

    return () => {
      isCurrent = false;
    };
  }, [getCredentials, isAuth0Loading, user]);

  const requestSmsCode = useCallback(
    async (phoneNumber: string): Promise<void> => {
      assertNoOperationInProgress(operationRunning);
      operationRunning.current = true;
      setStatus("sending-code");
      setStartupError(null);

      try {
        await sendSMSCode({ phoneNumber, send: "code" });
      } finally {
        setStatus("unauthenticated");
        operationRunning.current = false;
      }
    },
    [sendSMSCode],
  );

  const verifySmsCode = useCallback(
    async (phoneNumber: string, code: string): Promise<void> => {
      assertNoOperationInProgress(operationRunning);
      operationRunning.current = true;
      setStatus("verifying-code");
      setStartupError(null);
      let receivedCredentials = false;

      try {
        const credentials = await authorizeWithSMS({
          phoneNumber,
          code,
          audience: authConfig.audience,
          scope: AUTH0_LOGIN_SCOPE,
        });
        receivedCredentials = true;

        if (!credentials.accessToken) {
          throw new ApplicationSessionError(null);
        }

        const nextSession = await createApplicationSession(
          credentials.accessToken,
        );
        setSession(nextSession);
        setStatus("authenticated");
      } catch (error) {
        if (receivedCredentials) {
          await clearCredentials().catch(() => undefined);
        }

        setSession(null);
        setStatus("unauthenticated");
        throw error;
      } finally {
        operationRunning.current = false;
      }
    },
    [authorizeWithSMS, clearCredentials],
  );

  const logout = useCallback(async (): Promise<void> => {
    assertNoOperationInProgress(operationRunning);
    operationRunning.current = true;
    setStatus("logging-out");

    try {
      await clearCredentials();
      setSession(null);
      setStatus("unauthenticated");
    } catch (error) {
      setStatus("authenticated");
      throw error;
    } finally {
      operationRunning.current = false;
    }
  }, [clearCredentials]);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      status,
      session,
      startupError,
      requestSmsCode,
      verifySmsCode,
      logout,
    }),
    [logout, requestSmsCode, session, startupError, status, verifySmsCode],
  );

  return (
    <AuthSessionContextProvider value={value}>
      {children}
    </AuthSessionContextProvider>
  );
}

function assertNoOperationInProgress(operationRunning: {
  readonly current: boolean;
}): void {
  if (operationRunning.current) {
    throw new Error(AUTH_OPERATION_IN_PROGRESS);
  }
}
