import type { OnboardingStageEnum } from "../../infrastructure/database/database.types.js";

/**
 * All stages that will be return to frontend
 */
export const ONBOARDING_STAGES = [
  "BASIC_PROFILE",
  "PREFERENCES",
  "INTERESTS",
  "LIFESTYLE",
  "PROMPTS",
  "PHOTOS",
  "LOCATION",
  "VERIFICATION",
  "COMPLETE",
] as const satisfies readonly OnboardingStageEnum[];

/**
 * All dating goal return to frontend
 */
export const DATING_GOAL = [
  "LONG_TERM_RELATIONSHIP",
  "CASUAL_DATING",
  "FRIENDSHIP",
  "UNSURE",
] as const;

export type OnboardingStage = OnboardingStageEnum;
export type DatingGoal = (typeof DATING_GOAL)[number];

/**
 * Stater returned to the frontend
 *
 * Example:
 *  { stage: PREFERENCES
 *   completedAt: null }
 */
export interface OnboardingState {
  stage: OnboardingStage;
  completed: Date | null;
}

/**
 * Request body for the first onboarding screen
 */
export interface BasicProfileInput {
    displayName: string;
    dateOfBirth: string;
    genderId: number | null;
    bio: string | null;
    datingGoal: DatingGoal | null;
    heightCm: number | null;
}
