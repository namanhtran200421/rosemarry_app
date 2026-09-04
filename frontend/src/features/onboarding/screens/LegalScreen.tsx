import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { OnboardingScreen } from "../components/OnboardingScreen";

import type { LegalDocument } from "./legal-content";

interface LegalScreenProps {
  document: LegalDocument;
  onBack: () => void;
}

/** Scrollable legal document with the onboarding back control. */
export function LegalScreen({ document, onBack }: LegalScreenProps) {
  return (
    <OnboardingScreen onBack={onBack}>
      <Text style={styles.title}>{document.title}</Text>
      <Text style={styles.meta}>
        Last updated June 2026 · Placeholder text pending review
      </Text>
      <Text style={styles.intro}>{document.intro}</Text>

      {document.sections.map(({ heading, body }, index) => (
        <View key={heading} style={styles.section}>
          <Text style={styles.heading}>
            {index + 1}. {heading}
          </Text>
          <Text style={styles.body}>{body}</Text>
        </View>
      ))}
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: typography.title.fontSize,
    lineHeight: 32,
    letterSpacing: typography.title.letterSpacing,
    marginBottom: spacing.xs + 2,
  },
  meta: {
    color: colors.textFaint,
    fontFamily: fonts.regular,
    fontSize: typography.micro.fontSize,
    marginBottom: 18,
  },
  intro: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.sub.fontSize,
    lineHeight: 23,
    marginBottom: spacing.xl2,
  },
  section: {
    marginBottom: spacing.xl2,
  },
  heading: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: typography.h3.fontSize,
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.sub.fontSize,
    lineHeight: 23,
  },
});
