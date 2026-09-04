import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";

interface StepCounterProps {
  selected: number;
  max: number;
}

/** Right-aligned "3/5" tally. Turns orange once the limit is reached. */
export function StepCounter({ selected, max }: StepCounterProps) {
  const atLimit = selected >= max;

  return (
    <View style={styles.row}>
      <Text
        accessibilityLabel={`${selected} of ${max} selected`}
        style={[styles.text, atLimit && styles.textAtLimit]}
      >
        {selected}/{max}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: spacing.sm,
  },
  text: {
    color: colors.primaryAccessible,
    fontFamily: fonts.bold,
    fontSize: typography.sub.fontSize,
    lineHeight: typography.sub.lineHeight,
  },
  textAtLimit: {
    color: colors.accentOrange,
  },
});
