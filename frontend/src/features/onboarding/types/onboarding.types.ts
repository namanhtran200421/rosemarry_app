import type {
  GenderOption,
  InterestOption,
  LifestyleQuestion,
  OwnedMedia,
  PromptOption,
} from "../api/onboarding-api";

/** Step identifiers in the order the design's sign-up flow presents them. */
export type OnboardingStepId =
  | "name"
  | "age"
  | "gender"
  | "genderMore"
  | "height"
  | "photos"
  | "interests"
  | "lookingFor"
  | "lifestyle"
  | "preferences"
  | "prompts"
  | "circles"
  | "notifications"
  | "location"
  | "done";

export interface OnboardingCatalogs {
  genders: GenderOption[];
  interests: InterestOption[];
  lifestyle: LifestyleQuestion[];
  prompts: PromptOption[];
  media: OwnedMedia[];
}

interface OnboardingPreferences {
  showMe: string;
  ageMin: number;
  ageMax: number;
  distance: number;
}

export interface OnboardingProfile {
  name: string;
  bio: string;
  dateOfBirth: string;
  gender: string;
  genderId: number | null;
  height: string;
  photos: boolean[];
  interests: string[];
  interestIds: number[];
  lookingFor: string;
  lifestyle: Record<string, string>;
  lifestyleAnswers: Record<number, number>;
  preferences: OnboardingPreferences;
  preferredGenderIds: number[];
  prompts: Record<string, string>;
  promptAnswers: Record<number, string>;
  promptOrder: number[];
  mediaIds: number[];
  mediaUrls: string[];
  location: {
    latitude: string;
    longitude: string;
    postcode: string;
    city: string;
    state: string;
    country: string;
  };
}

/** The ten numbered steps. `circles`, `notifications` and `done` sit outside. */
export const NUMBERED_STEPS: OnboardingStepId[] = [
  "name",
  "age",
  "gender",
  "height",
  "photos",
  "interests",
  "lookingFor",
  "lifestyle",
  "preferences",
  "prompts",
];

export const TOTAL_STEPS = NUMBERED_STEPS.length;

export const EMPTY_PROFILE: OnboardingProfile = {
  name: "",
  bio: "",
  dateOfBirth: "",
  gender: "",
  genderId: null,
  height: "5'8",
  photos: [false, false, false, false, false, false],
  interests: [],
  interestIds: [],
  lookingFor: "",
  lifestyle: {},
  lifestyleAnswers: {},
  preferences: { showMe: "Everyone", ageMin: 24, ageMax: 35, distance: 50 },
  preferredGenderIds: [],
  prompts: {},
  promptAnswers: {},
  promptOrder: [],
  mediaIds: [],
  mediaUrls: [],
  location: {
    latitude: "",
    longitude: "",
    postcode: "",
    city: "",
    state: "",
    country: "",
  },
};

/** Props every step screen receives from the flow orchestrator. */
export interface StepScreenProps {
  profile: OnboardingProfile;
  update: <K extends keyof OnboardingProfile>(
    key: K,
    value: OnboardingProfile[K],
  ) => void;
  goNext: () => void;
  /** Jumps to a branch step that sits outside the linear order. */
  goTo: (step: OnboardingStepId) => void;
  goBack: (() => void) | null;
  stepNumber: number | null;
  totalSteps?: number;
  busy?: boolean;
  error?: string | null;
  catalogs?: OnboardingCatalogs;
  onRefreshMedia?: () => void;
}
