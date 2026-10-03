import { AppError } from "../../shared/errors/app-error.js";
import { authRepo } from "../authentication/auth.repository.js";

import {
  createBasicProfile,
  findOnboardingState,
  genderExists,
  updateBasicProfile,
} from "./onboarding.repository.js";

import type {
  OnboardingStageEnum,
} from "../../infrastructure/database/database.types.js";

import type {
  BasicProfileInput,
  OnboardingState,
} from "./onboarding.types.js";

/**
 * Order of onboarding stages stored in the database.
 *
 * BASIC_PROFILE is not included because it represents
 * the absence of a profile row.
 */
const STAGE_ORDER: Record<OnboardingStageEnum, number> = {
  PREFERENCES: 1,
  INTERESTS: 2,
  LIFESTYLE: 3,
  PROMPTS: 4,
  PHOTOS: 5,
  LOCATION: 6,
  VERIFICATION: 7,
  COMPLETE: 8,
};

/**
 * Checks whether a date string represents a real YYYY-MM-DD date.
 *
 * Examples:
 * 2004-06-15 -> true
 * 2004-02-31 -> false
 */
function isValidDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(year, month - 1, day),
  );

  // JavaScript can normalize invalid dates.
  // For example, February 31 may become a date in March.
  // Therefore we compare the resulting values back to the input.
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Checks whether the user is at least 18 years old.
 */
function isAtLeast18(dateOfBirth: string): boolean {
  const [year, month, day] = dateOfBirth
    .split("-")
    .map(Number);

  const today = new Date();

  let age = today.getUTCFullYear() - year!;

  const birthdayPassed =
    today.getUTCMonth() + 1 > month! ||
    (
      today.getUTCMonth() + 1 === month &&
      today.getUTCDate() >= day!
    );

  if (!birthdayPassed) {
    age -= 1;
  }

  return age >= 18;
}

/**
 * Returns whichever onboarding stage is further ahead.
 *
 * Example:
 *
 * current = PHOTOS
 * requested = PREFERENCES
 *
 * result = PHOTOS
 *
 * This prevents editing an earlier screen from resetting
 * the user's onboarding progress.
 */
function furthestStage(
  current: OnboardingStageEnum,
  requested: OnboardingStageEnum,
): OnboardingStageEnum {
  if (
    STAGE_ORDER[current] >=
    STAGE_ORDER[requested]
  ) {
    return current;
  }

  return requested;
}

/**
 * Cleans user-entered strings before saving them.
 */
function normaliseBasicProfile(
  input: BasicProfileInput,
): BasicProfileInput {
  return {
    ...input,

    displayName: input.displayName.trim(),

    // Store an empty bio as null instead of "".
    bio: input.bio?.trim() || null,
  };
}

/**
 * Validates the Basic Profile request.
 *
 * This must be async because we also check whether
 * the supplied gender exists in PostgreSQL.
 */
async function validateBasicProfile(
  input: BasicProfileInput,
): Promise<void> {
  /**
   * Do runtime checks because TypeScript does not validate
   * JSON received from the frontend.
   */
  if (
    typeof input.displayName !== "string" ||
    !input.displayName.trim()
  ) {
    throw new AppError({
      statusCode: 400,
      code: "DISPLAY_NAME_REQUIRED",
      message: "Display name is required",
    });
  }

  const displayName = input.displayName.trim();

  if (displayName.length > 100) {
    throw new AppError({
      statusCode: 400,
      code: "DISPLAY_NAME_TOO_LONG",
      message:
        "Display name must be 100 characters or fewer",
    });
  }

  if (
    typeof input.dateOfBirth !== "string" ||
    !isValidDate(input.dateOfBirth)
  ) {
    throw new AppError({
      statusCode: 400,
      code: "INVALID_DATE_OF_BIRTH",
      message: "Date of birth is invalid",
    });
  }

  if (!isAtLeast18(input.dateOfBirth)) {
    throw new AppError({
      statusCode: 400,
      code: "MINIMUM_AGE_REQUIRED",
      message:
        "You must be at least 18 years old",
    });
  }

  /**
   * Gender can be null according to the schema.
   *
   * If one is supplied, however, it must be a valid
   * gender ID from the genders lookup table.
   */
  if (input.genderId !== null) {
    if (
      !Number.isInteger(input.genderId) ||
      input.genderId <= 0
    ) {
      throw new AppError({
        statusCode: 400,
        code: "INVALID_GENDER",
        message: "Gender is invalid",
      });
    }

    const exists = await genderExists(
      input.genderId,
    );

    if (!exists) {
      throw new AppError({
        statusCode: 400,
        code: "INVALID_GENDER",
        message: "Gender is invalid",
      });
    }
  }

  /**
   * Height is optional, but if supplied it must
   * be a positive integer.
   */
  if (input.heightCm !== null) {
    if (
      !Number.isInteger(input.heightCm) ||
      input.heightCm <= 0
    ) {
      throw new AppError({
        statusCode: 400,
        code: "INVALID_HEIGHT",
        message:
          "Height must be a positive whole number",
      });
    }
  }
}

/**
 * Converts the Auth0 provider ID into Rosemarry's internal user ID.
 *
 * Never accept userId directly from the frontend for onboarding.
 */
async function resolveUserId(
  providerUserId: string,
): Promise<number> {
  const user =
    await authRepo.findByProviderUserId(
      providerUserId,
    );

  if (!user) {
    throw new AppError({
      statusCode: 404,
      code: "USER_NOT_FOUND",
      message: "Application user does not exist",
    });
  }

  return user.userId;
}


/**
 * Returns the user's current onboarding state.
 *
 * No profile row means the user is currently at BASIC_PROFILE.
 */
export async function getOnboardingState(
  providerUserId: string,
): Promise<OnboardingState> {
  const userId =
    await resolveUserId(providerUserId);

  const state =
    await findOnboardingState(userId);

  // No profile means onboarding has not started yet.
  if (!state) {
    return {
      stage: "BASIC_PROFILE",
      completedAt: null,
    };
  }

  return state;
}

/**
 * Creates or updates the user's Basic Profile.
 */
export async function saveBasicProfile(
  providerUserId: string,
  input: BasicProfileInput,
): Promise<OnboardingState> {
  const userId =
    await resolveUserId(providerUserId);

  // Validate request data before touching the profile table.
  await validateBasicProfile(input);

  const normalisedInput =
    normaliseBasicProfile(input);

  const currentState =
    await findOnboardingState(userId);

  /**
   * No profile exists yet.
   *
   * Create it and move the user to PREFERENCES.
   */
  if (!currentState) {
    await createBasicProfile(
      userId,
      normalisedInput,
    );

    return {
      stage: "PREFERENCES",
      completedAt: null,
    };
  }

  /**
   * Profile already exists.
   *
   * The user may be returning to edit their Basic Profile,
   * so preserve the furthest stage they have already reached.
   */
  const nextStage = furthestStage(
    currentState.stage as OnboardingStageEnum,
    "PREFERENCES",
  );

  await updateBasicProfile(
    userId,
    normalisedInput,
    nextStage,
  );

  return {
    stage: nextStage,
    completedAt: currentState.completedAt,
  };
}