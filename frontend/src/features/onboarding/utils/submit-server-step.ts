import {
  completeOnboarding,
  saveBasicProfile,
  saveInterests,
  saveLifestyle,
  saveLocation,
  savePhotos,
  savePreferences,
  savePrompts,
} from "../api/onboarding-api";
import type {
  OnboardingProfile,
  OnboardingStepId,
} from "../types/onboarding.types";
import { toBasicProfile } from "./basic-profile";
import { toLocation, toPhotos, toPrompts } from "./server-onboarding";

export async function submitServerStep(
  step: OnboardingStepId,
  token: string,
  profile: OnboardingProfile,
) {
  switch (step) {
    case "lookingFor":
      return saveBasicProfile(token, toBasicProfile(profile));
    case "preferences":
      return savePreferences(token, {
        minAge: profile.preferences.ageMin,
        maxAge: profile.preferences.ageMax,
        maxDistanceKm: profile.preferences.distance,
        preferredGenderIds: profile.preferredGenderIds,
      });
    case "interests":
      return saveInterests(token, { interestIds: profile.interestIds });
    case "lifestyle":
      return saveLifestyle(token, {
        answers: Object.entries(profile.lifestyleAnswers).map(
          ([questionId, optionId]) => ({
            questionId: Number(questionId),
            optionId,
          }),
        ),
      });
    case "prompts":
      if (
        Object.values(profile.promptAnswers).some((answer) => !answer.trim())
      ) {
        throw new Error("Answer each selected prompt before continuing.");
      }
      return savePrompts(token, toPrompts(profile));
    case "photos":
      return savePhotos(token, toPhotos(profile));
    case "location":
      return saveLocation(token, toLocation(profile));
    case "done":
      return completeOnboarding(token);
    default:
      throw new Error(`The ${step} screen has no save operation`);
  }
}
