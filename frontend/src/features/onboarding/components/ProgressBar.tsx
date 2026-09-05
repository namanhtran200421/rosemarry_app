import { StyleSheet, View } from "react-native";

import { colors, radii } from "../../../shared/theme/tokens";

interface ProgressBarProps {
  step: number;
  total: number;
}

/** The signature 3px onboarding bar: orange fill advancing on an ink track. */
export function ProgressBar({ step, total }: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, Math.round((step / total) * 100)));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: step }}
      style={styles.track}
    >
      <View style={[styles.fill, { width: `${percent}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 3,
    width: "100%",
    backgroundColor: colors.progressTrack,
    borderRadius: radii.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.accentOrange,
    borderRadius: radii.pill,
  },
});
