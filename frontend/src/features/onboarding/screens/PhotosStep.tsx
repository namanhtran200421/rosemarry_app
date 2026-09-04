import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  palette,
  radii,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepTitle } from "../components/StepTitle";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";

const SLOT_TINTS = [
  palette.pink300,
  palette.orange300,
  palette.pink100,
  palette.orange400,
  palette.pink500,
  palette.orange100,
];

export function PhotosStep({
  profile,
  update,
  goNext,
  goBack,
  stepNumber,
}: StepScreenProps) {
  const count = profile.photos.filter(Boolean).length;

  function toggle(index: number): void {
    const next = profile.photos.slice();
    next[index] = !next[index];
    update("photos", next);
  }

  return (
    <OnboardingScreen
      stepNumber={stepNumber}
      totalSteps={TOTAL_STEPS}
      onBack={goBack}
      footer={
        <AppButton label="Continue" disabled={count < 2} onPress={goNext} />
      }
    >
      <StepTitle
        title="Add your photos"
        subtitle="Add at least 2 photos to help others get to know you. You can change these anytime."
      />
      <View style={styles.grid}>
        {profile.photos.map((isFilled, index) => (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityLabel={
              isFilled ? `Remove photo ${index + 1}` : `Add photo ${index + 1}`
            }
            onPress={() => toggle(index)}
            style={[
              styles.slot,
              isFilled
                ? { backgroundColor: SLOT_TINTS[index] }
                : styles.slotEmpty,
            ]}
          >
            {isFilled ? (
              <View style={styles.remove}>
                <Feather name="x" size={13} color={colors.surface} />
              </View>
            ) : (
              <View style={styles.add}>
                <Feather name="camera" size={22} color={colors.textFaint} />
                <Feather name="plus" size={16} color={colors.textFaint} />
              </View>
            )}
          </Pressable>
        ))}
      </View>
      <Text style={styles.count}>
        {count}/{profile.photos.length} added
      </Text>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  slot: {
    width: "30%",
    aspectRatio: 0.78,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  slotEmpty: {
    backgroundColor: colors.surfaceSunken,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  add: {
    alignItems: "center",
    gap: spacing.xs,
  },
  remove: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    backgroundColor: colors.overlayScrim,
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    marginTop: spacing.md,
    textAlign: "right",
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.caption.fontSize,
  },
});
