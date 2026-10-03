import { AppError } from "../../shared/errors/app-error.js";
import type { OnboardingStageEnum } from "../../infrastructure/database/database.types.js";
import {
  findActiveInterests,
  findActivePrompts,
  findExistingInterestIds,
  findExistingPromptIds,
  findGenders,
  findLifestyleOptions,
  findLifestyleQuestions,
  findOnboardingState,
  findOnboardingSnapshot,
  findOwnedMedia,
  findOwnedMediaIds,
  genderExists,
  hasApprovedVerification,
  markOnboardingComplete,
  saveInterests as saveInterestsRepo,
  saveLifestyle as saveLifestyleRepo,
  saveLocation as saveLocationRepo,
  savePhotos as savePhotosRepo,
  savePreferences as savePreferencesRepo,
  savePrompts as savePromptsRepo,
  upsertBasicProfile,
} from "./onboarding.repository.js";
import type {
  BasicProfileInput,
  InterestsInput,
  LifestyleInput,
  LifestyleQuestion,
  LocationInput,
  OnboardingState,
  PhotosInput,
  PreferencesInput,
  PromptsInput,
} from "./onboarding.types.js";
import { furthestStage, requireStageReached } from "./onboarding.stage.js";

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
    Date.UTC(
      today.getUTCFullYear() - 18,
      today.getUTCMonth(),
      today.getUTCDate(),
    ),
  );
  const birthDate = new Date(Date.UTC(year!, month! - 1, day!));
  return birthDate <= cutoff;
}

/** Validate JSON at runtime; TypeScript types do not protect HTTP input. */
export async function parseBasicProfile(
  input: unknown,
): Promise<BasicProfileInput> {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    badRequest("INVALID_PROFILE", "A profile object is required");
  }

  const body = input as Record<string, unknown>;
  if (typeof body.displayName !== "string" || !body.displayName.trim()) {
    badRequest("DISPLAY_NAME_REQUIRED", "Display name is required");
  }
  const displayName = (body.displayName as string).trim();
  if (displayName.length > 100) {
    badRequest(
      "DISPLAY_NAME_TOO_LONG",
      "Display name must be 100 characters or fewer",
    );
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
    (!Number.isInteger(heightCm) ||
      (heightCm as number) <= 0 ||
      (heightCm as number) > 32767)
  ) {
    badRequest(
      "INVALID_HEIGHT",
      "Height must be a positive whole number at most 32767",
    );
  }

  const bio = body.bio ?? null;
  if (bio !== null && typeof bio !== "string") {
    badRequest("INVALID_BIO", "Bio must be a string or null");
  }

  const datingGoal = body.datingGoal ?? null;
  if (
    datingGoal !== null &&
    !DATING_GOALS.has(datingGoal as BasicProfileInput["datingGoal"])
  ) {
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

export async function getOnboardingState(
  userId: number,
): Promise<OnboardingState> {
  return (
    (await findOnboardingState(userId)) ?? {
      stage: "BASIC_PROFILE",
      completedAt: null,
    }
  );
}

export async function getOnboardingSnapshot(userId: number) {
  return findOnboardingSnapshot(userId);
}

export async function saveBasicProfile(
  userId: number,
  input: unknown,
): Promise<OnboardingState> {
  const profile = await parseBasicProfile(input);
  return upsertBasicProfile(userId, profile);
}

function objectBody(input: unknown, code: string): Record<string, unknown> {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    badRequest(code, "A JSON object is required");
  }
  return input as Record<string, unknown>;
}

