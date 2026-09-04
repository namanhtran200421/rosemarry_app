import type { PropsWithChildren } from "react";
import { Auth0Provider } from "react-native-auth0";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Auth0SessionProvider } from "../../features/auth/session/Auth0SessionProvider";
import { MockAuthSessionProvider } from "../../features/auth/session/MockAuthSessionProvider";
import { authConfig } from "../../shared/config/auth-config";
import { environment } from "../../shared/config/environment";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <AuthenticationProvider>{children}</AuthenticationProvider>
    </SafeAreaProvider>
  );
}

function AuthenticationProvider({ children }: PropsWithChildren) {
  if (environment.authMode === "mock") {
    return <MockAuthSessionProvider>{children}</MockAuthSessionProvider>;
  }

  return (
    <Auth0Provider domain={authConfig.domain} clientId={authConfig.clientId}>
      <Auth0SessionProvider>{children}</Auth0SessionProvider>
    </Auth0Provider>
  );
}
