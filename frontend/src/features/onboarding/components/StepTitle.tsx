import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";

interface StepTitleProps {
  title: string;
  subtitle?: string;
}

/** Onboarding headings are literal questions with a brief reassuring subtitle. */
export function StepTitle({ title, subtitle }: StepTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: typography.display.fontSize,
    lineHeight: 34,
    letterSpacing: typography.display.letterSpacing,
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.callout.fontSize,
    lineHeight: typography.callout.lineHeight,
  },
});
