import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from "react-native";

import {
  colors,
  fonts,
  radii,
  shadows,
  spacing,
  typography,
} from "../../../shared/theme/tokens";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (value: number) => void;
}

/**
 * Touch-draggable range control built on the view responder props, so the
 * onboarding flow adds no native module to the build.
 */
export function Slider({
  label,
  value,
  min,
  max,
  unit = "",
  onChange,
}: SliderProps) {
  const [width, setWidth] = useState(0);

  function setFromEvent(event: GestureResponderEvent): void {
    if (width <= 0) {
      return;
    }
    const ratio = Math.max(0, Math.min(1, event.nativeEvent.locationX / width));
    onChange(Math.round(min + ratio * (max - min)));
  }

  function handleLayout(event: LayoutChangeEvent): void {
    setWidth(event.nativeEvent.layout.width);
  }

  const ratio =
    max === min ? 0 : Math.max(0, Math.min(1, (value - min) / (max - min)));
  const filled = Math.round(ratio * width);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}
          {unit}
        </Text>
      </View>

      <View
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: value }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(event) => {
          const { actionName } = event.nativeEvent;

          if (actionName !== "increment" && actionName !== "decrement") {
            return;
          }

          const delta = actionName === "increment" ? 1 : -1;
          onChange(Math.max(min, Math.min(max, value + delta)));
        }}
        onLayout={handleLayout}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={setFromEvent}
        onResponderMove={setFromEvent}
        onStartShouldSetResponder={() => true}
        style={styles.hitArea}
      >
        <View pointerEvents="none" style={styles.track}>
          <View style={[styles.fill, { width: filled }]} />
        </View>
        <View
          pointerEvents="none"
          style={[styles.thumb, { left: Math.max(0, filled - 11) }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: typography.callout.fontSize,
  },
  value: {
    color: colors.primaryAccessible,
    fontFamily: fonts.bold,
    fontSize: typography.sub.fontSize,
  },
  hitArea: {
    height: 32,
    justifyContent: "center",
  },
  track: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
  },
  thumb: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.sm,
  },
});
