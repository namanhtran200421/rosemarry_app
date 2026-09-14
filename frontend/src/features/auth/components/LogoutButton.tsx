import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  brut,
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { CenterModal } from "../../../shared/ui/CenterModal";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
import { IconBlock } from "../../../shared/ui/IconBlock";
import { useAuthSession } from "../session/AuthSessionContext";
import { getAuthenticationErrorMessage } from "../utils/auth-error-message";

export function LogoutButton() {
  const { logout, status } = useAuthSession();
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isLoggingOut = status === "logging-out";

  function openConfirmation(): void {
    setErrorMessage(null);
    setIsConfirmationVisible(true);
  }

  function closeConfirmation(): void {
    if (isLoggingOut) {
      return;
    }

    setErrorMessage(null);
    setIsConfirmationVisible(false);
  }

  async function handleLogout(): Promise<void> {
    if (isLoggingOut) {
      return;
    }

    setErrorMessage(null);

    try {
      await logout();
    } catch (error) {
      setErrorMessage(getAuthenticationErrorMessage("logout", error));
    }
  }

  return (
    <View>
      <AppButton label="Log out" intent="danger" onPress={openConfirmation} />

      <CenterModal
        visible={isConfirmationVisible}
        dismissible={!isLoggingOut}
        onClose={closeConfirmation}
      >
        <IconBlock name="LogOut" color={brut.pink} size={48} iconSize={24} />
        <Text accessibilityRole="header" style={styles.title}>
          Log out?
        </Text>
        <Text style={styles.description}>
          Are you sure you want to log out of Rosemarry?
        </Text>

        {errorMessage !== null ? <ErrorMessage message={errorMessage} /> : null}

        <View style={styles.actions}>
          <AppButton
            label="Cancel"
            intent="neutral"
            size="md"
            disabled={isLoggingOut}
            onPress={closeConfirmation}
            style={styles.action}
          />
          <AppButton
            label="Log out"
            intent="danger"
            size="md"
            busy={isLoggingOut}
            onPress={function onPressConfirmLogout() {
              void handleLogout();
            }}
            style={styles.action}
          />
        </View>
      </CenterModal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.lg,
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: typography.h2.fontSize,
    lineHeight: typography.h2.lineHeight,
    textAlign: "center",
  },
  description: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.callout.fontSize,
    lineHeight: typography.callout.lineHeight,
    textAlign: "center",
  },
  actions: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  action: {
    flex: 1,
  },
});
