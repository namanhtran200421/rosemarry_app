import type { OnboardingState } from "./onboarding-contract";

export function isOnboardingState(value: unknown): value is OnboardingState {
  if (!value || typeof value !== "object") return false;
  const state = value as Record<string, unknown>;
  return (
    (state.stage === "BASIC_PROFILE" ||
      state.stage === "PREFERENCES" ||
      state.stage === "INTERESTS" ||
      state.stage === "LIFESTYLE" ||
      state.stage === "PROMPTS" ||
      state.stage === "PHOTOS" ||
      state.stage === "LOCATION" ||
      state.stage === "VERIFICATION" ||
      state.stage === "COMPLETE") &&
    (state.completedAt === null ||
      (typeof state.completedAt === "string" &&
        !Number.isNaN(Date.parse(state.completedAt))))
  );
}
