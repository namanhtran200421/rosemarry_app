// onboarding.types.ts

import type {
  DatingGoalEnum,
  OnboardingStageEnum,
} from "../../infrastructure/database/database.types";

/**
 * Public onboarding stage returned to the frontend.
 *
 * BASIC_PROFILE is not stored in PostgreSQL.
 * It means the user does not have a profile row yet.
 */
export type OnboardingStage =
  | "BASIC_PROFILE"
  | OnboardingStageEnum;

/**
 * Current onboarding state returned by the API.
 */
export interface OnboardingState {
  stage: OnboardingStage;
  completedAt: Date | null;
}

/**
 * Data submitted from the Basic Profile screen.
 */
export interface BasicProfileInput {
  displayName: string;
  dateOfBirth: string;
  genderId: number | null;
  bio: string | null;
  datingGoal: DatingGoalEnum | null;
  heightCm: number | null;
}