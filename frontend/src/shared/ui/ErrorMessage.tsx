import { StyleSheet, Text, View } from "react-native";

import { colors, fonts, radii, spacing, typography } from "../theme/tokens";

interface ErrorMessageProps {
  message: string;
}

/** Persistent inline error with an assertive accessibility announcement. */
export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <View
      accessibilityLiveRegion="assertive"
      accessibilityRole="alert"
      style={styles.container}
    >
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderLeftWidth: 3,
    borderRadius: radii.md,
    borderColor: colors.dangerStrong,
    backgroundColor: colors.dangerSurface,
    justifyContent: "center",
  },
  text: {
    color: colors.dangerStrong,
    fontFamily: fonts.regular,
    fontSize: typography.callout.fontSize,
    lineHeight: typography.callout.lineHeight,
  },
});
