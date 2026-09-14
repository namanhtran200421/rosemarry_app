import { Pressable, StyleSheet, View } from "react-native";

import { brut, colors, palette } from "../../../shared/theme/tokens";
import { Icon } from "../../../shared/ui/Icon";

export interface HeroActionProps {
  canRewind: boolean;
  onRewind?: () => void;
  onSuperlike: () => void;
  onMessage: () => void;
  messaged: boolean;
}

const GLOW = "0 0 16px 3px rgba(242, 127, 168, 0.55)";

/** Rewind, Super Like and first-impression buttons overlaid on the photo. */
export function HeroActions({
  canRewind,
  onRewind,
  onSuperlike,
  onMessage,
  messaged,
}: HeroActionProps) {
  return (
    <View style={styles.row}>
      {onRewind ? (
        <Pressable
          accessibilityLabel="Rewind last profile"
          accessibilityRole="button"
          accessibilityState={{ disabled: !canRewind }}
          disabled={!canRewind}
          onPress={onRewind}
          style={[styles.small, !canRewind && styles.dimmed]}
        >
          <Icon name="Rewind" size={21} color={colors.primaryAccessible} />
        </Pressable>
      ) : null}
      <Pressable
        accessibilityLabel="Super Like"
        accessibilityRole="button"
        onPress={onSuperlike}
        style={styles.super}
      >
        <Icon name="Star4" size={26} color={brut.ink} />
      </Pressable>
      <Pressable
        accessibilityLabel={messaged ? "Message sent" : "Send a first impression"}
        accessibilityRole="button"
        accessibilityState={{ disabled: messaged }}
        disabled={messaged}
        onPress={onMessage}
        style={[styles.small, messaged && styles.sent]}
      >
        <Icon
          name={messaged ? "Check" : "Send"}
          size={22}
          color={messaged ? brut.white : colors.primaryAccessible}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 26,
  },
  small: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: GLOW,
  },
  super: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 20px 5px rgba(242, 127, 168, 0.6)",
  },
  dimmed: {
    opacity: 0.6,
  },
  sent: {
    backgroundColor: palette.gray600,
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.28)",
  },
});
