import { View } from "react-native";

import { brut, radii } from "../theme/tokens";

import { Icon } from "./Icon";

interface RadioProps {
  checked?: boolean;
  size?: number;
}

/**
 * Selection indicator used by rows — an outlined circle that fills green and
 * carries an ink check when on.
 */
export function Radio({ checked = false, size = 24 }: RadioProps) {
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width: size,
        height: size,
        borderRadius: radii.pill,
        borderWidth: brut.borderThin,
        borderColor: brut.ink,
        backgroundColor: checked ? brut.green : brut.white,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked ? <Icon name="Check" size={Math.round(size * 0.6)} /> : null}
    </View>
  );
}
