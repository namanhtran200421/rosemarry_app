import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, layout, spacing } from "../../../shared/theme/tokens";
import { BackButton } from "../../../shared/ui/BackButton";

import { ProgressBar } from "./ProgressBar";

interface OnboardingScreenProps {
  children: ReactNode;
  footer?: ReactNode;
  stepNumber?: number | null;
  totalSteps?: number;
  onBack?: (() => void) | null;
  /** Centers the body for the full-bleed moments (notifications, done). */
  centered?: boolean;
}

/**
 * Onboarding chrome: the signature progress bar and back control up top, a
 * scrolling body, and a bottom CTA that stays reachable.
 */
export function OnboardingScreen({
  children,
  footer,
  stepNumber = null,
  totalSteps = 10,
  onBack,
  centered = false,
}: OnboardingScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          {stepNumber !== null ? (
            <View style={styles.progress}>
              <ProgressBar step={stepNumber} total={totalSteps} />
            </View>
          ) : null}
          <View style={styles.headerRow}>
            {onBack ? <BackButton onPress={onBack} /> : null}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[styles.body, centered && styles.bodyCentered]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.flex}
        >
          {children}
        </ScrollView>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingTop: 6,
    paddingHorizontal: layout.screenPadX,
  },
  progress: {
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: layout.controlHeight,
  },
  body: {
    flexGrow: 1,
    paddingTop: spacing.sm,
    paddingHorizontal: layout.screenPadX,
  },
  bodyCentered: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  footer: {
    paddingTop: spacing.lg,
    paddingBottom: 28,
    paddingHorizontal: layout.screenPadX,
  },
});
