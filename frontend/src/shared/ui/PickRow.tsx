import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { brut, colors, drop, fonts, radii } from "../theme/tokens";

import { Radio } from "./Radio";

interface PickRowProps {
  label: string;
  sub?: string;
  selected: boolean;
  onPress: () => void;
  /** Replaces the check shown on selected rows. */
  right?: ReactNode;
  disabled?: boolean;
}

/** Compact selectable row for lists of choices inside pages and sheets. */
export function PickRow({
  label,
  sub,
  selected,
  onPress,
  right,
  disabled = false,
}: PickRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: selected ? brut.yellow : brut.white,
          boxShadow: drop(selected ? 4 : 2),
          opacity: disabled ? 0.45 : 1,
        },
      ]}
    >
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </View>
      {right ?? (selected ? <Radio checked /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: radii.sm,
    borderWidth: brut.border,
    borderColor: brut.ink,
  },
  text: {
    flex: 1,
  },
  label: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  sub: {
    marginTop: 2,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
});
