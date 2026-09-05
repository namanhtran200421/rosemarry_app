import { StyleSheet, View } from "react-native";

import { colors, radii } from "../theme/tokens";

interface RadioProps {
  checked?: boolean;
  size?: number;
}

/**
 * Selection indicator used by OptionRow — an empty ring that becomes a
 * filled pink disc with a white check. The check is drawn from borders
 * rather than an icon so the app stays free of an SVG dependency.
 */
export function Radio({ checked = false, size = 24 }: RadioProps) {
  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          backgroundColor: checked ? colors.primary : colors.surface,
          borderColor: checked ? colors.primary : colors.borderStrong,
          borderWidth: checked ? 1 : 1.5,
        },
      ]}
    >
      {checked ? (
        <View
          style={[
            styles.check,
            {
              width: size * 0.25,
              height: size * 0.45,
              marginTop: -size * 0.08,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
  },
  check: {
    borderColor: colors.onPrimary,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "45deg" }],
  },
});
