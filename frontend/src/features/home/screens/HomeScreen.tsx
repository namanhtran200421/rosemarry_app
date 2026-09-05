import { StyleSheet, Text, View } from "react-native";

import { LogoutButton } from "../../auth/components/LogoutButton";
import {
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { Screen } from "../../../shared/ui/Screen";

export function HomeScreen() {
  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>YOUR SPACE</Text>
        <Text style={styles.title}>Welcome to Rosemarry.</Text>
        <Text style={styles.description}>
          You are signed in. Your circles and conversations will live here.
        </Text>
      </View>

      <View style={styles.logoutArea}>
        <LogoutButton />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.link,
    fontFamily: fonts.bold,
    fontSize: typography.caption.fontSize,
    letterSpacing: 2,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: typography.title.fontSize,
    lineHeight: typography.title.lineHeight,
  },
  description: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  logoutArea: {
    marginTop: spacing.xxl,
  },
});
