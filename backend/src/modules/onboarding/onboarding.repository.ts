import { db } from "../../infrastructure/database/database.js";
import type { Transaction } from "kysely";
import type {
  DB,
  OnboardingStageEnum,
} from "../../infrastructure/database/database.types.js";
import { furthestStage } from "./onboarding.stage.js";
import type {
  OnboardingState,
  BasicProfileInput,
  PreferencesInput,
  InterestsInput,
  LifestyleInput,
  PromptsInput,
  PhotosInput,
  LocationInput,
  InterestOption,
  PromptOption,
  OnboardingSnapshot,
} from "./onboarding.types.js";

export async function findOnboardingState(
  userId: number,
): Promise<OnboardingState | null> {
  const profile = await db
    .selectFrom("profiles")
    .select(["onboardingStage", "onboardCompletedAt"])
    .where("userId", "=", userId)
    .executeTakeFirst();

  return profile
    ? {
        stage: profile.onboardingStage,
        completedAt: profile.onboardCompletedAt,
      }
    : null;
}

export async function findOnboardingSnapshot(
  userId: number,
): Promise<OnboardingSnapshot> {
  const profile = await db
    .selectFrom("profiles")
    .select([
      "displayName",
      "dateOfBirth",
      "genderId",
      "bio",
      "datingGoal",
      "heightCm",
    ])
    .where("userId", "=", userId)
    .executeTakeFirst();
  if (!profile) {
    return {
      profile: null,
      preferences: null,
      interestIds: [],
      lifestyleAnswers: [],
      prompts: [],
      photos: [],
      location: null,
    };
  }

  const [
    preferences,
    genders,
    interests,
    lifestyle,
    prompts,
    photos,
    location,
  ] = await Promise.all([
    db
      .selectFrom("userPreferences")
      .select(["minAge", "maxAge", "maxDistanceKm"])
      .where("userId", "=", userId)
      .executeTakeFirst(),
    db
      .selectFrom("profileGenderPreferences")
      .select("genderId")
      .where("userId", "=", userId)
      .execute(),
    db
      .selectFrom("profileInterests")
      .select("interestId")
      .where("userId", "=", userId)
      .execute(),
    db
      .selectFrom("profileLifestyleAnswers")
      .select(["lifestyleQuestionId", "lifestyleOptionId"])
      .where("userId", "=", userId)
      .execute(),
    db
      .selectFrom("profilePrompts")
      .select(["promptId", "answer", "displayOrder"])
      .where("userId", "=", userId)
      .orderBy("displayOrder")
      .execute(),
    db
      .selectFrom("profilePhotos")
      .select(["mediaId", "photoOrder", "isPrimary"])
      .where("userId", "=", userId)
      .orderBy("photoOrder")
      .execute(),
    db
      .selectFrom("usersLocation")
      .select(["latitude", "longitude", "postcode", "city", "state", "country"])
      .where("userId", "=", userId)
      .executeTakeFirst(),
  ]);
  const rawDate = profile.dateOfBirth;
  const dateOfBirth =
    rawDate instanceof Date
      ? `${rawDate.getFullYear()}-${String(rawDate.getMonth() + 1).padStart(2, "0")}-${String(rawDate.getDate()).padStart(2, "0")}`
      : String(rawDate ?? "").slice(0, 10);
  return {
    profile: {
      displayName: profile.displayName,
      dateOfBirth,
      genderId: profile.genderId,
      bio: profile.bio,
      datingGoal: profile.datingGoal,
      heightCm: profile.heightCm,
    },
    preferences: preferences
      ? {
          ...preferences,
          preferredGenderIds: genders.map((gender) => gender.genderId),
        }
      : null,
    interestIds: interests.map((interest) => interest.interestId),
    lifestyleAnswers: lifestyle.map((answer) => ({
      questionId: answer.lifestyleQuestionId,
      optionId: answer.lifestyleOptionId,
    })),
    prompts,
    photos,
    location: location
      ? {
          ...location,
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
        }
      : null,
  };
}

/** Save the basic fields without changing an existing user's progress. */
export async function upsertBasicProfile(
  userId: number,
  input: BasicProfileInput,
): Promise<OnboardingState> {
  const fields = {
    dateOfBirth: input.dateOfBirth,
    genderId: input.genderId,
    bio: input.bio,
    datingGoal: input.datingGoal,
    displayName: input.displayName,
    heightCm: input.heightCm,
  };

  const profile = await db
    .insertInto("profiles")
    .values({ userId, ...fields, onboardingStage: "PREFERENCES" })
    .onConflict((conflict) =>
      conflict
        .column("userId")
        .doUpdateSet({ ...fields, updatedAt: new Date() }),
    )
    .returning(["onboardingStage", "onboardCompletedAt"])
    .executeTakeFirstOrThrow();

  return {
    stage: profile.onboardingStage,
    completedAt: profile.onboardCompletedAt,
  };
}

