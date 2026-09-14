import { Pressable, StyleSheet, Text, View } from "react-native";

import { brut, colors, fonts, radii, typography } from "../theme/tokens";

interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md";
  accessibilityLabel?: string;
  disabled?: boolean;
}

/** Outlined pill track; the active segment fills brand pink. */
export function SegmentedControl({
  options,
  value,
  onChange,
  size = "md",
  accessibilityLabel,
  disabled = false,
}: SegmentedControlProps) {
  const height = size === "sm" ? 40 : 48;
  const fontSize =
    size === "sm" ? typography.caption.fontSize : typography.sub.fontSize;

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, disabled && styles.trackDisabled, { height }]}
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive, disabled }}
            disabled={disabled}
            onPress={() => onChange(option.value)}
            style={[styles.segment, isActive && styles.segmentActive]}
          >
            <Text style={[styles.label, { fontSize }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    alignSelf: "flex-start",
    padding: 4,
    gap: 6,
    backgroundColor: brut.white,
    borderWidth: brut.border,
    borderColor: brut.ink,
    borderRadius: radii.pill,
  },
  trackDisabled: {
    opacity: 0.45,
  },
  segment: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    height: "100%",
    borderRadius: radii.pill,
  },
  segmentActive: {
    backgroundColor: colors.primary,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
  },
  label: {
    color: brut.ink,
    fontFamily: fonts.bold,
  },
});
