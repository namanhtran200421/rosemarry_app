import type { PropsWithChildren } from "react";
import { Auth0Provider } from "react-native-auth0";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthSessionProvider } from "../../features/auth/session/AuthSessionProvider";
import { authConfig } from "../../shared/config/auth-config";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <Auth0Provider domain={authConfig.domain} clientId={authConfig.clientId}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </Auth0Provider>
    </SafeAreaProvider>
  );
}
