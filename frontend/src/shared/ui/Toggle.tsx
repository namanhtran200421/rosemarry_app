import { Pressable, View } from "react-native";

import { brut, drop, radii } from "../theme/tokens";

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  accessibilityLabel: string;
}

/** Hard-edged on/off switch: green track when on, neutral block when off. */
export function Toggle({ value, onChange, accessibilityLabel }: ToggleProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      hitSlop={8}
      onPress={() => onChange(!value)}
      style={{
        width: 52,
        height: 30,
        padding: 2,
        borderRadius: radii.pill,
        borderWidth: brut.border,
        borderColor: brut.ink,
        backgroundColor: value ? brut.green : brut.disabled,
        boxShadow: drop(2),
        alignItems: value ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: radii.pill,
          borderWidth: brut.borderThin,
          borderColor: brut.ink,
          backgroundColor: brut.white,
        }}
      />
    </Pressable>
  );
}
