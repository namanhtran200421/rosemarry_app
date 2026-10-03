import type {
  DatingGoalEnum,
  OnboardingStageEnum,
} from "../../infrastructure/database/database.types.js";

/**
 * BASIC_PROFILE is an application-only state.
 *
 * No profiles row = BASIC_PROFILE.
 */
export type OnboardingStage = "BASIC_PROFILE" | OnboardingStageEnum;

export interface OnboardingState {
  stage: OnboardingStage;
  completedAt: Date | null;
}

/* -------------------------------------------------------------------------- */
/*                               Basic Profile                                */
/* -------------------------------------------------------------------------- */

export interface BasicProfileInput {
  displayName: string;
  dateOfBirth: string;
  genderId: number | null;
  bio: string | null;
  datingGoal: DatingGoalEnum | null;
  heightCm: number | null;
}

/* -------------------------------------------------------------------------- */
/*                                Preferences                                 */
/* -------------------------------------------------------------------------- */

export interface PreferencesInput {
  minAge: number;
  maxAge: number;
  maxDistanceKm: number;
  preferredGenderIds: number[];
}

/* -------------------------------------------------------------------------- */
/*                                 Interests                                  */
/* -------------------------------------------------------------------------- */

export interface InterestsInput {
  interestIds: number[];
}

export interface InterestOption {
  interestId: number;
  interestName: string;
  slug: string;
}

/* -------------------------------------------------------------------------- */
/*                                 Lifestyle                                  */
/* -------------------------------------------------------------------------- */

export interface LifestyleAnswerInput {
  questionId: number;
  optionId: number;
}

export interface LifestyleInput {
  answers: LifestyleAnswerInput[];
}

export interface LifestyleOption {
  optionId: number;
  label: string;
  slug: string;
  displayOrder: number;
}

export interface LifestyleQuestion {
  questionId: number;
  questionText: string;
  slug: string;
  displayOrder: number;
  options: LifestyleOption[];
}

/* -------------------------------------------------------------------------- */
/*                                  Prompts                                   */
/* -------------------------------------------------------------------------- */

export interface PromptAnswerInput {
  promptId: number;
  answer: string;
  displayOrder: number;
}

export interface PromptsInput {
  prompts: PromptAnswerInput[];
}

export interface PromptOption {
  promptId: number;
  promptText: string;
  slug: string;
}

/* -------------------------------------------------------------------------- */
/*                                   Photos                                   */
/* -------------------------------------------------------------------------- */

export interface ProfilePhotoInput {
  mediaId: number;
  photoOrder: number;
  isPrimary: boolean;
}

export interface PhotosInput {
  photos: ProfilePhotoInput[];
}

/* -------------------------------------------------------------------------- */
/*                                  Location                                  */
/* -------------------------------------------------------------------------- */

export interface LocationInput {
  latitude: number;
  longitude: number;
  postcode: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

export interface OnboardingSnapshot {
  profile: BasicProfileInput | null;
  preferences: PreferencesInput | null;
  interestIds: number[];
  lifestyleAnswers: LifestyleAnswerInput[];
  prompts: PromptAnswerInput[];
  photos: ProfilePhotoInput[];
  location: LocationInput | null;
}
