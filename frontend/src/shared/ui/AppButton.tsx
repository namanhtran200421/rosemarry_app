import { type ReactNode, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, radii, spacing, typography } from "../theme/tokens";

type ButtonIntent = "primary" | "neutral" | "danger";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  intent?: ButtonIntent;
  disabled?: boolean;
  busy?: boolean;
  iosOnly?: boolean;
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
  iosOnly = false,
  accessibilityHint,
  style,
  leadingIcon,
}: AppButtonProps) {
  const [isFocused, setIsFocused] = useState(false);

  if (iosOnly && Platform.OS !== "ios") {
    return null;
  }

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
          backgroundColor: pressed ? palette.pressed : palette.background,
          borderColor: palette.border,
          opacity: isDisabled ? 0.55 : 1,
          shadowColor: isFocused ? colors.focus : "transparent",
          shadowOpacity: isFocused ? 1 : 0,
        },
        style,
      ]}
    >
      {leadingIcon}
      <Text
        style={[
          styles.label,
          { color: palette.text, opacity: busy ? 0 : 1 },
        ]}
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

const buttonPalettes = {
  primary: {
    background: colors.primary,
    pressed: colors.primaryPressed,
    border: colors.primary,
    text: colors.surface,
  },
  neutral: {
    background: colors.surface,
    pressed: colors.background,
    border: colors.border,
    text: colors.text,
  },
  danger: {
    background: colors.dangerSurface,
    pressed: colors.border,
    border: colors.danger,
    text: colors.danger,
  },
} as const;

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    minWidth: 48,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
  },
  label: {
    fontSize: typography.button.fontSize,
    lineHeight: typography.button.lineHeight,
    fontWeight: "600",
  },
  spinner: {
    position: "absolute",
  },
});
