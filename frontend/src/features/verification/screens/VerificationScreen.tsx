import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  colors,
  fonts,
  layout,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import type {
  VerificationPhase,
} from "../hooks/UseVerificationFlow";

import type { VerificationStatus } from "../api/verification-api"

interface VerificationScreenProps {
  phase: VerificationPhase;
  status: VerificationStatus | null;
  /** True once polling stopped waiting. The check is still running. */
  timedOut: boolean;
  onStart: () => void;
  onRefresh: () => void;
}

interface ScreenCopy {
  title: string;
  body: string;
  action: string;
  /** Retry starts a new session; refresh only re-reads the existing one. */
  restarts: boolean;
}

/**
 * Chooses copy for the current state.
 *
 * A null status means the user has never attempted verification, which reads
 * very differently from having been declined — worth keeping apart even though
 * both offer the same button.
 */
function resolveCopy(
  phase: VerificationPhase,
  status: VerificationStatus | null,
  timedOut: boolean,
): ScreenCopy {
  if (phase === "error") {
    return {
      title: "Something went wrong",
      body: "We couldn't reach the verification service. Check your connection and try again.",
      action: "Try again",
      restarts: true,
    };
  }

  if (phase === "inReview") {
    return {
      title: "We're reviewing your details",
      body: "Someone is checking your document. This usually takes a few hours, and we'll let you know as soon as it's done. You can close the app.",
      action: "Check again",
      restarts: false,
    };
  }

  if (timedOut) {
    return {
      title: "Still checking",
      body: "This is taking longer than usual. Your verification is still running and we'll let you know when it's finished.",
      action: "Check again",
      restarts: false,
    };
  }

  if (status === "REJECTED") {
    return {
      title: "We couldn't confirm your age",
      body: "Rosemarry is only for people aged 18 and over. If you think this is wrong, try again or get in touch with support.",
      action: "Try again",
      restarts: true,
    };
  }

  if (status === "EXPIRED") {
    return {
      title: "That check expired",
      body: "Your verification wasn't finished in time. Starting a new one only takes a moment.",
      action: "Start again",
      restarts: true,
    };
  }

  return {
    title: "Verify your age",
    body: "Rosemarry is for people aged 18 and over. Take a quick selfie to confirm — most people are done in under a minute.",
    action: "Get started",
    restarts: true,
  };
}

/** Age verification: explains what is needed and opens the hosted flow. */
export function VerificationScreen({
  phase,
  status,
  timedOut,
  onStart,
  onRefresh,
}: VerificationScreenProps) {
  const copy = resolveCopy(phase, status, timedOut);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.body}>{copy.body}</Text>

        <View style={styles.actions}>
          <AppButton
            label={copy.action}
            onPress={copy.restarts ? onStart : onRefresh}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: layout.contentMaxWidth,
    alignSelf: "center",
    paddingHorizontal: 28,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: typography.h2.fontSize,
    textAlign: "center",
  },
  body: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.fontSize * 1.5,
    textAlign: "center",
  },
  actions: {
    width: "100%",
    marginTop: spacing.xxl,
    gap: 14,
  },
});
