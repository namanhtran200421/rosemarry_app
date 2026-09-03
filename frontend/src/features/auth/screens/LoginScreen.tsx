import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  radii,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { InlineMessage } from "../../../shared/ui/InlineMessage";
import { Screen } from "../../../shared/ui/Screen";
import { useAuthSession } from "../session/AuthSessionProvider";
import type { LoginConnection } from "../types/auth.types";
import { getAuthenticationErrorMessage } from "../utils/auth-error-message";

export function LoginScreen() {
  const { activeConnection, login, startupError } = useAuthSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogin(connection: LoginConnection): Promise<void> {
    if (activeConnection !== null) {
      return;
    }

    setErrorMessage(null);

    try {
      await login(connection);
    } catch (error) {
      setErrorMessage(getAuthenticationErrorMessage("login", error));
    }
  }

  const displayedError = errorMessage ?? startupError;

  return (
    <Screen>
      <View style={styles.brandBlock}>
        <View style={styles.brandMark} accessibilityElementsHidden />
        <Text style={styles.eyebrow}>ROSEMARRY</Text>
        <Text style={styles.title}>Meet with intention.</Text>
        <Text style={styles.description}>
          Sign in to continue to your circles and conversations.
        </Text>
      </View>

      <View style={styles.actions}>
        <AppButton
          label="Continue with phone"
          busy={activeConnection === "phone"}
          disabled={activeConnection !== null}
          onPress={function onPressPhoneLogin() {
            void handleLogin("phone");
          }}
        />

        {displayedError !== null ? (
          <InlineMessage tone="error" message={displayedError} />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandBlock: {
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  brandMark: {
    width: 36,
    height: spacing.sm,
    marginBottom: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    transform: [{ rotate: "-8deg" }],
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    letterSpacing: 2.2,
  },
  title: {
    color: colors.text,
    fontSize: typography.display.fontSize,
    fontWeight: "700",
    lineHeight: typography.display.lineHeight,
    letterSpacing: -0.8,
  },
  description: {
    maxWidth: 330,
    color: colors.textMuted,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  actions: {
    gap: spacing.md,
  },
});
