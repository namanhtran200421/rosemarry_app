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
import {
  AccountCreatedSignInError,
  getAuthenticationErrorMessage,
} from "../utils/auth-error-message";
import {
  AuthSessionContextProvider,
  type AuthSessionContextValue,
} from "./AuthSessionContext";

const AUTH0_LOGIN_SCOPE = "openid profile email phone offline_access";
const AUTH0_TOKEN_SCOPE = "openid profile email offline_access";
const AUTH0_CUSTOM_SCHEME = "rosemarry";
const GOOGLE_CONNECTION = "google-oauth2";
const EMAIL_PASSWORD_CONNECTION = "Username-Password-Authentication";
const AUTH_OPERATION_IN_PROGRESS =
  "An authentication operation is already in progress.";

/** Production Auth0-backed authentication and application-session lifecycle. */
export function Auth0SessionProvider({ children }: PropsWithChildren) {
  const {
    authorize,
    authorizeWithSMS,
    clearCredentials,
    clearSession,
    createUser,
    getCredentials,
    isLoading: isAuth0Loading,
    loginWithPasswordRealm,
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

  /**
   * Finishes an Auth0 credential flow and creates the Rosemarry session.
   *
   * A successful Auth0 login returns an access token, which is exchanged for
   * the normal Rosemarry application session. Partial credentials are removed
   * if the backend session cannot be created.
   *
   * @param requestCredentials - Starts the selected Auth0 login method.
   * @returns A promise that completes after the application session is ready.
   */
  const finishCredentialSignIn = useCallback(
    async (
      requestCredentials: () => Promise<{ accessToken?: string }>,
    ): Promise<void> => {
      assertNoOperationInProgress(operationRunning);
      operationRunning.current = true;
      setStatus("signing-in");
      setStartupError(null);
      let receivedCredentials = false;

      try {
        const credentials = await requestCredentials();
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
        /*
         * Auth0 stores credentials after login. Remove them if the backend
         * session fails so the app never keeps a partial sign-in.
         */
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
    [clearCredentials],
  );

  /** Opens Auth0's configured Google login. */
  const signInWithGoogle = useCallback(async (): Promise<void> => {
    await finishCredentialSignIn(() =>
      authorize(
        {
          audience: authConfig.audience,
          scope: AUTH0_TOKEN_SCOPE,
          connection: GOOGLE_CONNECTION,
        },
        {
          // This must match the custom scheme in app.config.ts.
          customScheme: AUTH0_CUSTOM_SCHEME,
        },
      ),
    );
  }, [authorize, finishCredentialSignIn]);

  /** Signs in with the credentials entered in Rosemarry's native form. */
  const signInWithEmailPassword = useCallback(
    async (email: string, password: string): Promise<void> => {
      await finishCredentialSignIn(() =>
        loginWithPasswordRealm({
          username: email,
          password,
          realm: EMAIL_PASSWORD_CONNECTION,
          audience: authConfig.audience,
          scope: AUTH0_TOKEN_SCOPE,
        }),
      );
    },
    [finishCredentialSignIn, loginWithPasswordRealm],
  );

  /** Creates an Auth0 database user and signs the new account in. */
  const createAccountWithEmailPassword = useCallback(
    async (email: string, password: string): Promise<void> => {
      await finishCredentialSignIn(async () => {
        await createUser({
          email,
          password,
          connection: EMAIL_PASSWORD_CONNECTION,
        });

        try {
          return await loginWithPasswordRealm({
            username: email,
            password,
            realm: EMAIL_PASSWORD_CONNECTION,
            audience: authConfig.audience,
            scope: AUTH0_TOKEN_SCOPE,
          });
        } catch {
          throw new AccountCreatedSignInError();
        }
      });
    },
    [createUser, finishCredentialSignIn, loginWithPasswordRealm],
  );

  const logout = useCallback(async (): Promise<void> => {
    assertNoOperationInProgress(operationRunning);
    operationRunning.current = true;
    setStatus("logging-out");

    try {
      // Clear both the device credentials and Auth0's browser session.
      await clearSession(
        {},
        {
          customScheme: AUTH0_CUSTOM_SCHEME,
        },
      );
      setSession(null);
      setStatus("unauthenticated");
    } catch (error) {
      setStatus("authenticated");
      throw error;
    } finally {
      operationRunning.current = false;
    }
  }, [clearSession]);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      status,
      session,
      startupError,
      requestSmsCode,
      verifySmsCode,
      signInWithGoogle,
      signInWithEmailPassword,
      createAccountWithEmailPassword,
      logout,
    }),
    [
      createAccountWithEmailPassword,
      logout,
      requestSmsCode,
      session,
      signInWithEmailPassword,
      signInWithGoogle,
      startupError,
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

function assertNoOperationInProgress(operationRunning: {
  readonly current: boolean;
}): void {
  if (operationRunning.current) {
    throw new Error(AUTH_OPERATION_IN_PROGRESS);
  }
}
