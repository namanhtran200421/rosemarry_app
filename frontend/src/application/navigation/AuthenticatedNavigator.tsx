import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuthSession } from "../../features/auth/session/AuthSessionContext";
import { useState } from "react";

import { OnboardingFlow } from "../../features/onboarding/OnboardingFlow";
import type { OnboardingProfile } from "../../features/onboarding/types/onboarding.types";
import { DEMO_USER } from "../../features/social/data/people";
import type { CurrentUser } from "../../features/social/types/social.types";
import { buildUserFromOnboarding } from "../../features/social/utils/build-user";

import { MainAppNavigator } from "./MainAppNavigator";

type AuthenticatedStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<AuthenticatedStackParamList>();

/** Routes available after an application session has been established. */
export function AuthenticatedNavigator() {
  const { completeOnboarding, logout, session } = useAuthSession();
  const [mainUser, setMainUser] = useState<CurrentUser>(DEMO_USER);
  const [isNewMember, setIsNewMember] = useState(false);
  const needsOnboarding = session !== null && !session.onboardingCompleted;

  function finishOnboarding(profile: OnboardingProfile): void {
    setMainUser(buildUserFromOnboarding(profile));
    setIsNewMember(true);
    completeOnboarding();
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {needsOnboarding ? (
        <Stack.Screen name="Onboarding">
          {() => (
            <OnboardingFlow
              onComplete={finishOnboarding}
              onExit={() => {
                void logout();
              }}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Main">
          {() => (
            <MainAppNavigator
              initialUser={mainUser}
              isNewMember={isNewMember}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
