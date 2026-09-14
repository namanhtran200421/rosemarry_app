import type { PropsWithChildren, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { brut, drop, fonts, radii } from "../theme/tokens";

import { Icon } from "./Icon";

interface SectionCardProps extends PropsWithChildren {
  title?: string;
  /** Control at the right end of the title row. */
  right?: ReactNode;
  /** Makes the whole card a button with a trailing chevron. */
  onPress?: () => void;
}

/** White outlined section block used across the profile screens. */
export function SectionCard({ title, right, onPress, children }: SectionCardProps) {
  const header =
    title || right || onPress ? (
      <View style={[styles.header, Boolean(children) && styles.headerSpaced]}>
        {title ? (
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
        ) : null}
        {right ?? (onPress ? <Icon name="ChevronRight" size={18} /> : null)}
      </View>
    ) : null;

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title ? `Edit ${title}` : undefined}
        onPress={onPress}
        style={styles.card}
      >
        {header}
        {children}
      </Pressable>
    );
  }

  return (
    <View style={styles.card}>
      {header}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: radii.md,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.white,
    boxShadow: drop(4),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  headerSpaced: {
    marginBottom: 10,
  },
  title: {
    flex: 1,
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 23,
  },
});
