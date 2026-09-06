import { Feather, FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
import { useAuthSession } from "../session/AuthSessionContext";
import {
  getAuthenticationErrorMessage,
  isAuthenticationCancellation,
} from "../utils/auth-error-message";

interface AdditionalSignInOptionsProps {
  /** Stops these actions while another form on the screen is being submitted. */
  disabled?: boolean;
  /** Opens Rosemarry's native email login and account-creation screen. */
  onContinueWithEmail: () => void;
}

/**
 * Shows the Google and native email sign-in choices.
 *
 * Google opens Auth0's secure page. Email navigates to Rosemarry's own form.
 * The same component is shared by the welcome and phone screens to keep
 * loading, error, and accessibility behavior consistent.
 *
 * @param props - Optional state supplied by the screen containing the choices.
 * @returns The provider buttons, their divider, and any sign-in error.
 */
export function AdditionalSignInOptions({
  disabled = false,
  onContinueWithEmail,
}: AdditionalSignInOptionsProps) {
  const { signInWithGoogle, startupError, status } = useAuthSession();
  const [requestError, setRequestError] = useState<string | null>(null);
  const isSigningIn = status === "signing-in";
  const isUnavailable = disabled || status !== "unauthenticated";

  /**
   * Opens Google login and reports recoverable failures inline.
   *
   * @returns A promise that completes when Auth0 closes or login finishes.
   */
  async function handleGoogleSignIn(): Promise<void> {
    if (isUnavailable) {
      return;
    }

    setRequestError(null);

    try {
      await signInWithGoogle();
    } catch (error) {
      // Closing Auth0 is an expected user choice, so it does not show an error.
      if (!isAuthenticationCancellation(error)) {
        setRequestError(getAuthenticationErrorMessage("sign-in", error));
      }
    }
  }

  const displayedError = requestError ?? startupError;

  return (
    <View style={styles.container}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.divider}
      >
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <AppButton
        label="Continue with Google"
        intent="neutral"
        leadingIcon={
          <FontAwesome name="google" size={18} color={colors.text} />
        }
        busy={isSigningIn}
        disabled={isUnavailable}
        accessibilityHint="Signs in securely using your Google account"
        onPress={function onPressGoogle() {
          void handleGoogleSignIn();
        }}
      />

      <AppButton
        label="Continue with email"
        intent="neutral"
        leadingIcon={<Feather name="mail" size={19} color={colors.text} />}
        disabled={isUnavailable}
        accessibilityHint="Opens Rosemarry's email login and account creation screen"
        onPress={onContinueWithEmail}
      />

      {displayedError !== null ? (
        <ErrorMessage message={displayedError} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  divider: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  dividerLine: {
    height: StyleSheet.hairlineWidth,
    flex: 1,
    backgroundColor: colors.borderStrong,
  },
  dividerText: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: typography.sub.fontSize,
    lineHeight: typography.sub.lineHeight,
  },
});
