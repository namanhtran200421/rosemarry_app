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
  | "done";

interface OnboardingPreferences {
  showMe: string;
  ageMin: number;
  ageMax: number;
  distance: number;
}

export interface OnboardingProfile {
  name: string;
  age: string;
  gender: string;
  height: string;
  photos: boolean[];
  interests: string[];
  lookingFor: string;
  lifestyle: Record<string, string>;
  preferences: OnboardingPreferences;
  prompts: Record<string, string>;
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
  age: "",
  gender: "",
  height: "5'8",
  photos: [false, false, false, false, false, false],
  interests: [],
  lookingFor: "",
  lifestyle: {},
  preferences: { showMe: "Everyone", ageMin: 24, ageMax: 35, distance: 50 },
  prompts: {},
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
}
