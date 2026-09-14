import { View } from "react-native";

import { brut, onBlock } from "../theme/tokens";

import { Icon, type IconName } from "./Icon";

interface IconBlockProps {
  name: IconName;
  color?: string;
  size?: number;
  iconSize?: number;
  radius?: number;
  dashed?: boolean;
  iconColor?: string;
}

/** A small outlined colour block carrying one glyph, used as a row lead-in. */
export function IconBlock({
  name,
  color = brut.purple,
  size = 36,
  iconSize = Math.round(size * 0.5),
  radius = 10,
  dashed = false,
  iconColor = onBlock(color),
}: IconBlockProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        borderWidth: brut.borderThin,
        borderColor: brut.ink,
        borderStyle: dashed ? "dashed" : "solid",
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={name} size={iconSize} color={iconColor} />
    </View>
  );
}
