import { type ReactNode, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";

import {
  brut,
  colors,
  drop,
  fonts,
  motion,
  radii,
} from "../theme/tokens";

type ButtonIntent =
  | "primary"
  | "secondary"
  | "neutral"
  | "ghost"
  | "danger"
  | "dark";
type ButtonSize = "sm" | "md" | "lg";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  intent?: ButtonIntent;
  size?: ButtonSize;
  disabled?: boolean;
  busy?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  leadingIcon?: ReactNode;
  /** Underlines a ghost button so it reads as a text link. */
  underline?: boolean;
}

/**
 * Full-pill action with a 2px ink outline and a hard drop. Pressing pushes
 * the block into its shadow; disabled fills the neutral block and keeps an
 * ink label rather than fading out.
 */
export function AppButton({
  label,
  onPress,
  intent = "primary",
  size = "lg",
  disabled = false,
  busy = false,
  accessibilityHint,
  style,
  leadingIcon,
  underline = false,
}: AppButtonProps) {
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = disabled || busy;
  const isGhost = intent === "ghost";
  const skin = isDisabled && !isGhost ? DISABLED_SKIN : SKINS[intent];
  const metrics = SIZES[size];
  const offset = isGhost || isDisabled ? 0 : size === "sm" ? 3 : 4;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy }}
      disabled={isDisabled}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={onPress}
      style={({ pressed }) => {
        const shift = pressed && offset > 0 ? motion.pressShift : 0;

        return [
          styles.button,
          {
            minHeight: metrics.height,
            paddingHorizontal: metrics.paddingHorizontal,
            backgroundColor: skin.background,
            borderWidth: isGhost ? 0 : brut.border,
            borderColor: isFocused ? colors.primaryAccessible : brut.ink,
            boxShadow: drop(offset - shift),
            opacity: isGhost && isDisabled ? 0.45 : 1,
            transform: [{ translateX: shift }, { translateY: shift }],
          },
          style,
        ];
      }}
    >
      {leadingIcon ? (
        <View
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {leadingIcon}
        </View>
      ) : null}
      <Text
        style={[
          styles.label,
          {
            color: skin.text,
            fontSize: metrics.fontSize,
            opacity: busy ? 0 : 1,
            textDecorationLine: underline ? "underline" : "none",
          },
        ]}
      >
        {label}
      </Text>
      {busy ? (
        <ActivityIndicator
          accessibilityElementsHidden
          color={skin.text}
          style={styles.spinner}
        />
      ) : null}
    </Pressable>
  );
}

const SKINS: Record<ButtonIntent, { background: string; text: string }> = {
  primary: { background: colors.primary, text: colors.onPrimary },
  secondary: { background: brut.yellow, text: brut.ink },
  neutral: { background: brut.white, text: brut.ink },
  ghost: { background: "transparent", text: brut.ink },
  danger: { background: colors.accentRed, text: brut.white },
  dark: { background: brut.ink, text: brut.white },
};

const DISABLED_SKIN = { background: brut.disabled, text: brut.ink };

const SIZES: Record<
  ButtonSize,
  { height: number; fontSize: number; paddingHorizontal: number }
> = {
  sm: { height: 42, fontSize: 14, paddingHorizontal: 18 },
  md: { height: 48, fontSize: 15, paddingHorizontal: 20 },
  lg: { height: 54, fontSize: 16, paddingHorizontal: 24 },
};

const styles = StyleSheet.create({
  button: {
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
  },
  label: {
    fontFamily: fonts.bold,
    lineHeight: 20,
    textAlign: "center",
  },
  spinner: {
    position: "absolute",
  },
});
