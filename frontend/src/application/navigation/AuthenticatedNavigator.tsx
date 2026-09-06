import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";

import { useAuthSession } from "../../features/auth/session/AuthSessionContext";
import { HomeScreen } from "../../features/home/screens/HomeScreen";
import { OnboardingFlow } from "../../features/onboarding/OnboardingFlow";

type AuthenticatedStackParamList = {
  Onboarding: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<AuthenticatedStackParamList>();

/** Routes available after an application session has been established. */
export function AuthenticatedNavigator() {
  const { logout, session } = useAuthSession();
  const [hasFinishedOnboarding, setHasFinishedOnboarding] = useState(false);
  const needsOnboarding =
    session !== null && !session.profileExists && !hasFinishedOnboarding;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {needsOnboarding ? (
        <Stack.Screen name="Onboarding">
          {() => (
            <OnboardingFlow
              onComplete={() => setHasFinishedOnboarding(true)}
              onExit={() => {
                void logout();
              }}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
}
