import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { brut, colors, drop, fonts, onBlock, radii } from "../theme/tokens";

import { Icon, type IconName } from "./Icon";

interface EmptyStateProps {
  icon: IconName;
  title: string;
  body: string;
  color?: string;
  /** Optional actions rendered under the copy. */
  children?: ReactNode;
}

/** Centered block-circle glyph with a short title and reassuring line. */
export function EmptyState({
  icon,
  title,
  body,
  color = brut.pink,
  children,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Icon name={icon} size={34} color={onBlock(color)} />
      </View>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.body}>{body}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 36,
    paddingVertical: 24,
  },
  badge: {
    width: 76,
    height: 76,
    borderRadius: radii.pill,
    borderWidth: brut.border,
    borderColor: brut.ink,
    boxShadow: drop(4),
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 19,
    textAlign: "center",
  },
  body: {
    maxWidth: 260,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});
