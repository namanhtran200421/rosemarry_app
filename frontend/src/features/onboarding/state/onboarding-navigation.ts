import {
  NUMBERED_STEPS,
  type OnboardingStepId,
} from "../types/onboarding.types";

const ONBOARDING_SEQUENCE: OnboardingStepId[] = [
  ...NUMBERED_STEPS,
  "circles",
  "notifications",
  "done",
];

export type OnboardingNavigationAction =
  | { type: "advance" }
  | { type: "back" }
  | { type: "go-to"; step: OnboardingStepId };

export const INITIAL_ONBOARDING_HISTORY: OnboardingStepId[] = ["name"];

/** Pure navigation state transition used by the onboarding flow hook. */
export function reduceOnboardingNavigation(
  history: OnboardingStepId[],
  action: OnboardingNavigationAction,
): OnboardingStepId[] {
  const currentStep = history[history.length - 1];

  switch (action.type) {
    case "advance": {
      const currentIndex = ONBOARDING_SEQUENCE.indexOf(currentStep);

      if (currentIndex < 0) {
        return history;
      }

      const nextStep = ONBOARDING_SEQUENCE[currentIndex + 1];
      return nextStep ? [...history, nextStep] : history;
    }
    case "back":
      return history.length > 1 ? history.slice(0, -1) : history;
    case "go-to":
      return action.step === currentStep ? history : [...history, action.step];
  }
}
