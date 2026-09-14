import { forwardRef } from "react";
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
} from "react-native";

import { brut, colors, drop, fonts, radii } from "../theme/tokens";

interface InlineInputProps extends TextInputProps {
  /** Accessible name; these fields have no visible label. */
  accessibilityLabel: string;
  shape?: "pill" | "box";
  fill?: string;
  offset?: number;
}

/**
 * Label-less outlined field for composers, search and sheet editors, where
 * the surrounding UI already names the input.
 */
export const InlineInput = forwardRef<TextInput, InlineInputProps>(
  function InlineInput(
    { shape = "box", fill = brut.white, offset = 0, multiline, style, ...props },
    ref,
  ) {
    return (
      <TextInput
        ref={ref}
        multiline={multiline}
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.primary}
        textAlignVertical={multiline ? "top" : "center"}
        {...props}
        style={[
          styles.input,
          shape === "pill" ? styles.pill : styles.box,
          multiline && styles.multiline,
          { backgroundColor: fill, boxShadow: drop(offset) },
          style,
        ]}
      />
    );
  },
);

const styles = StyleSheet.create({
  input: {
    borderWidth: brut.border,
    borderColor: brut.ink,
    color: brut.ink,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  pill: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
  },
  box: {
    minHeight: 48,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: radii.sm,
  },
  multiline: {
    minHeight: 84,
    lineHeight: 21,
  },
});
