import { Pressable, StyleSheet, Text } from "react-native";

import { brut, drop, fonts, radii } from "../theme/tokens";

import { Icon, type IconName } from "./Icon";

type ChipSize = "sm" | "md";

interface ChipProps {
  label: string;
  selected?: boolean;
  size?: ChipSize;
  onPress: () => void;
  accessibilityHint?: string;
  /** Leading line icon, shown before the label. */
  icon?: IconName;
  /** Shows a trailing ✕ on selected chips that can be removed. */
  removable?: boolean;
  /** Fills the parent and left-aligns content, for grid layouts. */
  fullWidth?: boolean;
  disabled?: boolean;
}

/** Toggle pill. Selected fills yellow and gains a drop; unselected is white. */
export function Chip({
  label,
  selected = false,
  size = "md",
  onPress,
  accessibilityHint,
  icon,
  removable = false,
  fullWidth = false,
  disabled = false,
}: ChipProps) {
  const metrics = SIZES[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        fullWidth && styles.chipFullWidth,
        {
          height: metrics.height,
          paddingLeft: icon ? 14 : 17,
          paddingRight: 17,
          opacity: disabled ? 0.45 : 1,
          backgroundColor: selected ? brut.yellow : brut.white,
          boxShadow: drop(selected && !pressed ? 3 : 0),
        },
      ]}
    >
      {icon ? <Icon name={icon} size={17} /> : null}
      <Text numberOfLines={1} style={[styles.label, { fontSize: metrics.fontSize }]}>
        {label}
      </Text>
      {removable && selected ? <Icon name="X" size={14} /> : null}
    </Pressable>
  );
}

const SIZES = {
  sm: { height: 40, fontSize: 13 },
  md: { height: 48, fontSize: 14.5 },
} as const;

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    borderRadius: radii.pill,
  },
  chipFullWidth: {
    width: "100%",
    justifyContent: "flex-start",
  },
  label: {
    flexShrink: 1,
    color: brut.ink,
    fontFamily: fonts.bold,
  },
});
