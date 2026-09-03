import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing, typography } from "../theme/tokens";

interface LoadingScreenProps {
  label: string;
}

export function LoadingScreen({ label }: LoadingScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View
        accessibilityLiveRegion="polite"
        accessibilityRole="progressbar"
        style={styles.content}
      >
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.label}>{label}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
});
