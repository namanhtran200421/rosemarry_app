import { useRef, useState } from "react";
import {
  Animated,
  type GestureResponderEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { colors } from "../../../shared/theme/tokens";
import type { Profile } from "../../social/types/social.types";

import { CardHero } from "./CardHero";
import { FirstMessageSheet } from "./FirstMessageSheet";
import { ProfileDetail } from "./ProfileDetail";
import { SwipeStamp } from "./SwipeStamp";

export type SwipeDirection = "left" | "right" | "up";

const SWIPE_THRESHOLD = 90;
const HERO_INSET = 108;

interface SwipeableCardProps {
  profile: Profile;
  myInterests: string[];
  onResolve: (direction: SwipeDirection) => void;
  /** Bounded 500px hero used by the Likes and Circle viewers. */
  short?: boolean;
  /** Shows rewind / Super Like / message over the photo. */
  showActions?: boolean;
  canRewind?: boolean;
  onRewind?: () => void;
  onBack?: () => void;
  messaged?: boolean;
  /** Called before composing; return false when no credits remain. */
  onRequestMessage?: () => boolean;
  /** Called before a Super Like flies; return false when none remain. */
  onRequestSuperlike?: () => boolean;
  onSendMessage?: (text: string) => void;
}

/**
 * One scrollable profile card that can be dragged sideways to like or pass.
 * Vertical movement scrolls the details; a horizontal drag past the threshold
 * flings the card away before resolving.
 */
export function SwipeableCard({
  profile,
  myInterests,
  onResolve,
  short = false,
  showActions = false,
  canRewind = false,
  onRewind,
  onBack,
  messaged = false,
  onRequestMessage,
  onRequestSuperlike,
  onSendMessage,
}: SwipeableCardProps) {
  const [height, setHeight] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [composing, setComposing] = useState(false);
  const [flyingUp, setFlyingUp] = useState(false);
  const [dragX] = useState(() => new Animated.Value(0));
  const [flyY] = useState(() => new Animated.Value(0));
  const [opacity] = useState(() => new Animated.Value(1));
  const touchStart = useRef({ x: 0, y: 0 });
  const isFlying = useRef(false);

  function fling(direction: SwipeDirection): void {
    if (isFlying.current) {
      return;
    }
    isFlying.current = true;
    setFlyingUp(direction === "up");
    const travel =
      direction === "up"
        ? Animated.timing(flyY, { toValue: -820, duration: 300, useNativeDriver: true })
        : Animated.timing(dragX, {
            toValue: direction === "right" ? 560 : -560,
            duration: 300,
            useNativeDriver: true,
          });
    Animated.parallel([
      travel,
      Animated.timing(opacity, { toValue: 0.3, duration: 300, useNativeDriver: true }),
    ]).start(() => onResolve(direction));
  }

  function offsetOf(event: GestureResponderEvent) {
    return {
      dx: event.nativeEvent.pageX - touchStart.current.x,
      dy: event.nativeEvent.pageY - touchStart.current.y,
    };
  }

  function settle(): void {
    Animated.spring(dragX, { toValue: 0, useNativeDriver: true }).start();
  }

  const rotate = dragX.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ["-8deg", "0deg", "8deg"],
  });
  const heroHeight = short ? 500 : Math.max(480, height);
  const firstName = profile.name.split(" ")[0];

  return (
    <View
      onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
      style={StyleSheet.absoluteFill}
    >
      <Animated.View
        onMoveShouldSetResponderCapture={(event) => {
          const { dx, dy } = offsetOf(event);
          return (
            !isFlying.current && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2
          );
        }}
        onResponderMove={(event) => dragX.setValue(offsetOf(event).dx)}
        onResponderRelease={(event) => {
          const { dx } = offsetOf(event);
          if (dx > SWIPE_THRESHOLD) {
            fling("right");
          } else if (dx < -SWIPE_THRESHOLD) {
            fling("left");
          } else {
            settle();
          }
        }}
        onResponderTerminate={settle}
        onResponderTerminationRequest={() => false}
        onTouchStart={(event) => {
          touchStart.current = {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          };
        }}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity,
            transform: [{ translateX: dragX }, { translateY: flyY }, { rotate }],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.card}
        >
          {height > 0 ? (
            <CardHero
              height={heroHeight}
              onBack={onBack}
              onPhotoIndex={setPhotoIndex}
              photoIndex={photoIndex}
              photoInset={short ? 0 : HERO_INSET}
              profile={profile}
              actions={
                showActions
                  ? {
                      canRewind,
                      onRewind,
                      messaged,
                      onSuperlike: () => {
                        if (onRequestSuperlike?.() ?? true) {
                          fling("up");
                        }
                      },
                      onMessage: () => {
                        if (!messaged && (onRequestMessage?.() ?? true)) {
                          setComposing(true);
                        }
                      },
                    }
                  : undefined
              }
            />
          ) : null}
          <View style={{ marginTop: short ? 16 : -92 }}>
            <ProfileDetail
              myInterests={myInterests}
              onAfterSafetyAction={() => fling("left")}
              profile={profile}
            />
          </View>
          <View style={styles.tail} />
        </ScrollView>
        <SwipeStamp dragX={dragX} superLiking={flyingUp} />
      </Animated.View>

      <FirstMessageSheet
        firstName={firstName}
        onClose={() => setComposing(false)}
        onSend={(text) => {
          setComposing(false);
          onSendMessage?.(text);
          fling("right");
        }}
        visible={composing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: colors.backgroundWarm,
  },
  tail: {
    height: 120,
  },
});
