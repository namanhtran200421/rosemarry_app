import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuthSession } from "../../features/auth/session/AuthSessionContext";
import { useEffect, useState } from "react";

import { OnboardingFlow } from "../../features/onboarding/OnboardingFlow";
import {
  fetchGenders,
  fetchInterests,
  fetchLifestyle,
  fetchOnboardingSnapshot,
  fetchOwnedMedia,
  fetchPrompts,
} from "../../features/onboarding/api/onboarding-api";
import { OnboardingScreen } from "../../features/onboarding/components/OnboardingScreen";
import { StepTitle } from "../../features/onboarding/components/StepTitle";
import type { OnboardingProfile } from "../../features/onboarding/types/onboarding.types";
import { fromSnapshot } from "../../features/onboarding/utils/server-onboarding";
import { DEMO_USER } from "../../features/social/data/people";
import type { CurrentUser } from "../../features/social/types/social.types";
import { buildUserFromOnboarding } from "../../features/social/utils/build-user";

import { MainAppNavigator } from "./MainAppNavigator";
import { AppButton } from "../../shared/ui/AppButton";
import { ErrorMessage } from "../../shared/ui/ErrorMessage";
import { LoadingScreen } from "../../shared/ui/LoadingScreen";
import { environment } from "../../shared/config/environment";

type AuthenticatedStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<AuthenticatedStackParamList>();

/** Routes available after an application session has been established. */
export function AuthenticatedNavigator() {
  const { completeOnboarding, getAccessToken, logout, session } =
    useAuthSession();
  const [mainUser, setMainUser] = useState<CurrentUser>(DEMO_USER);
  const [isNewMember, setIsNewMember] = useState(false);
  const [profileStatus, setProfileStatus] = useState<
    "loading" | "ready" | "error"
  >(session?.onboardingCompleted ? "loading" : "ready");
  const [retry, setRetry] = useState(0);
  const needsOnboarding = session !== null && !session.onboardingCompleted;

  useEffect(() => {
    if (!session?.onboardingCompleted || isNewMember) return;
    let active = true;
    async function loadProfile(): Promise<void> {
      try {
        const token = await getAccessToken();
        const [snapshot, genders, interests, lifestyle, prompts, media] =
          await Promise.all([
            fetchOnboardingSnapshot(token),
            fetchGenders(token),
            fetchInterests(token),
            fetchLifestyle(token),
            fetchPrompts(token),
            fetchOwnedMedia(token),
          ]);
        if (!snapshot.profile) throw new Error("Profile is missing");
        if (active) {
          setMainUser(
            buildUserFromOnboarding(
              fromSnapshot(snapshot, {
                genders,
                interests,
                lifestyle,
                prompts,
                media,
              }),
            ),
          );
          setProfileStatus("ready");
        }
      } catch {
        if (active) setProfileStatus("error");
      }
    }
    void loadProfile();
    return () => {
      active = false;
    };
  }, [getAccessToken, isNewMember, retry, session?.onboardingCompleted]);

  function finishOnboarding(profile: OnboardingProfile): void {
    setMainUser(
      buildUserFromOnboarding(profile, environment.authMode === "mock"),
    );
    setIsNewMember(true);
    completeOnboarding();
  }

  if (!needsOnboarding && !isNewMember && profileStatus === "loading") {
    return <LoadingScreen label="Loading your profile" />;
  }

  if (!needsOnboarding && !isNewMember && profileStatus === "error") {
    return (
      <OnboardingScreen
        onBack={() => void logout()}
        footer={
          <AppButton
            label="Retry"
            onPress={() => {
              setProfileStatus("loading");
              setRetry((value) => value + 1);
            }}
          />
        }
      >
        <StepTitle title="Your profile is unavailable" />
        <ErrorMessage message="Could not load your saved profile. Please retry." />
      </OnboardingScreen>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {needsOnboarding ? (
        <Stack.Screen name="Onboarding">
          {() => (
            <OnboardingFlow
              onComplete={finishOnboarding}
              getAccessToken={getAccessToken}
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
