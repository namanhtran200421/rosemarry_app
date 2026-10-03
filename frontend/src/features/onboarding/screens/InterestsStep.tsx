import { StyleSheet, View } from "react-native";

import { spacing } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
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
  totalSteps = TOTAL_STEPS,
  catalogs,
  busy,
  error,
}: StepScreenProps) {
  const count = catalogs
    ? profile.interestIds.length
    : profile.interests.length;
  const atLimit = count >= MAX_INTERESTS;

  const options = catalogs
    ? catalogs.interests.map((interest) => ({
        label: interest.interestName,
        id: interest.interestId,
        icon: undefined,
      }))
    : INTERESTS.map((interest) => ({ ...interest, id: null }));

  function toggle(label: string, id: number | null): void {
    if (catalogs && id !== null) {
      const active = profile.interestIds.includes(id);
      if (!active && atLimit) return;
      update(
        "interestIds",
        active
          ? profile.interestIds.filter((value) => value !== id)
          : [...profile.interestIds, id],
      );
      update(
        "interests",
        active
          ? profile.interests.filter((value) => value !== label)
          : [...profile.interests, label],
      );
      return;
    }
    if (profile.interests.includes(label)) {
      update(
        "interests",
        profile.interests.filter((item) => item !== label),
      );
    } else if (!atLimit) {
      update("interests", [...profile.interests, label]);
    }
  }

  return (
    <OnboardingScreen
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      onBack={goBack}
      footer={
        <>
          {error ? <ErrorMessage message={error} /> : null}
          <AppButton label="Continue" onPress={goNext} busy={busy} />
        </>
      }
    >
      <StepTitle
        title="Your interests"
        subtitle="Select up to 5 of your interests and let everyone know what you're passionate about."
      />
      <StepCounter selected={count} max={MAX_INTERESTS} />
      <View style={styles.grid}>
        {options.map(({ label, icon, id }) => {
          const isSelected =
            id === null
              ? profile.interests.includes(label)
              : profile.interestIds.includes(id);

          return (
            <View key={label} style={styles.cell}>
              <Chip
                label={label}
                selected={isSelected}
                disabled={!isSelected && atLimit}
                fullWidth
                icon={icon}
                onPress={() => toggle(label, id)}
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
