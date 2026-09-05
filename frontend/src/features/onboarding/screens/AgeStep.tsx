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

export function AgeStep({
  profile,
  update,
  goNext,
  goBack,
  stepNumber,
}: StepScreenProps) {
  const inputRef = useRef<TextInput>(null);
  const age = Number(profile.age);
  const isValid = age >= 18 && age < 120;
  const showError = profile.age.length > 0 && !isValid;

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <OnboardingScreen
      stepNumber={stepNumber}
      totalSteps={TOTAL_STEPS}
      onBack={goBack}
      footer={
        <AppButton label="Continue" disabled={!isValid} onPress={goNext} />
      }
    >
      <StepTitle
        title="How old are you?"
        subtitle="You must be at least 18. Your age is shown on your profile."
      />
      <TextInput
        ref={inputRef}
        accessibilityLabel="Your age"
        inputMode="numeric"
        keyboardType="number-pad"
        onChangeText={(value) =>
          update("age", value.replace(/\D/g, "").slice(0, 3))
        }
        placeholder="Your age"
        placeholderTextColor={colors.textFaint}
        selectionColor={colors.accentOrange}
        style={styles.input}
        value={profile.age}
      />
      {showError ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {age < 18
            ? "You must be 18 or older to join."
            : "Please enter a valid age."}
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
