import { Feather } from "@expo/vector-icons";

import { colors } from "../theme/tokens";

import { IconButton } from "./IconButton";

interface BackButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

/** Canonical back control for custom-header screens. */
export function BackButton({ onPress, disabled = false }: BackButtonProps) {
  return (
    <IconButton
      accessibilityLabel="Go back"
      disabled={disabled}
      onPress={onPress}
    >
      <Feather name="chevron-left" size={22} color={colors.primaryAccessible} />
    </IconButton>
  );
}
