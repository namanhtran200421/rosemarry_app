import { createContext, type PropsWithChildren, useContext } from "react";

import type { ApplicationSession } from "../api/auth-api";
import type { AuthSessionStatus } from "../types/auth.types";

export interface AuthSessionContextValue {
  status: AuthSessionStatus;
  session: ApplicationSession | null;
  startupError: string | null;
  requestSmsCode: (phoneNumber: string) => Promise<void>;
  verifySmsCode: (phoneNumber: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

interface AuthSessionContextProviderProps extends PropsWithChildren {
  value: AuthSessionContextValue;
}

export function AuthSessionContextProvider({
  children,
  value,
}: AuthSessionContextProviderProps) {
  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSessionContextValue {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within an auth provider");
  }

  return context;
}
