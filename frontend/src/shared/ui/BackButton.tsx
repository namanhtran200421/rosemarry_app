import { Feather } from "@expo/vector-icons";

import { colors } from "../theme/tokens";

import { IconButton } from "./IconButton";

interface BackButtonProps {
  onPress: () => void;
}

/** Canonical back control for custom-header screens. */
export function BackButton({ onPress }: BackButtonProps) {
  return (
    <IconButton accessibilityLabel="Go back" onPress={onPress}>
      <Feather name="chevron-left" size={22} color={colors.primaryAccessible} />
    </IconButton>
  );
}
