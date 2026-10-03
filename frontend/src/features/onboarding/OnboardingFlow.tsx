import { environment } from "../../shared/config/environment";
import { ONBOARDING_STEP_SCREENS } from "./config/onboarding-steps";
import { useOnboardingFlow } from "./hooks/useOnboardingFlow";
import { ServerOnboardingFlow } from "./ServerOnboardingFlow";
import type { OnboardingProfile } from "./types/onboarding.types";

export interface OnboardingFlowProps {
  onComplete: (profile: OnboardingProfile) => void;
  onExit?: () => void;
  getAccessToken: () => Promise<string>;
}

export function OnboardingFlow(props: OnboardingFlowProps) {
  return environment.authMode === "mock" ? (
    <MockOnboardingFlow {...props} />
  ) : (
    <ServerOnboardingFlow {...props} />
  );
}

function MockOnboardingFlow({ onComplete, onExit }: OnboardingFlowProps) {
  const { step, stepNumber, profile, update, goNext, goTo, goBack } =
    useOnboardingFlow();
  const StepScreen = ONBOARDING_STEP_SCREENS[step];
  return (
    <StepScreen
      profile={profile}
      update={update}
      goNext={step === "done" ? () => onComplete(profile) : goNext}
      goTo={goTo}
      goBack={goBack ?? onExit ?? null}
      stepNumber={stepNumber}
    />
  );
}
