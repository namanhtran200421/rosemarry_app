import type { ReactNode } from "react";
import { Pressable } from "react-native";

import {
  brut,
  drop,
  layout,
  motion,
  radii,
} from "../theme/tokens";

type IconButtonVariant = "surface" | "paper" | "yellow" | "ghost";

interface IconButtonProps {
  accessibilityLabel: string;
  onPress: () => void;
  children: ReactNode;
  variant?: IconButtonVariant;
  size?: number;
  rounded?: "square" | "circle";
  /** Hard drop offset for the outlined variants. */
  offset?: number;
  disabled?: boolean;
}

const FILLS: Record<IconButtonVariant, string> = {
  surface: brut.white,
  paper: brut.paper,
  yellow: brut.yellow,
  ghost: "transparent",
};

/** Outlined square or circular icon control, e.g. the back button. */
export function IconButton({
  accessibilityLabel,
  onPress,
  children,
  variant = "surface",
  size = layout.controlHeight,
  rounded = "square",
  offset = 3,
  disabled = false,
}: IconButtonProps) {
  const isGhost = variant === "ghost";
  const resting = isGhost ? 0 : offset;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={size < layout.controlHeight ? 6 : 0}
      onPress={onPress}
      style={({ pressed }) => {
        const shift = pressed && resting > 0 ? motion.pressShift : 0;

        return {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: rounded === "circle" ? radii.pill : radii.block,
          borderWidth: isGhost ? 0 : brut.border,
          borderColor: brut.ink,
          backgroundColor: FILLS[variant],
          boxShadow: drop(resting - shift),
          opacity: disabled ? 0.45 : 1,
          transform: [{ translateX: shift }, { translateY: shift }],
        };
      }}
    >
      {children}
    </Pressable>
  );
}
