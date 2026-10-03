import type { OnboardingStageEnum } from "../../infrastructure/database/database.types.js";
import { AppError } from "../../shared/errors/app-error.js";

const STAGE_ORDER: Record<OnboardingStageEnum, number> = {
  BASIC_PROFILE: 0,
  PREFERENCES: 1,
  INTERESTS: 2,
  LIFESTYLE: 3,
  PROMPTS: 4,
  PHOTOS: 5,
  LOCATION: 6,
  VERIFICATION: 7,
  COMPLETE: 8,
};

export function furthestStage(
  current: OnboardingStageEnum,
  next: OnboardingStageEnum,
): OnboardingStageEnum {
  return STAGE_ORDER[current] >= STAGE_ORDER[next] ? current : next;
}

export function requireStageReached(
  current: OnboardingStageEnum,
  required: OnboardingStageEnum,
): void {
  if (STAGE_ORDER[current] < STAGE_ORDER[required]) {
    throw new AppError({
      statusCode: 409,
      code: "ONBOARDING_STAGE_NOT_REACHED",
      message: "Complete the previous onboarding stages first",
    });
  }
}
