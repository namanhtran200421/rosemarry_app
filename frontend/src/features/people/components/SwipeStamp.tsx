import { Animated, StyleSheet, Text } from "react-native";

import { colors, fonts, palette } from "../../../shared/theme/tokens";
import { Icon } from "../../../shared/ui/Icon";

interface SwipeStampProps {
  dragX: Animated.Value;
  superLiking: boolean;
}

/** Like / pass / Super Like marks that fade in as the card is dragged. */
export function SwipeStamp({ dragX, superLiking }: SwipeStampProps) {
  const likeOpacity = dragX.interpolate({
    inputRange: [40, 120],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const passOpacity = dragX.interpolate({
    inputRange: [-120, -40],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[styles.circle, styles.like, { opacity: likeOpacity }]}
      >
        <Icon name="Heart" size={46} color={colors.accentRed} />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[styles.circle, styles.pass, { opacity: passOpacity }]}
      >
        <Icon name="SlashedHeart" size={46} color={palette.gray600} />
      </Animated.View>
      {superLiking ? (
        <Animated.View pointerEvents="none" style={styles.super}>
          <Text style={styles.superText}>SUPER LIKE</Text>
        </Animated.View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: "absolute",
    top: 44,
    width: 84,
    height: 84,
    borderRadius: 999,
    borderWidth: 5,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.25)",
  },
  like: {
    left: 24,
    borderColor: colors.accentRed,
  },
  pass: {
    right: 24,
    borderColor: palette.gray600,
  },
  super: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: colors.accentRed,
  },
  superText: {
    color: colors.accentRed,
    fontFamily: fonts.bold,
    fontSize: 28,
    letterSpacing: 1.7,
  },
});
