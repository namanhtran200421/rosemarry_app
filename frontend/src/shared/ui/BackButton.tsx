import { brut } from "../theme/tokens";

import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

interface BackButtonProps {
  onPress: () => void;
  disabled?: boolean;
  /** Compact header variant used on full-screen pages. */
  compact?: boolean;
}

/** Canonical back control for custom-header screens. */
export function BackButton({
  onPress,
  disabled = false,
  compact = false,
}: BackButtonProps) {
  return (
    <IconButton
      accessibilityLabel="Go back"
      disabled={disabled}
      onPress={onPress}
      size={compact ? 34 : 44}
      variant={compact ? "paper" : "surface"}
      offset={compact ? 0 : 3}
    >
      <Icon
        name={compact ? "ArrowLeft" : "ChevronLeft"}
        size={compact ? 19 : 22}
        color={brut.ink}
      />
    </IconButton>
  );
}
