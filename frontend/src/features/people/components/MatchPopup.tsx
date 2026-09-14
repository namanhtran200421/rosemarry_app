import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { brut, colors, fonts, palette } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { Icon } from "../../../shared/ui/Icon";
import { Photo } from "../../../shared/ui/Photo";
import { photoUri } from "../../social/data/photos";
import type { Match } from "../../social/types/social.types";

interface MatchPopupProps {
  match: Match | null;
  myPhoto?: string;
  myName: string;
  onMessage: (match: Match) => void;
  onKeepSwiping: () => void;
}

function FloatingHeart({ index }: { index: number }) {
  const [rise] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rise, {
        toValue: 1,
        duration: 2400 + (index % 3) * 600,
        delay: index * 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [index, rise]);

  return (
    <Animated.View
      style={[
        styles.floating,
        {
          left: `${8 + index * 16}%`,
          opacity: rise.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
          transform: [
            { translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [0, -680] }) },
          ],
        },
      ]}
    >
      <Icon name="Heart" size={18 + (index % 3) * 8} color="rgba(242,127,168,0.55)" />
    </Animated.View>
  );
}

/** "It's a Match!" celebration with both photos and the next steps. */
export function MatchPopup({
  match,
  myPhoto,
  myName,
  onMessage,
  onKeepSwiping,
}: MatchPopupProps) {
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onKeepSwiping}
      statusBarTranslucent
      transparent
      visible={match !== null}
    >
      <View accessibilityViewIsModal style={styles.root}>
        {reduceMotion
          ? null
          : [0, 1, 2, 3, 4, 5].map((index) => (
              <FloatingHeart key={index} index={index} />
            ))}
        {match ? (
          <>
            <View style={styles.photos}>
              <View style={[styles.avatar, styles.left]}>
                <Photo uri={photoUri(myPhoto)} seed={myPhoto} name={myName} />
              </View>
              <View style={[styles.avatar, styles.right]}>
                <Photo uri={photoUri(match.photo)} seed={match.photo} name={match.name} />
              </View>
              <View style={styles.badge}>
                <Icon name="Heart" size={26} color={colors.primary} />
              </View>
            </View>
            <Text accessibilityRole="header" style={styles.title}>
              It&apos;s a Match!
            </Text>
            <Text style={styles.subtitle}>
              You and {match.name} liked each other.
            </Text>
            <View style={styles.actions}>
              <AppButton label="Send a message" onPress={() => onMessage(match)} />
              <AppButton intent="neutral" label="Keep swiping" onPress={onKeepSwiping} />
            </View>
          </>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    overflow: "hidden",
    backgroundColor: palette.pink100,
    experimental_backgroundImage: `linear-gradient(168deg, ${palette.cream50} 0%, ${palette.pink100} 42%, ${palette.pink300} 100%)`,
  },
  floating: {
    position: "absolute",
    bottom: -40,
  },
  photos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 34,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: brut.white,
    boxShadow: "0 12px 30px rgba(125, 13, 52, 0.22)",
  },
  left: {
    transform: [{ rotate: "-8deg" }],
  },
  right: {
    marginLeft: -20,
    transform: [{ rotate: "8deg" }],
  },
  badge: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: brut.white,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 16px rgba(125, 13, 52, 0.25)",
  },
  title: {
    color: palette.pink900,
    fontFamily: fonts.bold,
    fontSize: 38,
    lineHeight: 44,
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 260,
    marginTop: 10,
    marginBottom: 32,
    color: palette.pink800,
    fontFamily: fonts.regular,
    fontSize: 15,
    textAlign: "center",
  },
  actions: {
    width: "100%",
    maxWidth: 300,
    gap: 12,
  },
});
