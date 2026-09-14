import { StyleSheet, Text, View } from "react-native";

import { brut, colors, fonts, radii, typography } from "../theme/tokens";

import { Icon } from "./Icon";

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
      <Icon name="X" size={16} color={colors.dangerStrong} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 48,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radii.sm,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: colors.dangerSurface,
  },
  text: {
    flex: 1,
    color: colors.dangerStrong,
    fontFamily: fonts.medium,
    fontSize: typography.callout.fontSize,
    lineHeight: typography.callout.lineHeight,
  },
});
