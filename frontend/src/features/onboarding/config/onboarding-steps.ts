import type { ComponentType } from "react";

import { AgeStep } from "../screens/AgeStep";
import { CirclesStep } from "../screens/CirclesStep";
import { DoneStep } from "../screens/DoneStep";
import { GenderMoreStep } from "../screens/GenderMoreStep";
import { GenderStep } from "../screens/GenderStep";
import { HeightStep } from "../screens/HeightStep";
import { InterestsStep } from "../screens/InterestsStep";
import { LifestyleStep } from "../screens/LifestyleStep";
import { LookingForStep } from "../screens/LookingForStep";
import { NameStep } from "../screens/NameStep";
import { NotificationsStep } from "../screens/NotificationsStep";
import { PhotosStep } from "../screens/PhotosStep";
import { PreferencesStep } from "../screens/PreferencesStep";
import { PromptsStep } from "../screens/PromptsStep";
import type {
  OnboardingStepId,
  StepScreenProps,
} from "../types/onboarding.types";

/** Single registry for resolving an onboarding step to its screen component. */
export const ONBOARDING_STEP_SCREENS: Record<
  OnboardingStepId,
  ComponentType<StepScreenProps>
> = {
  name: NameStep,
  age: AgeStep,
  gender: GenderStep,
  genderMore: GenderMoreStep,
  height: HeightStep,
  photos: PhotosStep,
  interests: InterestsStep,
  lookingFor: LookingForStep,
  lifestyle: LifestyleStep,
  preferences: PreferencesStep,
  prompts: PromptsStep,
  circles: CirclesStep,
  notifications: NotificationsStep,
  done: DoneStep,
};
