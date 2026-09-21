import {db} from "../../infrastructure/database/database"
import type {OnboardingStageEnum} from "../../infrastructure/database/database.types"
import type {BasicProfileInput, OnboardingState } from "../onboarding/onboarding.types"


/**
 * @param userId 
 * @returns the user stored onboarding state if null => user has no profile
 */
export async function findOnboardingState(userId: number): Promise<OnboardingState | null> {
    const profile = await db.selectFrom("profiles").select(["onboardingStage",
      "onboardCompletedAt",]).where("userId", "=", userId).executeTakeFirst();

      if (!profile){
        return null
      }
      return {
        stage: profile.onboardingStage, 
        completedAt: profile.onboardCompletedAt,
      }
}

/**
 * @param userId
 * @param input
 * @returns create the user profile after they complete the first onboarding stage
 * After first stage complete, move onward to preferences
 */
export async function createBasicProfile(userId: number, input: BasicProfileInput): Promise<void> {
    await db.insertInto("profiles").values({
        userId, 
        dateOfBirth: input.dateOfBirth, 
        genderId: input.genderId, 
        bio: input.bio, 
        datingGoal: input.datingGoal, 
        displayName: input.displayName, 
        heightCm: input.heightCm,
        onboardingStage: "PREFERENCES",
        onboardCompletedAt: null,
    }).execute();
}

/**
 * @param userId 
 * @param input 
 * @param onboardingStage 
 * 
 * Updates an existing basic profile, 
 * onboardingStage is supplied by he service so editing an earlier 
 * screen does not accidentally move onb oarding backwards
 */
export async function updateBasicProfile(userId: number, input: BasicProfileInput, onboardingStage: OnboardingStageEnum): Promise<void> {
  await db
    .updateTable("profiles")
    .set({
      dateOfBirth: input.dateOfBirth,
      genderId: input.genderId,
      bio: input.bio,
      datingGoal: input.datingGoal,
      displayName: input.displayName,
      heightCm: input.heightCm,
      onboardingStage,
      updatedAt: new Date(),
    })

    .where("userId", "=", userId)
    .execute();
}


/**
 * Checks whether the supplied gender ID exists.
 */
export async function genderExists(genderId:number): Promise<boolean> {
    const gender = await db.selectFrom('genders').select("genderId").where("genderId", "=", genderId).executeTakeFirst();
    return gender !== undefined;
}

