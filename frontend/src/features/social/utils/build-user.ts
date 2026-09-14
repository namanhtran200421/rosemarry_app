import type { OnboardingProfile } from "../../onboarding/types/onboarding.types";
import { LOOKING_FOR } from "../data/catalogs";
import { DEMO_USER } from "../data/people";
import type { CurrentUser } from "../types/social.types";

import { feetToCm } from "./profile-utils";

const GENDER_LABELS: Record<string, string> = { Woman: "Female", Man: "Male" };
const LOOKING_IDS: Record<string, string> = {
  long: "Long-term relationship",
  short: "Short-term relationship",
  casual: "Casual dating",
  friends: "New friends",
  unsure: "Not sure yet",
};

/**
 * Assembles the member's profile from their onboarding answers. Fields the
 * flow does not ask (bio, location, languages, bonus details) stay empty until
 * the member fills them in from Edit profile.
 */
export function buildUserFromOnboarding(answers: OnboardingProfile): CurrentUser {
  const lookingFor =
    LOOKING_IDS[answers.lookingFor] ??
    LOOKING_FOR.find(([title]) => title === answers.lookingFor)?.[0] ??
    "";

  return {
    ...DEMO_USER,
    name: answers.name.trim(),
    age: answers.age ? Number(answers.age) : undefined,
    gender: GENDER_LABELS[answers.gender] ?? answers.gender,
    heightCm: feetToCm(answers.height),
    location: "",
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
  };
}
