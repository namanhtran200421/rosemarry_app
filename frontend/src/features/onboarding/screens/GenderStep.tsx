import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { OptionRow } from "../../../shared/ui/OptionRow";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepTitle } from "../components/StepTitle";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";

const GENDERS = ["Woman", "Man", "Non-binary", "Prefer not to say"];

export function GenderStep({
  profile,
  update,
  goNext,
  goTo,
  goBack,
  stepNumber,
}: StepScreenProps) {
  return (
    <OnboardingScreen
      stepNumber={stepNumber}
      totalSteps={TOTAL_STEPS}
      onBack={goBack}
      footer={
        <AppButton
          label="Continue"
          disabled={profile.gender.length === 0}
          onPress={goNext}
        />
      }
    >
      <StepTitle title="What is your gender?" />
      <View style={styles.list}>
        {GENDERS.map((gender) => (
          <OptionRow
            key={gender}
            title={gender}
            selected={profile.gender === gender}
            selectedStyle="fill"
            showIndicator={false}
            onPress={() => update("gender", gender)}
          />
        ))}
      </View>

      <Pressable
        accessibilityRole="link"
        hitSlop={8}
        onPress={() => goTo("genderMore")}
        style={styles.moreLink}
      >
        <Text style={styles.moreLabel}>Choose another gender</Text>
      </Pressable>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  moreLink: {
    alignSelf: "flex-start",
    marginTop: spacing.lg,
  },
  moreLabel: {
    color: colors.link,
    fontFamily: fonts.semibold,
    fontSize: typography.sub.fontSize,
    textDecorationLine: "underline",
  },
});