export async function genderExists(genderId: number): Promise<boolean> {
  const gender = await db
    .selectFrom("genders")
    .select("genderId")
    .where("genderId", "=", genderId)
    .executeTakeFirst();

  return gender !== undefined;
}

export async function findGenders(): Promise<
  { genderId: number; genderName: string }[]
> {
  return db
    .selectFrom("genders")
    .select(["genderId", "genderName"])
    .orderBy("genderName")
    .execute();
}

/** Lock the profile row so concurrent edits cannot move progress backwards. */
async function advanceStage(
  trx: Transaction<DB>,
  userId: number,
  requested: OnboardingStageEnum,
): Promise<void> {
  const profile = await trx
    .selectFrom("profiles")
    .select("onboardingStage")
    .where("userId", "=", userId)
    .forUpdate()
    .executeTakeFirstOrThrow();
  const onboardingStage = furthestStage(profile.onboardingStage, requested);
  await trx
    .updateTable("profiles")
    .set({ onboardingStage, updatedAt: new Date() })
    .where("userId", "=", userId)
    .execute();
}

export async function savePreferences(
  userId: number,
  input: PreferencesInput,
  nextStage: OnboardingStageEnum,
): Promise<void> {
  await db.transaction().execute(async (trx) => {
    await advanceStage(trx, userId, nextStage);
    await trx
      .insertInto("userPreferences")
      .values({
        userId,
        minAge: input.minAge,
        maxAge: input.maxAge,
        maxDistanceKm: input.maxDistanceKm,
      })
      .onConflict((conflict) =>
        conflict.column("userId").doUpdateSet({
          minAge: input.minAge,
          maxAge: input.maxAge,
          maxDistanceKm: input.maxDistanceKm,
          updatedAt: new Date(),
        }),
      )
      .execute();

    await trx
      .deleteFrom("profileGenderPreferences")
      .where("userId", "=", userId)
      .execute();
    if (input.preferredGenderIds.length > 0) {
      await trx
        .insertInto("profileGenderPreferences")
        .values(
          input.preferredGenderIds.map((genderId) => ({ userId, genderId })),
        )
        .execute();
    }
  });
}

export async function findActiveInterests(): Promise<InterestOption[]> {
  return db
    .selectFrom("interests")
    .select(["interestId", "interestName", "slug"])
    .where("isActive", "=", true)
    .orderBy("interestName")
    .execute();
}

export async function findExistingInterestIds(
  ids: number[],
): Promise<number[]> {
  if (ids.length === 0) return [];
  const rows = await db
    .selectFrom("interests")
    .select("interestId")
    .where("interestId", "in", ids)
    .where("isActive", "=", true)
    .execute();
  return rows.map((row) => row.interestId);
}

export async function saveInterests(
  userId: number,
  input: InterestsInput,
  nextStage: OnboardingStageEnum,
): Promise<void> {
  await db.transaction().execute(async (trx) => {
    await advanceStage(trx, userId, nextStage);
    await trx
      .deleteFrom("profileInterests")
      .where("userId", "=", userId)
      .execute();
    if (input.interestIds.length > 0) {
      await trx
        .insertInto("profileInterests")
        .values(input.interestIds.map((interestId) => ({ userId, interestId })))
        .execute();
    }
  });
}

export async function findLifestyleQuestions() {
  return db
    .selectFrom("lifestyleQuestions")
    .leftJoin("lifestyleOptions", (join) =>
      join
        .onRef(
          "lifestyleOptions.lifestyleQuestionId",
          "=",
          "lifestyleQuestions.lifestyleQuestionId",
        )
        .on("lifestyleOptions.isActive", "=", true),
    )
    .select([
      "lifestyleQuestions.lifestyleQuestionId as questionId",
      "lifestyleQuestions.questionText",
      "lifestyleQuestions.slug as questionSlug",
      "lifestyleQuestions.displayOrder as questionOrder",
      "lifestyleOptions.lifestyleOptionId as optionId",
      "lifestyleOptions.label",
      "lifestyleOptions.slug as optionSlug",
      "lifestyleOptions.displayOrder as optionOrder",
    ])
    .where("lifestyleQuestions.isActive", "=", true)
    .orderBy("lifestyleQuestions.displayOrder")
    .orderBy("lifestyleOptions.displayOrder")
    .execute();
}

