import { useCallback, useMemo, useReducer, useState } from "react";

import {
  EMPTY_PROFILE,
  NUMBERED_STEPS,
  type OnboardingProfile,
  type OnboardingStepId,
} from "../types/onboarding.types";
import {
  INITIAL_ONBOARDING_HISTORY,
  reduceOnboardingNavigation,
} from "../state/onboarding-navigation";

/**
 * Screen state machine for the sign-up flow, mirroring the design kit's back
 * stack. Answers are held in memory only — persisting them is the caller's
 * job, via `onComplete`.
 */
export function useOnboardingFlow() {
  const [history, dispatchNavigation] = useReducer(
    reduceOnboardingNavigation,
    INITIAL_ONBOARDING_HISTORY,
  );
  const [profile, setProfile] = useState<OnboardingProfile>(EMPTY_PROFILE);

  const step = history[history.length - 1];

  const goNext = useCallback(() => {
    dispatchNavigation({ type: "advance" });
  }, []);

  const goTo = useCallback((next: OnboardingStepId) => {
    dispatchNavigation({ type: "go-to", step: next });
  }, []);

  const goBack = useCallback(() => {
    dispatchNavigation({ type: "back" });
  }, []);

  const update = useCallback(
    <K extends keyof OnboardingProfile>(
      key: K,
      value: OnboardingProfile[K],
    ) => {
      setProfile((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const stepNumber = useMemo(() => {
    const index = NUMBERED_STEPS.indexOf(step);
    return index === -1 ? null : index + 1;
  }, [step]);

  return {
    step,
    stepNumber,
    profile,
    update,
    goNext,
    goTo,
    goBack: history.length > 1 ? goBack : null,
  };
}
