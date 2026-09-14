import type { PropsWithChildren } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";

import { brut, drop } from "../theme/tokens";

export interface CardProps extends PropsWithChildren {
  /** Block fill. Defaults to white. */
  color?: string;
  radius?: number;
  /** Offset of the hard drop; 0 renders a flat outlined block. */
  offset?: number;
  borderWidth?: number;
  dashed?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Outlined surface with a hard offset shadow — the base brutalist block. */
export function Card({
  children,
  color = brut.white,
  radius = 14,
  offset = 4,
  borderWidth = brut.border,
  dashed = false,
  style,
}: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: color,
          borderRadius: radius,
          borderWidth,
          borderColor: brut.ink,
          borderStyle: dashed ? "dashed" : "solid",
          boxShadow: drop(offset),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
