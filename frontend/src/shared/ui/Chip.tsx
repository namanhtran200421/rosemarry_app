import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, motion, radii, typography } from "../theme/tokens";

type ChipSize = "sm" | "md";

interface ChipProps {
  label: string;
  selected?: boolean;
  size?: ChipSize;
  onPress: () => void;
  accessibilityHint?: string;
  /** Leading line icon, shown before the label. */
  icon?: ReactNode;
  /** Fills the parent and left-aligns content, for grid layouts. */
  fullWidth?: boolean;
  disabled?: boolean;
}

/** Toggle pill. Selected fills solid brand; unselected is white + hairline. */
export function Chip({
  label,
  selected = false,
  size = "md",
  onPress,
  accessibilityHint,
  icon,
  fullWidth = false,
  disabled = false,
}: ChipProps) {
  const metrics = sizes[size];

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
          paddingHorizontal: metrics.paddingHorizontal,
          opacity: disabled ? 0.45 : 1,
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          transform: [{ scale: pressed ? motion.pressScaleCompact : 1 }],
        },
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text
        style={[
          styles.label,
          {
            fontSize: metrics.fontSize,
            color: selected ? colors.onPrimary : colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const sizes = {
  sm: {
    height: 38,
    paddingHorizontal: 16,
    fontSize: typography.caption.fontSize,
  },
  md: {
    height: 50,
    paddingHorizontal: 20,
    fontSize: typography.callout.fontSize,
  },
} as const;

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderRadius: radii.pill,
  },
  chipFullWidth: {
    width: "100%",
    justifyContent: "flex-start",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: fonts.medium,
  },
});
