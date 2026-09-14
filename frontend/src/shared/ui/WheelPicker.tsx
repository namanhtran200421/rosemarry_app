import { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

import { brut, drop, fonts, radii } from "../theme/tokens";

const VISIBLE_ITEMS = 5;

interface WheelPickerProps {
  values: string[];
  index: number;
  onIndex: (index: number) => void;
  label?: string;
  itemHeight?: number;
}

/** Snap-scrolling value wheel on an outlined card with a yellow centre band. */
export function WheelPicker({
  values,
  index,
  onIndex,
  label,
  itemHeight = 56,
}: WheelPickerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const pad = itemHeight * Math.floor(VISIBLE_ITEMS / 2);

  function selectIndex(nextIndex: number): void {
    const clampedIndex = Math.max(0, Math.min(values.length - 1, nextIndex));

    if (clampedIndex === index) {
      return;
    }

    onIndex(clampedIndex);
    scrollRef.current?.scrollTo({
      y: clampedIndex * itemHeight,
      animated: true,
    });
  }

  function handleSettle(event: NativeSyntheticEvent<NativeScrollEvent>): void {
    const offset = event.nativeEvent.contentOffset.y;
    selectIndex(Math.round(offset / itemHeight));
  }

  return (
    <View style={[styles.container, { height: itemHeight * VISIBLE_ITEMS }]}>
      <View
        pointerEvents="none"
        style={[styles.band, { top: pad, height: itemHeight }]}
      />
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
        contentContainerStyle={{ paddingVertical: pad }}
        contentOffset={{ x: 0, y: index * itemHeight }}
        decelerationRate="fast"
        onMomentumScrollEnd={handleSettle}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
      >
        {values.map((value, itemIndex) => {
          const distance = Math.abs(itemIndex - index);

          return (
            <View key={value} style={[styles.item, { height: itemHeight }]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: distance === 0 ? itemHeight * 0.54 : itemHeight * 0.37,
                    opacity: distance === 0 ? 1 : distance === 1 ? 0.5 : 0.25,
                  },
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
    marginVertical: 10,
    backgroundColor: brut.white,
    borderRadius: radii.md,
    borderWidth: brut.border,
    borderColor: brut.ink,
    boxShadow: drop(4),
    overflow: "hidden",
  },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: brut.border,
    borderBottomWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.yellow,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: brut.ink,
    fontFamily: fonts.bold,
  },
});
