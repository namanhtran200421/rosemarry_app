import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors, spacing } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { Chip } from "../../../shared/ui/Chip";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepCounter } from "../components/StepCounter";
import { StepTitle } from "../components/StepTitle";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";

const MAX_INTERESTS = 5;

const INTERESTS: { label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { label: "Photography", icon: "camera" },
  { label: "Shopping", icon: "shopping-bag" },
  { label: "Karaoke", icon: "mic" },
  { label: "Yoga", icon: "sunrise" },
  { label: "Cooking", icon: "coffee" },
  { label: "Tennis", icon: "target" },
  { label: "Run", icon: "activity" },
  { label: "Swimming", icon: "wind" },
  { label: "Art", icon: "edit-3" },
  { label: "Traveling", icon: "send" },
  { label: "Extreme", icon: "zap" },
  { label: "Music", icon: "music" },
  { label: "Drink", icon: "droplet" },
  { label: "Video games", icon: "monitor" },
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
                icon={
                  <Feather
                    name={icon}
                    size={17}
                    color={isSelected ? colors.onPrimary : colors.text}
                  />
                }
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
