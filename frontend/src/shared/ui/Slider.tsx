import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from "react-native";

import { brut, colors, drop, fonts, radii } from "../theme/tokens";

import { Tag } from "./Tag";

const THUMB = 24;

interface SliderProps {
  /** Visible label; omit when the surrounding field already names it. */
  label?: string;
  accessibilityLabel?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
  onChange: (value: number) => void;
}

/**
 * Touch-draggable value control built on the view responder props, so no
 * native slider module is needed. An outlined track with a pink fill and a
 * white thumb carrying a hard drop.
 */
export function Slider({
  label,
  accessibilityLabel,
  value,
  min,
  max,
  step = 1,
  format = String,
  onChange,
}: SliderProps) {
  const [width, setWidth] = useState(0);

  function setFromEvent(event: GestureResponderEvent): void {
    if (width <= 0) {
      return;
    }
    const ratio = Math.max(0, Math.min(1, event.nativeEvent.locationX / width));
    onChange(Math.round((min + ratio * (max - min)) / step) * step);
  }

  function handleLayout(event: LayoutChangeEvent): void {
    setWidth(event.nativeEvent.layout.width);
  }

  const ratio =
    max === min ? 0 : Math.max(0, Math.min(1, (value - min) / (max - min)));
  const filled = ratio * width;

  return (
    <View style={styles.container}>
      <View style={[styles.labelRow, !label && styles.labelRowEnd]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Tag label={format(value)} color={brut.green} />
      </View>

      <View
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityValue={{ min, max, now: value, text: format(value) }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(event) => {
          const { actionName } = event.nativeEvent;

          if (actionName !== "increment" && actionName !== "decrement") {
            return;
          }

          const delta = actionName === "increment" ? step : -step;
          onChange(Math.max(min, Math.min(max, value + delta)));
        }}
        onLayout={handleLayout}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={setFromEvent}
        onResponderMove={setFromEvent}
        onResponderTerminationRequest={() => false}
        onStartShouldSetResponder={() => true}
        style={styles.hitArea}
      >
        <View pointerEvents="none" style={styles.track}>
          <View style={[styles.fill, { width: Math.max(0, filled - 4) }]} />
        </View>
        <View
          pointerEvents="none"
          style={[styles.thumb, { left: filled - THUMB / 2 }]}
        />
      </View>
    </View>
  );
}

export const sliderStyles = StyleSheet.create({
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 12,
    borderRadius: radii.pill,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    backgroundColor: brut.white,
    justifyContent: "center",
  },
  fill: {
    position: "absolute",
    left: 1,
    height: 7,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  thumb: {
    position: "absolute",
    width: THUMB,
    height: THUMB,
    borderRadius: radii.pill,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.white,
    boxShadow: drop(2),
  },
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  labelRowEnd: {
    justifyContent: "flex-end",
  },
  label: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  hitArea: {
    height: 32,
    justifyContent: "center",
    marginHorizontal: THUMB / 2,
  },
  track: sliderStyles.track,
  fill: sliderStyles.fill,
  thumb: sliderStyles.thumb,
});
