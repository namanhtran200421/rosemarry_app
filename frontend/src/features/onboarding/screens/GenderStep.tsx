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
  catalogs,
  totalSteps = TOTAL_STEPS,
}: StepScreenProps) {
  const options: { label: string; id: number | null }[] =
    catalogs?.genders.map((gender) => ({
      label: gender.genderName,
      id: gender.genderId,
    })) ?? GENDERS.map((label) => ({ label, id: null }));
  if (
    catalogs &&
    !options.some((option) => option.label === "Prefer not to say")
  ) {
    options.push({ label: "Prefer not to say", id: null });
  }
  return (
    <OnboardingScreen
      stepNumber={stepNumber}
      totalSteps={totalSteps}
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
        {options.map(({ label, id }) => (
          <OptionRow
            key={label}
            title={label}
            selected={profile.gender === label}
            showIndicator={false}
            onPress={() => {
              update("gender", label);
              update("genderId", id);
            }}
          />
        ))}
      </View>

      {!catalogs ? (
        <Pressable
          accessibilityRole="link"
          hitSlop={8}
          onPress={() => goTo("genderMore")}
          style={styles.moreLink}
        >
          <Text style={styles.moreLabel}>Choose another gender</Text>
        </Pressable>
      ) : null}
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
