export type OnboardingStage =
  | "BASIC_PROFILE"
  | "PREFERENCES"
  | "INTERESTS"
  | "LIFESTYLE"
  | "PROMPTS"
  | "PHOTOS"
  | "LOCATION"
  | "VERIFICATION"
  | "COMPLETE";

export interface OnboardingState {
  stage: OnboardingStage;
  completedAt: string | null;
}

export interface BasicProfileInput {
  displayName: string;
  dateOfBirth: string;
  genderId: number | null;
  bio: string | null;
  datingGoal:
    | "LONG_TERM_RELATIONSHIP"
    | "SHORT_TERM_RELATIONSHIP"
    | "CASUAL_DATING"
    | "NEW_FRIENDS"
    | "NOT_SURE_YET"
    | null;
  heightCm: number | null;
}

export interface GenderOption {
  genderId: number;
  genderName: string;
}
export interface InterestOption {
  interestId: number;
  interestName: string;
  slug: string;
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
export interface PromptOption {
  promptId: number;
  promptText: string;
  slug: string;
}
export interface OwnedMedia {
  mediaId: number;
  mediaUrl: string;
}

export interface PreferencesInput {
  minAge: number;
  maxAge: number;
  maxDistanceKm: number;
  preferredGenderIds: number[];
}
export interface InterestsInput {
  interestIds: number[];
}
export interface LifestyleInput {
  answers: { questionId: number; optionId: number }[];
}
export interface PromptsInput {
  prompts: { promptId: number; answer: string; displayOrder: number }[];
}
export interface PhotosInput {
  photos: { mediaId: number; photoOrder: number; isPrimary: boolean }[];
}
export interface LocationInput {
  postcode: string | null;
  city: string;
  state: string | null;
  country: string;
}

export interface OnboardingSnapshot {
  profile: BasicProfileInput | null;
  preferences: PreferencesInput | null;
  interestIds: number[];
  lifestyleAnswers: LifestyleInput["answers"];
  prompts: PromptsInput["prompts"];
  photos: PhotosInput["photos"];
  location: LocationInput | null;
}
