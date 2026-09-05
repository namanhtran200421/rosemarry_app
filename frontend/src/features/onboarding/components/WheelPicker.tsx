import { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

import { colors, fonts, radii, spacing } from "../../../shared/theme/tokens";

const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 5;
const PAD = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

interface WheelPickerProps {
  values: string[];
  index: number;
  onIndex: (index: number) => void;
  label?: string;
}

/** Snap-scrolling value wheel with a brand-ringed centre band. */
export function WheelPicker({
  values,
  index,
  onIndex,
  label,
}: WheelPickerProps) {
  const scrollRef = useRef<ScrollView>(null);

  function selectIndex(nextIndex: number): void {
    const clampedIndex = Math.max(0, Math.min(values.length - 1, nextIndex));

    if (clampedIndex === index) {
      return;
    }

    onIndex(clampedIndex);
    scrollRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });
  }

  function handleSettle(event: NativeSyntheticEvent<NativeScrollEvent>): void {
    const offset = event.nativeEvent.contentOffset.y;
    selectIndex(Math.round(offset / ITEM_HEIGHT));
  }

  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={styles.band} />
      <ScrollView
        ref={scrollRef}
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ text: values[index] }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === "increment") {
            selectIndex(index + 1);
          } else if (event.nativeEvent.actionName === "decrement") {
            selectIndex(index - 1);
          }
        }}
        contentContainerStyle={styles.content}
        contentOffset={{ x: 0, y: index * ITEM_HEIGHT }}
        decelerationRate="fast"
        onMomentumScrollEnd={handleSettle}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
      >
        {values.map((value, itemIndex) => {
          const distance = Math.abs(itemIndex - index);
          const isActive = distance === 0;

          return (
            <View key={value} style={styles.item}>
              <Text
                style={[
                  styles.label,
                  isActive
                    ? styles.labelActive
                    : distance === 1
                      ? styles.labelNear
                      : styles.labelFar,
                ]}
              >
                {value}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    marginVertical: spacing.sm,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radii.xxl,
    overflow: "hidden",
  },
  band: {
    position: "absolute",
    left: spacing.xl,
    right: spacing.xl,
    top: PAD,
    height: ITEM_HEIGHT,
    zIndex: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.primary,
  },
  content: {
    paddingVertical: PAD,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: fonts.medium,
  },
  labelActive: {
    fontFamily: fonts.bold,
    fontSize: 30,
    color: colors.text,
  },
  labelNear: {
    fontSize: 21,
    color: colors.textFaint,
  },
  labelFar: {
    fontSize: 21,
    color: colors.borderStrong,
  },
});
