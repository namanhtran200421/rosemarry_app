import { useEffect, useRef } from "react";
import { StyleSheet, TextInput } from "react-native";

import { colors, fonts } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepTitle } from "../components/StepTitle";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";

export function NameStep({
  profile,
  update,
  goNext,
  goBack,
  stepNumber,
}: StepScreenProps) {
  const inputRef = useRef<TextInput>(null);
  const canContinue = profile.name.trim().length > 0;

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
        <AppButton label="Continue" disabled={!canContinue} onPress={goNext} />
      }
    >
      <StepTitle title="What is your name?" />
      <TextInput
        ref={inputRef}
        accessibilityLabel="Your name"
        autoCapitalize="words"
        autoCorrect={false}
        onChangeText={(value) => update("name", value)}
        onSubmitEditing={() => canContinue && goNext()}
        placeholder="Your name"
        placeholderTextColor={colors.textFaint}
        returnKeyType="next"
        selectionColor={colors.accentOrange}
        style={styles.input}
        value={profile.name}
      />
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
});
