import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../theme/tokens";

interface InlineMessageProps {
  message: string;
  tone: "error";
}

export function InlineMessage({ message, tone: _tone }: InlineMessageProps) {
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
    borderRadius: radii.sm,
    borderColor: colors.danger,
    backgroundColor: colors.dangerSurface,
    justifyContent: "center",
  },
  text: {
    color: colors.danger,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
});
