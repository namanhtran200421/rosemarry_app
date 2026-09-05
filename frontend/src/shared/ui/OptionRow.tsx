import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  layout,
  radii,
  spacing,
  typography,
} from "../theme/tokens";

import { Radio } from "./Radio";

type OptionRowSelectedStyle = "fill" | "tint";

interface OptionRowProps {
  title: string;
  subtitle?: string;
  selected?: boolean;
  selectedStyle?: OptionRowSelectedStyle;
  onPress: () => void;
  leadingIcon?: ReactNode;
  showIndicator?: boolean;
}

/**
 * Selectable list row with two selection skins: `fill` turns the row solid
 * brand, `tint` uses a brand-tinted background with a ring and a check. Use
 * fill for compact single-line choices, tint for rows carrying a subtitle.
 */
export function OptionRow({
  title,
  subtitle,
  selected = false,
  selectedStyle = "tint",
  onPress,
  leadingIcon,
  showIndicator = true,
}: OptionRowProps) {
  const isFilled = selectedStyle === "fill" && selected;
  const isTinted = selectedStyle === "tint" && selected;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.row,
        {
          paddingVertical: subtitle ? 14 : 0,
          backgroundColor: isFilled
            ? colors.primary
            : isTinted
              ? colors.surfaceTint
              : colors.surface,
          borderColor: isFilled
            ? colors.primary
            : isTinted
              ? colors.selectedRing
              : colors.border,
          borderWidth: isTinted ? 1.5 : 1,
        },
      ]}
    >
      {leadingIcon ? <View style={styles.icon}>{leadingIcon}</View> : null}

      <View style={styles.text}>
        <Text
          style={[
            styles.title,
            { color: isFilled ? colors.onPrimary : colors.text },
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              { color: isFilled ? colors.primaryTint : colors.textSecondary },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {showIndicator ? <Radio checked={selected} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    width: "100%",
    minHeight: layout.fieldHeight,
    paddingHorizontal: 18,
    borderRadius: radii.md,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: typography.callout.fontSize,
    lineHeight: typography.callout.lineHeight,
  },
  subtitle: {
    marginTop: spacing.xs / 2,
    fontFamily: fonts.regular,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
});