function positiveId(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function ids(value: unknown, code: string, max: number): number[] {
  if (
    !Array.isArray(value) ||
    value.length > max ||
    !value.every(positiveId) ||
    new Set(value).size !== value.length
  ) {
    badRequest(code, `Select up to ${max} unique valid IDs`);
  }
  return value as number[];
}

async function requireStoredStage(
  userId: number,
): Promise<OnboardingStageEnum> {
  const state = await findOnboardingState(userId);
  if (!state || state.stage === "BASIC_PROFILE") {
    throw new AppError({
      statusCode: 409,
      code: "BASIC_PROFILE_REQUIRED",
      message: "Complete your basic profile first",
    });
  }
  return state.stage;
}

function nextStage(
  current: OnboardingStageEnum,
  required: OnboardingStageEnum,
  next: OnboardingStageEnum,
): OnboardingStageEnum {
  requireStageReached(current, required);
  return furthestStage(current, next);
}

async function savedState(userId: number): Promise<OnboardingState> {
  const state = await findOnboardingState(userId);
  if (!state) throw new Error("Onboarding profile disappeared after save");
  return state;
}

export async function listGenders() {
  return findGenders();
}

export async function listInterests() {
  return findActiveInterests();
}

export async function listLifestyleQuestions(): Promise<LifestyleQuestion[]> {
  const rows = await findLifestyleQuestions();
  const questions = new Map<number, LifestyleQuestion>();
  for (const row of rows) {
    let question = questions.get(row.questionId);
    if (!question) {
      question = {
        questionId: row.questionId,
        questionText: row.questionText,
        slug: row.questionSlug,
        displayOrder: row.questionOrder,
        options: [],
      };
      questions.set(row.questionId, question);
    }
    if (
      row.optionId !== null &&
      row.label !== null &&
      row.optionSlug !== null &&
      row.optionOrder !== null
    ) {
      question.options.push({
        optionId: row.optionId,
        label: row.label,
        slug: row.optionSlug,
        displayOrder: row.optionOrder,
      });
    }
  }
  return [...questions.values()];
}

export async function listPrompts() {
  return findActivePrompts();
}

export async function listOwnedMedia(userId: number) {
  return findOwnedMedia(userId);
}

export async function savePreferences(
  userId: number,
  input: unknown,
): Promise<OnboardingState> {
  const body = objectBody(input, "INVALID_PREFERENCES");
  const { minAge, maxAge, maxDistanceKm } = body;
  if (
    !Number.isSafeInteger(minAge) ||
    (minAge as number) < 18 ||
    !Number.isSafeInteger(maxAge) ||
    (maxAge as number) < (minAge as number) ||
    !Number.isSafeInteger(maxDistanceKm) ||
    (maxDistanceKm as number) <= 0
  ) {
    badRequest(
      "INVALID_PREFERENCES",
      "Age range and distance must be valid positive whole numbers",
    );
  }
  const preferredGenderIds = ids(
    body.preferredGenderIds,
    "INVALID_PREFERRED_GENDERS",
    100,
  );
  const valid = await Promise.all(preferredGenderIds.map(genderExists));
  if (valid.some((exists) => !exists))
    badRequest("INVALID_PREFERRED_GENDERS", "A selected gender does not exist");
  const stage = await requireStoredStage(userId);
  const next = nextStage(stage, "PREFERENCES", "INTERESTS");
  await savePreferencesRepo(
    userId,
    { minAge, maxAge, maxDistanceKm, preferredGenderIds } as PreferencesInput,
    next,
  );
  return savedState(userId);
}

export async function saveInterests(
  userId: number,
  input: unknown,
): Promise<OnboardingState> {
  const body = objectBody(input, "INVALID_INTERESTS");
  const interestIds = ids(body.interestIds, "INVALID_INTERESTS", 5);
  const existing = await findExistingInterestIds(interestIds);
  if (existing.length !== interestIds.length)
    badRequest("INVALID_INTERESTS", "A selected interest is unavailable");
  const stage = await requireStoredStage(userId);
  const next = nextStage(stage, "INTERESTS", "LIFESTYLE");
  await saveInterestsRepo(
    userId,
    { interestIds } satisfies InterestsInput,
    next,
  );
  return savedState(userId);
}

export async function saveLifestyle(
  userId: number,
  input: unknown,
): Promise<OnboardingState> {
  const body = objectBody(input, "INVALID_LIFESTYLE");
  if (
    !Array.isArray(body.answers) ||
    body.answers.length > 100 ||
    !body.answers.every(
      (answer: unknown) =>
        answer &&
        typeof answer === "object" &&
        positiveId((answer as Record<string, unknown>).questionId) &&
        positiveId((answer as Record<string, unknown>).optionId),
    )
  ) {
    badRequest(
      "INVALID_LIFESTYLE",
      "Answers must contain valid question and option IDs",
    );
  }
  const answers = body.answers as LifestyleInput["answers"];
  if (
    new Set(answers.map((answer) => answer.questionId)).size !== answers.length
  ) {
    badRequest("INVALID_LIFESTYLE", "Each question can have only one answer");
  }
  const options = await findLifestyleOptions(
    answers.map((answer) => answer.optionId),
  );
  const optionQuestions = new Map(
    options.map((option) => [
      option.lifestyleOptionId,
      option.lifestyleQuestionId,
    ]),
  );
  if (
    answers.some(
      (answer) => optionQuestions.get(answer.optionId) !== answer.questionId,
    )
  ) {
    badRequest(
      "INVALID_LIFESTYLE",
      "A selected option does not belong to its question",
    );
  }
  const stage = await requireStoredStage(userId);
  const next = nextStage(stage, "LIFESTYLE", "PROMPTS");
  await saveLifestyleRepo(userId, { answers }, next);
  return savedState(userId);
}

export async function savePrompts(
  userId: number,
  input: unknown,
): Promise<OnboardingState> {
  const body = objectBody(input, "INVALID_PROMPTS");
  if (
    !Array.isArray(body.prompts) ||
    body.prompts.length > 3 ||
    !body.prompts.every(
      (prompt: unknown) =>
        prompt &&
        typeof prompt === "object" &&
        positiveId((prompt as Record<string, unknown>).promptId) &&
        Number.isInteger((prompt as Record<string, unknown>).displayOrder) &&
        (prompt as { displayOrder: number }).displayOrder >= 1 &&
        (prompt as { displayOrder: number }).displayOrder <= 3 &&
        typeof (prompt as Record<string, unknown>).answer === "string" &&
        Boolean((prompt as { answer: string }).answer.trim()),
    )
  ) {
    badRequest(
      "INVALID_PROMPTS",
      "Choose up to three prompts with nonempty answers and orders 1 to 3",
    );
  }
  const prompts = (body.prompts as PromptsInput["prompts"]).map((prompt) => ({
    ...prompt,
    answer: prompt.answer.trim(),
  }));
  if (
    new Set(prompts.map((prompt) => prompt.promptId)).size !== prompts.length ||
    new Set(prompts.map((prompt) => prompt.displayOrder)).size !==
      prompts.length
  ) {
    badRequest(
      "INVALID_PROMPTS",
      "Prompt IDs and display orders must be unique",
    );
  }
  const existing = await findExistingPromptIds(
    prompts.map((prompt) => prompt.promptId),
  );
  if (existing.length !== prompts.length)
    badRequest("INVALID_PROMPTS", "A selected prompt is unavailable");
  const stage = await requireStoredStage(userId);
  const next = nextStage(stage, "PROMPTS", "PHOTOS");
  await savePromptsRepo(userId, { prompts }, next);
  return savedState(userId);
}

export async function savePhotos(
  userId: number,
  input: unknown,
): Promise<OnboardingState> {
  const body = objectBody(input, "INVALID_PHOTOS");
  if (
    !Array.isArray(body.photos) ||
    body.photos.length < 2 ||
    body.photos.length > 6 ||
    !body.photos.every(
      (photo: unknown) =>
        photo &&
        typeof photo === "object" &&
        positiveId((photo as Record<string, unknown>).mediaId) &&
        Number.isInteger((photo as Record<string, unknown>).photoOrder) &&
        (photo as { photoOrder: number }).photoOrder >= 1 &&
        typeof (photo as Record<string, unknown>).isPrimary === "boolean",
    )
  ) {
    badRequest(
      "INVALID_PHOTOS",
      "Add two to six valid photos with positive display orders",
    );
  }
  const photos = body.photos as PhotosInput["photos"];
  if (
    new Set(photos.map((photo) => photo.mediaId)).size !== photos.length ||
    new Set(photos.map((photo) => photo.photoOrder)).size !== photos.length ||
    photos.filter((photo) => photo.isPrimary).length !== 1
  ) {
    badRequest(
      "INVALID_PHOTOS",
      "Photos need unique media IDs and orders, and one primary photo",
    );
  }
  const owned = await findOwnedMediaIds(
    userId,
    photos.map((photo) => photo.mediaId),
  );
  if (owned.length !== photos.length)
    badRequest(
      "INVALID_PHOTOS",
      "A selected photo is unavailable for this account",
    );
  const stage = await requireStoredStage(userId);
  const next = nextStage(stage, "PHOTOS", "LOCATION");
  await savePhotosRepo(userId, { photos }, next);
  return savedState(userId);
}

export async function saveLocation(
  userId: number,
  input: unknown,
): Promise<OnboardingState> {
  const body = objectBody(input, "INVALID_LOCATION");
  const { latitude, longitude } = body;
  if (
    typeof latitude !== "number" ||
    !Number.isFinite(latitude) ||
    Math.abs(latitude) > 90 ||
    typeof longitude !== "number" ||
    !Number.isFinite(longitude) ||
    Math.abs(longitude) > 180
  ) {
    badRequest(
      "INVALID_LOCATION",
      "Latitude and longitude must be valid coordinates",
    );
  }
  const fields = ["postcode", "city", "state", "country"] as const;
  const location: LocationInput = {
    latitude,
    longitude,
    postcode: null,
    city: null,
    state: null,
    country: null,
  };
  for (const field of fields) {
    const value = body[field] ?? null;
    if (
      value !== null &&
      (typeof value !== "string" ||
        value.trim().length === 0 ||
        (field !== "postcode" && value.length > 100))
    ) {
      badRequest(
        "INVALID_LOCATION",
        `${field} must be a nonempty string or null`,
      );
    }
    location[field] = value === null ? null : (value as string).trim();
  }
  const stage = await requireStoredStage(userId);
  const next = nextStage(stage, "LOCATION", "VERIFICATION");
  await saveLocationRepo(userId, location, next);
  return savedState(userId);
}

export async function completeOnboarding(
  userId: number,
): Promise<OnboardingState> {
  const state = await findOnboardingState(userId);
  const stage = await requireStoredStage(userId);
  if (stage === "COMPLETE" && state?.completedAt) return state;
  nextStage(stage, "VERIFICATION", "COMPLETE");
  if (!(await hasApprovedVerification(userId))) {
    throw new AppError({
      statusCode: 409,
      code: "VERIFICATION_REQUIRED",
      message:
        "Approved identity verification is required to finish onboarding",
    });
  }
  await markOnboardingComplete(userId);
  return savedState(userId);
}
