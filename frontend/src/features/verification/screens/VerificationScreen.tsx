import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  brut,
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
import { Icon } from "../../../shared/ui/Icon";
import { IconBlock } from "../../../shared/ui/IconBlock";
import { Screen } from "../../../shared/ui/Screen";
import type { VerificationStatus } from "../api/verification-api";
import type { VerificationPhase } from "../state/verification-state";

interface VerificationScreenProps {
  phase: VerificationPhase;
  status: VerificationStatus | null;
  timedOut: boolean;
  onStart: () => void;
  onRefresh: () => void;
  accountAction: ReactNode;
}

interface ScreenCopy {
  title: string;
  body: string;
  action: string;
  actionType: "start" | "refresh";
}

export function resolveVerificationCopy(
  phase: VerificationPhase,
  status: VerificationStatus | null,
  timedOut: boolean,
): ScreenCopy {
  if (phase === "error") {
    return {
      title: "We couldn't check your verification",
      body: "Check your connection, then ask Rosemarry to check again.",
      action: "Check again",
      actionType: "refresh",
    };
  }

  if (phase === "inReview") {
    return {
      title: "Your details are being reviewed",
      body: "This can take a little longer. You can return later and check the result here.",
      action: "Check again",
      actionType: "refresh",
    };
  }

  if (timedOut) {
    return {
      title: "Still checking",
      body: "Your verification is still processing. Check again in a moment.",
      action: "Check again",
      actionType: "refresh",
    };
  }

  if (status === "PENDING") {
    return {
      title: "Finish verifying your age",
      body: "Please continue to complete your check",
      action: "Start a new check",
      actionType: "start",
    };
  }

  if (status === "REJECTED") {
    return {
      title: "We couldn't confirm your age",
      body: "If your details were captured incorrectly, you can start a new check.",
      action: "Try again",
      actionType: "start",
    };
  }

  if (status === "EXPIRED") {
    return {
      title: "Your verification expired",
      body: "Start a new secure check to continue into Rosemarry.",
      action: "Start again",
      actionType: "start",
    };
  }

  return {
    title: "Verify your age",
    body: "Rosemarry is for adults aged 18 and over. Complete a secure identity check before creating your profile.",
    action: "Verify my age",
    actionType: "start",
  };
}

/** Explains the age check and launches the hosted Didit verification flow. */
export function VerificationScreen({
  phase,
  status,
  timedOut,
  onStart,
  onRefresh,
  accountAction,
}: VerificationScreenProps) {
  const copy = resolveVerificationCopy(phase, status, timedOut);

  return (
    <Screen>
      <View style={styles.content}>
        <IconBlock
          name="Camera"
          color={brut.yellow}
          size={72}
          iconSize={32}
          radius={18}
        />
        <Text accessibilityRole="header" style={styles.title}>
          {copy.title}
        </Text>
        <Text style={styles.body}>{copy.body}</Text>

        <View style={styles.note}>
          <Icon name="Lock" size={18} color={brut.ink} />
          <Text style={styles.noteText}>
            Your check opens securely with our verification partner. Rosemarry
            uses the result to confirm access.
          </Text>
        </View>

        {phase === "error" ? (
          <ErrorMessage message="The verification service couldn't be reached." />
        ) : null}

        <View style={styles.actions}>
          <AppButton
            label={copy.action}
            onPress={copy.actionType === "start" ? onStart : onRefresh}
          />
          {accountAction}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
  },
  title: {
    marginTop: spacing.xl,
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: typography.title.fontSize,
    lineHeight: typography.title.lineHeight,
    textAlign: "center",
  },
  body: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    textAlign: "center",
  },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderWidth: brut.border,
    borderColor: brut.ink,
    borderRadius: 14,
    backgroundColor: brut.white,
  },
  noteText: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: typography.sub.fontSize,
    lineHeight: typography.sub.lineHeight,
  },
  actions: {
    width: "100%",
    gap: spacing.md,
    marginTop: spacing.xxl2,
  },
});
