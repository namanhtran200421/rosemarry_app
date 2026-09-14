import { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from "react-native";

import { sliderStyles } from "./Slider";
import { Tag } from "./Tag";
import { brut } from "../theme/tokens";

const THUMB = 24;

interface RangeSliderProps {
  accessibilityLabel: string;
  value: readonly [number, number];
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
  onChange: (value: [number, number]) => void;
}

/**
 * Dual-thumb range. A touch moves whichever thumb is nearer, and the two
 * thumbs never cross.
 */
export function RangeSlider({
  accessibilityLabel,
  value,
  min,
  max,
  step = 1,
  format = String,
  onChange,
}: RangeSliderProps) {
  const [width, setWidth] = useState(0);
  const activeThumb = useRef<"lo" | "hi">("lo");
  const [lo, hi] = value;
  const toX = (v: number) => (width * (v - min)) / (max - min);

  function valueAt(event: GestureResponderEvent): number {
    const ratio = Math.max(0, Math.min(1, event.nativeEvent.locationX / width));
    return Math.round((min + ratio * (max - min)) / step) * step;
  }

  function handleGrant(event: GestureResponderEvent): void {
    if (width <= 0) {
      return;
    }
    const next = valueAt(event);
    activeThumb.current =
      Math.abs(next - lo) <= Math.abs(next - hi) ? "lo" : "hi";
    handleMove(event);
  }

  function handleMove(event: GestureResponderEvent): void {
    if (width <= 0) {
      return;
    }
    const next = valueAt(event);
    if (activeThumb.current === "lo") {
      onChange([Math.min(next, hi - step), hi]);
    } else {
      onChange([lo, Math.max(next, lo + step)]);
    }
  }

  function handleLayout(event: LayoutChangeEvent): void {
    setWidth(event.nativeEvent.layout.width);
  }

  return (
    <View style={styles.container}>
      <Tag
        label={`${format(lo)} – ${format(hi)}`}
        color={brut.green}
        style={styles.readout}
      />
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: `${format(lo)} to ${format(hi)}` }}
        onLayout={handleLayout}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleGrant}
        onResponderMove={handleMove}
        onResponderTerminationRequest={() => false}
        onStartShouldSetResponder={() => true}
        style={styles.hitArea}
      >
        <View pointerEvents="none" style={sliderStyles.track}>
          <View
            style={[
              sliderStyles.fill,
              { left: toX(lo), width: Math.max(0, toX(hi) - toX(lo)) },
            ]}
          />
        </View>
        <View
          pointerEvents="none"
          style={[sliderStyles.thumb, { left: toX(lo) - THUMB / 2 }]}
        />
        <View
          pointerEvents="none"
          style={[sliderStyles.thumb, { left: toX(hi) - THUMB / 2 }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  readout: {
    alignSelf: "flex-end",
  },
  hitArea: {
    height: 32,
    justifyContent: "center",
    marginHorizontal: THUMB / 2,
  },
});
