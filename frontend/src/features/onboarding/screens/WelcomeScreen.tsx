import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  colors,
  fonts,
  layout,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { BrandMark } from "../../../shared/ui/BrandMark";

interface WelcomeScreenProps {
  onStart: () => void;
  onSignIn: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

/** The sign-up landing screen: brand mark, wordmark, and the way in. */
export function WelcomeScreen({
  onStart,
  onSignIn,
  onOpenTerms,
  onOpenPrivacy,
}: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <BrandMark size={168} />
        <Text style={styles.wordmark}>Rosemarry</Text>
        <Text style={styles.tagline}>Sign up to continue</Text>

        <View style={styles.actions}>
          <AppButton label="Use phone number" onPress={onStart} />
        </View>

        <Pressable
          accessibilityRole="link"
          hitSlop={8}
          onPress={onSignIn}
          style={styles.signIn}
        >
          <Text style={styles.signInLabel}>I have an account</Text>
        </Pressable>
      </View>

      <View style={styles.legal}>
        <Pressable accessibilityRole="link" hitSlop={8} onPress={onOpenTerms}>
          <Text style={styles.legalLabel}>Terms of use</Text>
        </Pressable>
        <Pressable accessibilityRole="link" hitSlop={8} onPress={onOpenPrivacy}>
          <Text style={styles.legalLabel}>Privacy Policy</Text>
        </Pressable>
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
  wordmark: {
    marginTop: -4,
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: -1,
  },
  tagline: {
    marginTop: spacing.sm + 2,
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: typography.h3.fontSize,
  },
  actions: {
    width: "100%",
    marginTop: spacing.xxl,
    gap: 14,
  },
  signIn: {
    marginTop: 18,
  },
  signInLabel: {
    color: colors.link,
    fontFamily: fonts.bold,
    fontSize: typography.callout.fontSize,
    textDecorationLine: "underline",
  },
  legal: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xl,
    paddingBottom: 30,
  },
  legalLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.caption.fontSize,
    textDecorationLine: "underline",
  },
});