export async function findLifestyleOptions(ids: number[]) {
  if (ids.length === 0) return [];
  return db
    .selectFrom("lifestyleOptions")
    .innerJoin(
      "lifestyleQuestions",
      "lifestyleQuestions.lifestyleQuestionId",
      "lifestyleOptions.lifestyleQuestionId",
    )
    .select([
      "lifestyleOptions.lifestyleOptionId",
      "lifestyleOptions.lifestyleQuestionId",
    ])
    .where("lifestyleOptions.lifestyleOptionId", "in", ids)
    .where("lifestyleOptions.isActive", "=", true)
    .where("lifestyleQuestions.isActive", "=", true)
    .execute();
}

export async function saveLifestyle(
  userId: number,
  input: LifestyleInput,
  nextStage: OnboardingStageEnum,
): Promise<void> {
  await db.transaction().execute(async (trx) => {
    await advanceStage(trx, userId, nextStage);
    await trx
      .deleteFrom("profileLifestyleAnswers")
      .where("userId", "=", userId)
      .execute();
    if (input.answers.length > 0) {
      await trx
        .insertInto("profileLifestyleAnswers")
        .values(
          input.answers.map((answer) => ({
            userId,
            lifestyleQuestionId: answer.questionId,
            lifestyleOptionId: answer.optionId,
          })),
        )
        .execute();
    }
  });
}

export async function findActivePrompts(): Promise<PromptOption[]> {
  return db
    .selectFrom("prompts")
    .select(["promptId", "promptText", "slug"])
    .where("isActive", "=", true)
    .orderBy("promptId")
    .execute();
}

export async function findExistingPromptIds(ids: number[]): Promise<number[]> {
  if (ids.length === 0) return [];
  const rows = await db
    .selectFrom("prompts")
    .select("promptId")
    .where("promptId", "in", ids)
    .where("isActive", "=", true)
    .execute();
  return rows.map((row) => row.promptId);
}

export async function savePrompts(
  userId: number,
  input: PromptsInput,
  nextStage: OnboardingStageEnum,
): Promise<void> {
  await db.transaction().execute(async (trx) => {
    await advanceStage(trx, userId, nextStage);
    await trx
      .deleteFrom("profilePrompts")
      .where("userId", "=", userId)
      .execute();
    if (input.prompts.length > 0) {
      await trx
        .insertInto("profilePrompts")
        .values(input.prompts.map((prompt) => ({ ...prompt, userId })))
        .execute();
    }
  });
}

/** A media ID is usable only when it belongs to the authenticated user. */
export async function findOwnedMedia(
  userId: number,
): Promise<{ mediaId: number; mediaUrl: string }[]> {
  return db
    .selectFrom("medias")
    .select(["mediaId", "mediaUrl"])
    .where("userId", "=", userId)
    .orderBy("createdAt", "desc")
    .execute();
}

export async function findOwnedMediaIds(
  userId: number,
  ids: number[],
): Promise<number[]> {
  if (ids.length === 0) return [];
  const rows = await db
    .selectFrom("medias")
    .select("mediaId")
    .where("mediaId", "in", ids)
    .where("userId", "=", userId)
    .execute();
  return rows.map((row) => row.mediaId);
}

export async function savePhotos(
  userId: number,
  input: PhotosInput,
  nextStage: OnboardingStageEnum,
): Promise<void> {
  await db.transaction().execute(async (trx) => {
    await advanceStage(trx, userId, nextStage);
    await trx
      .deleteFrom("profilePhotos")
      .where("userId", "=", userId)
      .execute();
    if (input.photos.length > 0) {
      await trx
        .insertInto("profilePhotos")
        .values(input.photos.map((photo) => ({ ...photo, userId })))
        .execute();
    }
  });
}

export async function saveLocation(
  userId: number,
  input: LocationInput,
  nextStage: OnboardingStageEnum,
): Promise<void> {
  await db.transaction().execute(async (trx) => {
    await advanceStage(trx, userId, nextStage);
    await trx
      .insertInto("usersLocation")
      .values({ userId, ...input })
      .onConflict((conflict) =>
        conflict.column("userId").doUpdateSet({
          ...input,
          locationUpdatedAt: new Date(),
        }),
      )
      .execute();
  });
}

export async function hasApprovedVerification(
  userId: number,
): Promise<boolean> {
  const row = await db
    .selectFrom("idVerifications")
    .select("verificationId")
    .where("userId", "=", userId)
    .where("status", "=", "APPROVED")
    .executeTakeFirst();
  return row !== undefined;
}

export async function markOnboardingComplete(userId: number): Promise<void> {
  await db
    .updateTable("profiles")
    .set({
      onboardingStage: "COMPLETE",
      onboardCompletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where("userId", "=", userId)
    .where("onboardCompletedAt", "is", null)
    .execute();
}
