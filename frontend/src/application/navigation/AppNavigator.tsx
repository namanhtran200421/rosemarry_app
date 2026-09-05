import { NavigationContainer } from "@react-navigation/native";

import { useAuthSession } from "../../features/auth/session/AuthSessionContext";
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
      {isAuthenticated ? <AuthenticatedNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
