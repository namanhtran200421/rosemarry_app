import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts, radii, typography } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { OnboardingScreen } from "../components/OnboardingScreen";
import type { StepScreenProps } from "../types/onboarding.types";

/**
 * Asking for the real OS permission needs `expo-notifications`; until that is
 * added this screen states the value and advances.
 */
export function NotificationsStep({ goNext, goBack }: StepScreenProps) {
  return (
    <OnboardingScreen
      centered
      onBack={goBack}
      footer={<AppButton label="Enable notification" onPress={goNext} />}
    >
      <View style={styles.illustration}>
        <Feather name="bell" size={58} color={colors.primaryAccessible} />
      </View>
      <Text style={styles.copy}>
        Get push-notification when you get the match or receive a message.
      </Text>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  illustration: {
    width: 132,
    height: 132,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  copy: {
    maxWidth: 280,
    textAlign: "center",
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.callout.fontSize,
    lineHeight: typography.callout.lineHeight,
  },
});
