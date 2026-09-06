import { forwardRef, type ReactNode, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

import {
  colors,
  fonts,
  layout,
  radii,
  shadows,
  spacing,
  typography,
} from "../theme/tokens";

export interface AppTextInputProps extends TextInputProps {
  label: string;
  helperText?: string;
  errorText?: string;
  /** Optional control displayed inside the right edge of the input. */
  trailingControl?: ReactNode;
}

/** Shared text field with stable help/error space and accessible input states. */
export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  function AppTextInput(
    {
      label,
      helperText,
      errorText,
      editable = true,
      onBlur,
      onFocus,
      style,
      trailingControl,
      ...textInputProps
    },
    ref,
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const supportingText = errorText ?? helperText ?? " ";
    const hasError = Boolean(errorText);

    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            {...textInputProps}
            ref={ref}
            accessibilityLabel={textInputProps.accessibilityLabel ?? label}
            accessibilityHint={
              textInputProps.accessibilityHint ??
              (supportingText.trim() || undefined)
            }
            accessibilityState={{ disabled: !editable }}
            aria-invalid={hasError}
            editable={editable}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            placeholderTextColor={colors.textFaint}
            selectionColor={colors.primary}
            style={[
              styles.input,
              isFocused && styles.inputFocused,
              hasError && styles.inputError,
              !editable && styles.inputDisabled,
              Boolean(trailingControl) && styles.inputWithTrailingControl,
              style,
            ]}
          />
          {trailingControl ? (
            <View style={styles.trailingControl}>{trailingControl}</View>
          ) : null}
        </View>
        <Text
          accessibilityElementsHidden={!supportingText.trim()}
          accessibilityLiveRegion={hasError ? "polite" : "none"}
          style={[styles.supportingText, hasError && styles.errorText]}
        >
          {supportingText}
        </Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: typography.callout.fontSize,
    lineHeight: typography.callout.lineHeight,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    minHeight: layout.fieldHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 18,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    ...shadows.xs,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    paddingHorizontal: 17,
    paddingVertical: spacing.md - 1,
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  inputWithTrailingControl: {
    paddingRight: 58,
  },
  trailingControl: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  supportingText: {
    minHeight: typography.caption.lineHeight,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  errorText: {
    color: colors.dangerStrong,
  },
});
