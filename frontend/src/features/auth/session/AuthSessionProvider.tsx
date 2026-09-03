import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth0 } from "react-native-auth0";

import { authConfig } from "../../../shared/config/auth-config";
import {
  createApplicationSession,
  type ApplicationSession,
} from "../api/auth-api";
import type {
  AuthSessionStatus,
  LoginConnection,
} from "../types/auth.types";
import { getAuthenticationErrorMessage } from "../utils/auth-error-message";

interface AuthSessionContextValue {
  status: AuthSessionStatus;
  session: ApplicationSession | null;
  startupError: string | null;
  activeConnection: LoginConnection | null;
  login: (connection: LoginConnection) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: PropsWithChildren) {
  const {
    authorize,
    clearSession,
    getCredentials,
    isLoading: isAuth0Loading,
    user,
  } = useAuth0();
  const [status, setStatus] = useState<AuthSessionStatus>("initializing");
  const [session, setSession] = useState<ApplicationSession | null>(null);
  const [startupError, setStartupError] = useState<string | null>(null);
  const [activeConnection, setActiveConnection] =
    useState<LoginConnection | null>(null);
  const bootstrapStarted = useRef(false);
  const operationRunning = useRef(false);

  useEffect(() => {
    if (isAuth0Loading || bootstrapStarted.current) {
      return;
    }

    bootstrapStarted.current = true;
    let isCurrent = true;

    async function restoreApplicationSession(): Promise<void> {
      if (!user) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const credentials = await getCredentials();

        if (!credentials?.accessToken) {
          throw new Error("Auth0 credentials did not include an access token.");
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

    void restoreApplicationSession();

    return () => {
      isCurrent = false;
    };
  }, [getCredentials, isAuth0Loading, user]);

  const login = useCallback(
    async (connection: LoginConnection): Promise<void> => {
      if (operationRunning.current) {
        return;
      }

      operationRunning.current = true;
      setStatus("authenticating");
      setActiveConnection(connection);
      setStartupError(null);

      try {
        const credentials = await authorize(
          {
            audience: authConfig.audience,
            scope: "openid profile email phone offline_access",
            connection: getAuth0Connection(connection),
          },
          { customScheme: authConfig.customScheme },
        );

        if (!credentials.accessToken) {
          throw new Error("Auth0 did not return an access token.");
        }

        const nextSession = await createApplicationSession(
          credentials.accessToken,
        );

        setSession(nextSession);
        setStatus("authenticated");
      } catch (error) {
        setSession(null);
        setStatus("unauthenticated");
        throw error;
      } finally {
        setActiveConnection(null);
        operationRunning.current = false;
      }
    },
    [authorize],
  );

  const logout = useCallback(async (): Promise<void> => {
    if (operationRunning.current) {
      return;
    }

    operationRunning.current = true;
    setStatus("logging-out");

    try {
      // react-native-auth0 v5 expects native callback options as argument two.
      await clearSession({}, { customScheme: authConfig.customScheme });
      setSession(null);
      setStatus("unauthenticated");
    } catch (error) {
      setStatus("authenticated");
      throw error;
    } finally {
      operationRunning.current = false;
    }
  }, [clearSession]);

  return (
    <AuthSessionContext.Provider
      value={{
        status,
        session,
        startupError,
        activeConnection,
        login,
        logout,
      }}
    >
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSessionContextValue {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }

  return context;
}

function getAuth0Connection(connection: LoginConnection): string {
  switch (connection) {
    case "phone":
      return authConfig.phoneConnection;
    case "google":
      return "google-oauth2";
    case "apple":
      return "apple";
  }
}
