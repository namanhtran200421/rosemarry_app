import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { BrandMark } from "../../../shared/ui/BrandMark";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
import { OnboardingScreen } from "../components/OnboardingScreen";
import type { StepScreenProps } from "../types/onboarding.types";

export function DoneStep({
  goNext,
  goBack,
  busy,
  error,
  catalogs,
}: StepScreenProps) {
  return (
    <OnboardingScreen
      centered
      onBack={goBack}
      footer={
        <>
          {error ? <ErrorMessage message={error} /> : null}
          <AppButton
            label={catalogs ? "Finish setup" : "Start exploring"}
            onPress={goNext}
            busy={busy}
          />
        </>
      }
    >
      <BrandMark size={130} />
      <Text style={styles.wordmark}>Rosemarry</Text>
      <View style={styles.copy}>
        <Text style={styles.title}>
          {catalogs ? "Ready to finish" : "You’re all set!"}
        </Text>
        <Text style={styles.subtitle}>
          {catalogs
            ? "Confirm your setup to start exploring."
            : "Time to meet someone special."}
        </Text>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  wordmark: {
    marginTop: spacing.sm,
    color: colors.link,
    fontFamily: fonts.bold,
    fontSize: 40,
    letterSpacing: -0.8,
  },
  copy: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: typography.h2.fontSize,
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.callout.fontSize,
  },
});
