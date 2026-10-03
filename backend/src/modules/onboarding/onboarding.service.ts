import { AppError } from "../../shared/errors/app-error.js";
import {
  findOnboardingState,
  genderExists,
  upsertBasicProfile,
} from "./onboarding.repository.js";
import type { BasicProfileInput, OnboardingState } from "./onboarding.types.js";

const DATING_GOALS = new Set<BasicProfileInput["datingGoal"]>([
  "LONG_TERM_RELATIONSHIP",
  "SHORT_TERM_RELATIONSHIP",
  "CASUAL_DATING",
  "NEW_FRIENDS",
  "NOT_SURE_YET",
]);

function badRequest(code: string, message: string): never {
  throw new AppError({ statusCode: 400, code, message });
}

function isValidDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isAtLeast18(dateOfBirth: string): boolean {
  const [year, month, day] = dateOfBirth.split("-").map(Number);
  const today = new Date();
  const cutoff = new Date(
    Date.UTC(today.getUTCFullYear() - 18, today.getUTCMonth(), today.getUTCDate()),
  );
  const birthDate = new Date(Date.UTC(year!, month! - 1, day!));
  return birthDate <= cutoff;
}

/** Validate JSON at runtime; TypeScript types do not protect HTTP input. */
export async function parseBasicProfile(input: unknown): Promise<BasicProfileInput> {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    badRequest("INVALID_PROFILE", "A profile object is required");
  }

  const body = input as Record<string, unknown>;
  if (typeof body.displayName !== "string" || !body.displayName.trim()) {
    badRequest("DISPLAY_NAME_REQUIRED", "Display name is required");
  }
  const displayName = (body.displayName as string).trim();
  if (displayName.length > 100) {
    badRequest("DISPLAY_NAME_TOO_LONG", "Display name must be 100 characters or fewer");
  }

  if (typeof body.dateOfBirth !== "string" || !isValidDate(body.dateOfBirth)) {
    badRequest("INVALID_DATE_OF_BIRTH", "Date of birth is invalid");
  }
  const dateOfBirth = body.dateOfBirth as string;
  if (!isAtLeast18(dateOfBirth)) {
    badRequest("MINIMUM_AGE_REQUIRED", "You must be at least 18 years old");
  }

  const genderId = body.genderId ?? null;
  if (genderId !== null) {
    if (!Number.isInteger(genderId) || (genderId as number) <= 0) {
      badRequest("INVALID_GENDER", "Gender is invalid");
    }
    if (!(await genderExists(genderId as number))) {
      badRequest("INVALID_GENDER", "Gender is invalid");
    }
  }

  const heightCm = body.heightCm ?? null;
  if (
    heightCm !== null &&
    (!Number.isInteger(heightCm) || (heightCm as number) <= 0 || (heightCm as number) > 32767)
  ) {
    badRequest("INVALID_HEIGHT", "Height must be a positive whole number at most 32767");
  }

  const bio = body.bio ?? null;
  if (bio !== null && typeof bio !== "string") {
    badRequest("INVALID_BIO", "Bio must be a string or null");
  }

  const datingGoal = body.datingGoal ?? null;
  if (datingGoal !== null && !DATING_GOALS.has(datingGoal as BasicProfileInput["datingGoal"])) {
    badRequest("INVALID_DATING_GOAL", "Dating goal is invalid");
  }

  return {
    displayName,
    dateOfBirth,
    genderId: genderId as number | null,
    heightCm: heightCm as number | null,
    bio: (bio as string | null)?.trim() || null,
    datingGoal: datingGoal as BasicProfileInput["datingGoal"],
  };
}

export async function getOnboardingState(userId: number): Promise<OnboardingState> {
  return (await findOnboardingState(userId)) ?? {
    stage: "BASIC_PROFILE",
    completedAt: null,
  };
}

export async function saveBasicProfile(
  userId: number,
  input: unknown,
): Promise<OnboardingState> {
  const profile = await parseBasicProfile(input);
  return upsertBasicProfile(userId, profile);
}
