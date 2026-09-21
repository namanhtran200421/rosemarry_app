import { AppError } from "../../shared/errors/app-error";

import { authRepo } from "../authentication/auth.repository";

import {
  createBasicProfile,
  findOnboardingState,
  genderExists,
  updateBasicProfile,
} from "./onboarding.repository.js";

import type {
  DatingGoalEnum,
  OnboardingStageEnum,
} from "../../infrastructure/database/database.types";

import type {
  BasicProfileInput,
  OnboardingState,
} from "./onboarding.types.js";

const STAGE_ORDER: Record<OnboardingStageEnum, number> = {
    PREFERENCES: 1,
    INTERESTS: 2,
    LIFESTYLE: 3,
    PROMPTS: 4,
    PHOTOS: 5,
    LOCATION: 6,
    VERIFICATION: 7,
    COMPLETE: 8,

}

