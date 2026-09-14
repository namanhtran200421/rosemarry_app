import { Pressable, StyleSheet, View } from "react-native";

import { brut, drop } from "../theme/tokens";

interface PagerDotsProps {
  count: number;
  index: number;
  onSelect: (index: number) => void;
  labels?: string[];
}

/** Outlined page indicators; the current page stretches into a yellow bar. */
export function PagerDots({ count, index, onSelect, labels }: PagerDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, dotIndex) => {
        const isActive = dotIndex === index;

        return (
          <Pressable
            key={dotIndex}
            accessibilityLabel={labels?.[dotIndex] ?? `Page ${dotIndex + 1}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            hitSlop={10}
            onPress={() => onSelect(dotIndex)}
            style={[
              styles.dot,
              {
                width: isActive ? 32 : 14,
                backgroundColor: isActive ? brut.yellow : brut.white,
                boxShadow: drop(isActive ? 2 : 0),
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    height: 12,
    borderRadius: 4,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
  },
});
