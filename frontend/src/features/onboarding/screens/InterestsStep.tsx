import { StyleSheet, View } from "react-native";

import { spacing } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { Chip } from "../../../shared/ui/Chip";
import type { IconName } from "../../../shared/ui/Icon";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepCounter } from "../components/StepCounter";
import { StepTitle } from "../components/StepTitle";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";

const MAX_INTERESTS = 5;

const INTERESTS: { label: string; icon: IconName }[] = [
  { label: "Photography", icon: "Camera" },
  { label: "Shopping", icon: "ShoppingBag" },
  { label: "Karaoke", icon: "Mic" },
  { label: "Yoga", icon: "Flower" },
  { label: "Cooking", icon: "Coffee" },
  { label: "Tennis", icon: "Racket" },
  { label: "Run", icon: "Activity" },
  { label: "Swimming", icon: "Waves" },
  { label: "Art", icon: "Palette" },
  { label: "Traveling", icon: "Plane" },
  { label: "Extreme", icon: "Sparkles" },
  { label: "Music", icon: "Music" },
  { label: "Drink", icon: "Wine" },
  { label: "Video games", icon: "Gamepad" },
];

export function InterestsStep({
  profile,
  update,
  goNext,
  goBack,
  stepNumber,
}: StepScreenProps) {
  const selected = profile.interests;
  const atLimit = selected.length >= MAX_INTERESTS;

  function toggle(label: string): void {
    if (selected.includes(label)) {
      update(
        "interests",
        selected.filter((item) => item !== label),
      );
    } else if (!atLimit) {
      update("interests", [...selected, label]);
    }
  }

  return (
    <OnboardingScreen
      stepNumber={stepNumber}
      totalSteps={TOTAL_STEPS}
      onBack={goBack}
      footer={<AppButton label="Continue" onPress={goNext} />}
    >
      <StepTitle
        title="Your interests"
        subtitle="Select up to 5 of your interests and let everyone know what you're passionate about."
      />
      <StepCounter selected={selected.length} max={MAX_INTERESTS} />
      <View style={styles.grid}>
        {INTERESTS.map(({ label, icon }) => {
          const isSelected = selected.includes(label);

          return (
            <View key={label} style={styles.cell}>
              <Chip
                label={label}
                selected={isSelected}
                disabled={!isSelected && atLimit}
                fullWidth
                icon={icon}
                onPress={() => toggle(label)}
              />
            </View>
          );
        })}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  cell: {
    width: "47%",
    flexGrow: 1,
  },
});
