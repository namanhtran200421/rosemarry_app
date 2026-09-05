import { ONBOARDING_STEP_SCREENS } from "./config/onboarding-steps";
import { useOnboardingFlow } from "./hooks/useOnboardingFlow";
import type { OnboardingProfile } from "./types/onboarding.types";

interface OnboardingFlowProps {
  /** Receives the collected answers when the flow finishes. */
  onComplete: (profile: OnboardingProfile) => void;
  /** Leaves onboarding when Back is pressed on the first step. */
  onExit?: () => void;
}

/**
 * The design's ten-step sign-up flow plus its Circles, notifications and
 * completion moments. Answers live in memory for the duration of the flow;
 * persisting them is the caller's responsibility.
 */
export function OnboardingFlow({ onComplete, onExit }: OnboardingFlowProps) {
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
