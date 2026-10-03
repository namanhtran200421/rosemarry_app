import { db } from "../../infrastructure/database/database.js";
import type { OnboardingState, BasicProfileInput } from "./onboarding.types.js";

export async function findOnboardingState(
  userId: number,
): Promise<OnboardingState | null> {
  const profile = await db
    .selectFrom("profiles")
    .select(["onboardingStage", "onboardCompletedAt"])
    .where("userId", "=", userId)
    .executeTakeFirst();

  return profile
    ? { stage: profile.onboardingStage, completedAt: profile.onboardCompletedAt }
    : null;
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
      conflict.column("userId").doUpdateSet({ ...fields, updatedAt: new Date() }),
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
