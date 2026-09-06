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
  /** Uses tighter spacing for longer authentication forms. */
  compact?: boolean;
  /** Prevents leaving while a sensitive authentication request is running. */
  backDisabled?: boolean;
}

export function AuthHeader({
  title,
  description,
  onBack,
  compact = false,
  backDisabled = false,
}: AuthHeaderProps) {
  return (
    <View style={[styles.header, compact && styles.headerCompact]}>
      {onBack ? (
        <View
          style={[styles.backControl, compact && styles.backControlCompact]}
        >
          <BackButton disabled={backDisabled} onPress={onBack} />
        </View>
      ) : null}
      <BrandMark size={compact ? 48 : 56} />
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
  backControlCompact: {
    marginBottom: spacing.sm,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.xxl,
    alignItems: "flex-start",
  },
  headerCompact: {
    gap: spacing.xs,
    marginBottom: spacing.xl,
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
