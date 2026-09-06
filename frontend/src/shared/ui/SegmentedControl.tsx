import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, radii, typography } from "../theme/tokens";

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

/** Pill segmented control. White track, brand border, brand-filled segment. */
export function SegmentedControl({
  options,
  value,
  onChange,
  size = "md",
  accessibilityLabel,
  disabled = false,
}: SegmentedControlProps) {
  const height = size === "sm" ? 38 : 46;
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
            style={[
              styles.segment,
              isActive && { backgroundColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  fontSize,
                  color: isActive ? colors.onPrimary : colors.textSecondary,
                },
              ]}
            >
              {option.label}
            </Text>
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
    gap: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.pill,
  },
  trackDisabled: {
    opacity: 0.45,
  },
  segment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    height: "100%",
    borderRadius: radii.pill,
  },
  label: {
    fontFamily: fonts.semibold,
  },
});
