import type { OnboardingProfile } from "../../onboarding/types/onboarding.types";
import { LOOKING_FOR } from "../data/catalogs";
import { DEMO_USER } from "../data/people";
import type { CurrentUser } from "../types/social.types";

import { feetToCm } from "./profile-utils";
import { ageFromDateOfBirth } from "../../onboarding/utils/basic-profile";

const GENDER_LABELS: Record<string, string> = { Woman: "Female", Man: "Male" };
const LOOKING_IDS: Record<string, string> = {
  long: "Long-term relationship",
  short: "Short-term relationship",
  casual: "Casual dating",
  friends: "New friends",
  unsure: "Not sure yet",
};

/** Assembles the member's profile from saved onboarding answers. */
export function buildUserFromOnboarding(
  answers: OnboardingProfile,
  useDemoPhotos = false,
): CurrentUser {
  const lookingFor =
    LOOKING_IDS[answers.lookingFor] ??
    LOOKING_FOR.find(([title]) => title === answers.lookingFor)?.[0] ??
    "";

  return {
    ...DEMO_USER,
    name: answers.name.trim(),
    age: ageFromDateOfBirth(answers.dateOfBirth) ?? undefined,
    gender: GENDER_LABELS[answers.gender] ?? answers.gender,
    heightCm: feetToCm(answers.height),
    location: [
      answers.location.city,
      answers.location.state,
      answers.location.country,
    ]
      .filter(Boolean)
      .join(", "),
    bio: answers.bio,
    interests: answers.interests,
    lookingFor,
    lifestyle: {
      Drinking: answers.lifestyle.Drinking ?? "No",
      Smoking: answers.lifestyle.Smoking ?? "No",
      Cannabis: answers.lifestyle.Cannabis ?? "No",
      Workout: answers.lifestyle.Workout ?? "No",
    },
    prompts: Object.entries(answers.prompts)
      .filter(([, answer]) => answer.trim().length > 0)
      .map(([q, a]) => ({ q, a: a.trim() })),
    photos: useDemoPhotos ? DEMO_USER.photos : answers.mediaUrls,
  };
}
