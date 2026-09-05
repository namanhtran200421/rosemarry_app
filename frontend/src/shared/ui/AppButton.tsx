import { type ReactNode, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  colors,
  fonts,
  layout,
  motion,
  radii,
  spacing,
  typography,
} from "../theme/tokens";

type ButtonIntent = "primary" | "neutral" | "danger";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  intent?: ButtonIntent;
  disabled?: boolean;
  busy?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  leadingIcon?: ReactNode;
}

export function AppButton({
  label,
  onPress,
  intent = "primary",
  disabled = false,
  busy = false,
  accessibilityHint,
  style,
  leadingIcon,
}: AppButtonProps) {
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = disabled || busy;
  const palette = buttonPalettes[intent];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy }}
      disabled={isDisabled}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: palette.background,
          borderColor: isFocused ? colors.focus : palette.border,
          opacity: isDisabled ? 0.45 : 1,
          transform: [{ scale: pressed ? motion.pressScale : 1 }],
        },
        style,
      ]}
    >
      {leadingIcon}
      <Text
        style={[styles.label, { color: palette.text, opacity: busy ? 0 : 1 }]}
      >
        {label}
      </Text>
      {busy ? (
        <ActivityIndicator
          accessibilityElementsHidden
          color={palette.text}
          style={styles.spinner}
        />
      ) : null}
    </Pressable>
  );
}

/**
 * Press feedback is a quiet scale-down rather than a color flip, per the
 * design. `danger` keeps a visible outlined affordance so destructive
 * actions stay discoverable.
 */
const buttonPalettes = {
  primary: {
    background: colors.primary,
    border: colors.primary,
    text: colors.onPrimary,
  },
  neutral: {
    background: colors.surface,
    border: colors.border,
    text: colors.text,
  },
  danger: {
    background: colors.dangerSurface,
    border: colors.dangerStrong,
    text: colors.dangerStrong,
  },
} as const;

const styles = StyleSheet.create({
  button: {
    minHeight: layout.fieldHeight,
    minWidth: layout.controlHeight,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: typography.button.fontSize,
    lineHeight: typography.button.lineHeight,
  },
  spinner: {
    position: "absolute",
  },
});
