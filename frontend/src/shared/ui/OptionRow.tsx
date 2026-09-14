import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { brut, colors, drop, fonts, radii, typography } from "../theme/tokens";

import type { IconName } from "./Icon";
import { IconBlock } from "./IconBlock";
import { Radio } from "./Radio";

interface OptionRowProps {
  title: string;
  subtitle?: string;
  selected?: boolean;
  onPress: () => void;
  /** Glyph shown in a purple block before the title. */
  icon?: IconName;
  /** Shows the trailing radio. Ignored when `trailing` is supplied. */
  showIndicator?: boolean;
  trailing?: ReactNode;
  disabled?: boolean;
}

/**
 * Selectable list row. The register has a single selected skin: the row
 * fills yellow and steps up to a deeper drop.
 */
export function OptionRow({
  title,
  subtitle,
  selected = false,
  onPress,
  icon,
  showIndicator = true,
  trailing,
  disabled = false,
}: OptionRowProps) {
  const trailingNode =
    trailing ?? (showIndicator ? <Radio checked={selected} /> : null);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.row,
        {
          paddingVertical: subtitle ? 13 : 0,
          backgroundColor: selected ? brut.yellow : brut.white,
          boxShadow: drop(selected ? 4 : 2),
          opacity: disabled ? 0.45 : 1,
        },
      ]}
    >
      {icon ? (
        <IconBlock
          name={icon}
          color={selected ? brut.white : brut.purple}
          iconSize={20}
        />
      ) : null}

      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {trailingNode}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    width: "100%",
    minHeight: 56,
    paddingHorizontal: 16,
    borderRadius: radii.sm,
    borderWidth: brut.border,
    borderColor: brut.ink,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 15.5,
    lineHeight: typography.callout.lineHeight,
  },
  subtitle: {
    marginTop: 2,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 12.5,
    lineHeight: 17,
  },
});
