import { useEffect, useRef } from "react";
import { StyleSheet, Text, TextInput } from "react-native";

import {
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepTitle } from "../components/StepTitle";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";
import { ageFromDateOfBirth } from "../utils/basic-profile";

export function AgeStep({
  profile,
  update,
  goNext,
  goBack,
  stepNumber,
  totalSteps = TOTAL_STEPS,
}: StepScreenProps) {
  const inputRef = useRef<TextInput>(null);
  const age = ageFromDateOfBirth(profile.dateOfBirth);
  const isValid = age !== null && age >= 18 && age < 120;
  const showError = profile.dateOfBirth.length === 10 && !isValid;

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <OnboardingScreen
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      onBack={goBack}
      footer={
        <AppButton label="Continue" disabled={!isValid} onPress={goNext} />
      }
    >
      <StepTitle
        title="When were you born?"
        subtitle="Enter your date of birth as YYYY-MM-DD. You must be at least 18; only your age is shown on your profile."
      />
      <TextInput
        ref={inputRef}
        accessibilityLabel="Date of birth"
        inputMode="numeric"
        keyboardType="number-pad"
        onChangeText={(value) => {
          const digits = value.replace(/\D/g, "").slice(0, 8);
          const formatted = [
            digits.slice(0, 4),
            digits.slice(4, 6),
            digits.slice(6, 8),
          ]
            .filter(Boolean)
            .join("-");
          update("dateOfBirth", formatted);
        }}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={colors.textFaint}
        selectionColor={colors.accentOrange}
        style={styles.input}
        value={profile.dateOfBirth}
      />
      {showError ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {age !== null && age < 18
            ? "You must be 18 or older to join."
            : "Please enter a valid date of birth."}
        </Text>
      ) : null}
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  input: {
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 28,
    paddingVertical: 4,
  },
  error: {
    marginTop: spacing.md,
    color: colors.dangerStrong,
    fontFamily: fonts.regular,
    fontSize: typography.sub.fontSize,
    lineHeight: typography.sub.lineHeight,
  },
});
