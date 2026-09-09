import { NavigationContainer } from "@react-navigation/native";

import { useAuthSession } from "../../features/auth/session/AuthSessionContext";
import { VerificationGate } from "../../features/verification/components/VerificationGate";
import { LoadingScreen } from "../../shared/ui/LoadingScreen";

import { AuthenticatedNavigator } from "./AuthenticatedNavigator";
import { AuthNavigator } from "./AuthNavigator";

export function AppNavigator() {
  const { status } = useAuthSession();

  if (status === "initializing") {
    return <LoadingScreen label="Restoring your session" />;
  }

  const isAuthenticated =
    status === "authenticated" || status === "logging-out";

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <VerificationGate>
          <AuthenticatedNavigator />
        </VerificationGate>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
