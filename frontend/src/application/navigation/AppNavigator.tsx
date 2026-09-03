import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../../features/auth/screens/LoginScreen";
import { useAuthSession } from "../../features/auth/session/AuthSessionProvider";
import { HomeScreen } from "../../features/home/screens/HomeScreen";
import { LoadingScreen } from "../../shared/ui/LoadingScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { status } = useAuthSession();

  if (status === "initializing") {
    return <LoadingScreen label="Restoring your session" />;
  }

  const isAuthenticated =
    status === "authenticated" || status === "logging-out";

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
