import type { ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";

import { colors, layout, motion, radii, shadows } from "../theme/tokens";

type IconButtonVariant = "surface" | "tint" | "ghost";

interface IconButtonProps {
  accessibilityLabel: string;
  onPress: () => void;
  children: ReactNode;
  variant?: IconButtonVariant;
  size?: number;
  rounded?: "square" | "circle";
  disabled?: boolean;
}

/**
 * Rounded-square or circular icon control. The white shadowed square is the
 * signature back control on every onboarding screen.
 */
export function IconButton({
  accessibilityLabel,
  onPress,
  children,
  variant = "surface",
  size = layout.controlHeight,
  rounded = "square",
  disabled = false,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variantStyles[variant],
        {
          width: size,
          height: size,
          borderRadius: rounded === "circle" ? radii.pill : radii.md,
          opacity: disabled ? 0.45 : 1,
          transform: [{ scale: pressed ? motion.pressScaleCompact : 1 }],
        },
      ]}
    >
      {children}
    </Pressable>
  );
}

const variantStyles = StyleSheet.create({
  surface: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    ...shadows.sm,
  },
  tint: {
    backgroundColor: colors.primaryTint,
    borderColor: "transparent",
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
});

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
