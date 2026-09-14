import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { brut, fonts, typography } from "../theme/tokens";

interface TabHeadingProps {
  title: string;
  /** Controls placed after the title (info button, filter button). */
  children?: ReactNode;
  /** Draws the hard rule under the heading block. */
  ruled?: boolean;
}

/** The large page title at the top of each app tab. */
export function TabHeading({ title, children, ruled = false }: TabHeadingProps) {
  return (
    <View style={[styles.row, ruled && styles.ruled]}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  ruled: {
    borderBottomWidth: brut.border,
    borderBottomColor: brut.ink,
  },
  title: {
    flexShrink: 1,
    color: brut.ink,
    fontFamily: fonts.bold,
    ...typography.hero,
  },
});
