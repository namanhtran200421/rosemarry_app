import { type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";

import {
  brut,
  drop,
  fonts,
  onBlock,
  radii,
  typography,
} from "../theme/tokens";

import { Icon, type IconName } from "./Icon";

interface TagProps {
  label: string;
  color?: string;
  /** Offset of a small hard drop; tags usually sit flat. */
  offset?: number;
  icon?: IconName;
  pill?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Tiny uppercase label on a highlight block ("MESSAGE WITHIN 48H"). */
export function Tag({
  label,
  color = brut.white,
  offset = 0,
  icon,
  pill = false,
  style,
}: TagProps) {
  const textColor = onBlock(color);

  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: color,
          boxShadow: drop(offset),
          borderRadius: pill ? radii.pill : radii.tag,
        },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={12} color={textColor} /> : null}
      <Text style={[styles.label, { color: textColor }]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

interface CountTagProps {
  count: number;
  max: number;
}

/** "3/5" tally. Green while there is room, yellow once the cap is reached. */
export function CountTag({ count, max }: CountTagProps) {
  const atLimit = count >= max;

  return (
    <View
      accessibilityLabel={`${count} of ${max} selected`}
      accessible
      style={[
        styles.counter,
        { backgroundColor: atLimit ? brut.yellow : brut.green },
      ]}
    >
      <Text style={styles.counterLabel}>
        {count}/{max}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
  },
  label: {
    fontFamily: fonts.bold,
    ...typography.tag,
  },
  counter: {
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.tag,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
  },
  counterLabel: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
});
