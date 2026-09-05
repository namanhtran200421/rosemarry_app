import { AppButton } from "../../../shared/ui/AppButton";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepTitle } from "../components/StepTitle";
import { WheelPicker } from "../components/WheelPicker";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";

const HEIGHTS = (() => {
  const values: string[] = [];
  for (let feet = 5; feet <= 6; feet += 1) {
    const maxInches = feet === 6 ? 5 : 11;
    for (let inches = 0; inches <= maxInches; inches += 1) {
      values.push(`${feet}'${inches}`);
    }
  }
  return values;
})();

export function HeightStep({
  profile,
  update,
  goNext,
  goBack,
  stepNumber,
}: StepScreenProps) {
  const index = Math.max(0, HEIGHTS.indexOf(profile.height));

  return (
    <OnboardingScreen
      stepNumber={stepNumber}
      totalSteps={TOTAL_STEPS}
      onBack={goBack}
      footer={<AppButton label="Continue" onPress={goNext} />}
    >
      <StepTitle
        title="What's your height?"
        subtitle="This helps match you better"
      />
      <WheelPicker
        label="Your height"
        values={HEIGHTS}
        index={index}
        onIndex={(next) => update("height", HEIGHTS[next])}
      />
    </OnboardingScreen>
  );
}
