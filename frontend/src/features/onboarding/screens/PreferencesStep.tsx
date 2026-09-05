import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { SegmentedControl } from "../../../shared/ui/SegmentedControl";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { Slider } from "../components/Slider";
import { StepTitle } from "../components/StepTitle";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";

const SHOW_ME = [
  { value: "Women", label: "Women" },
  { value: "Men", label: "Men" },
  { value: "Everyone", label: "Everyone" },
];

export function PreferencesStep({
  profile,
  update,
  goNext,
  goBack,
  stepNumber,
}: StepScreenProps) {
  const preferences = profile.preferences;

  function set(patch: Partial<typeof preferences>): void {
    update("preferences", { ...preferences, ...patch });
  }

  return (
    <OnboardingScreen
      stepNumber={stepNumber}
      totalSteps={TOTAL_STEPS}
      onBack={goBack}
      footer={<AppButton label="Continue" onPress={goNext} />}
    >
      <StepTitle
        title="Your basic preferences"
        subtitle="Set who you want to meet. You can fine-tune these later in filters."
      />

      <View style={styles.showMe}>
        <Text style={styles.label}>Show me</Text>
        <SegmentedControl
          accessibilityLabel="Show me"
          options={SHOW_ME}
          value={preferences.showMe}
          onChange={(value) => set({ showMe: value })}
        />
      </View>

      <Slider
        label="Maximum distance"
        unit=" km"
        min={1}
        max={100}
        value={preferences.distance}
        onChange={(distance) => set({ distance })}
      />
      <Slider
        label="Minimum age"
        min={18}
        max={70}
        value={preferences.ageMin}
        onChange={(value) =>
          set({ ageMin: Math.min(value, preferences.ageMax) })
        }
      />
      <Slider
        label="Maximum age"
        min={18}
        max={70}
        value={preferences.ageMax}
        onChange={(value) =>
          set({ ageMax: Math.max(value, preferences.ageMin) })
        }
      />
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  showMe: {
    marginBottom: spacing.xl,
  },
  label: {
    marginBottom: spacing.sm + 2,
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: typography.callout.fontSize,
  },
});
