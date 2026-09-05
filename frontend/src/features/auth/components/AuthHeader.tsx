import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { BackButton } from "../../../shared/ui/BackButton";
import { BrandMark } from "../../../shared/ui/BrandMark";

interface AuthHeaderProps {
  title: string;
  description: string;
  onBack?: () => void;
}

export function AuthHeader({ title, description, onBack }: AuthHeaderProps) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <View style={styles.backControl}>
          <BackButton onPress={onBack} />
        </View>
      ) : null}
      <BrandMark />
      <Text style={styles.eyebrow}>ROSEMARRY</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backControl: {
    marginBottom: spacing.lg,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.xxl,
    alignItems: "flex-start",
  },
  eyebrow: {
    color: colors.link,
    fontFamily: fonts.bold,
    fontSize: typography.caption.fontSize,
    letterSpacing: 2.2,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: typography.display.fontSize,
    lineHeight: typography.display.lineHeight,
    letterSpacing: -0.8,
  },
  description: {
    maxWidth: 350,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
});
