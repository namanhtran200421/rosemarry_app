import { forwardRef, type ReactNode, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

import {
  brut,
  colors,
  drop,
  fonts,
  layout,
  radii,
  spacing,
  typography,
} from "../theme/tokens";

export interface AppTextInputProps extends TextInputProps {
  label: string;
  helperText?: string;
  errorText?: string;
  /** Decorative icon displayed inside the left edge, e.g. a location pin. */
  leadingIcon?: ReactNode;
  /** Optional control displayed inside the right edge of the input. */
  trailingControl?: ReactNode;
}

/**
 * Shared text field with stable help/error space and accessible input states.
 * The field is a white outlined pill; focus swaps its ink drop for brand pink.
 */
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
      leadingIcon,
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
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: hasError ? colors.danger : brut.ink,
              boxShadow: drop(
                isFocused ? 4 : 3,
                isFocused ? colors.primary : brut.ink,
              ),
            },
            !editable && styles.inputDisabled,
          ]}
        >
          {leadingIcon ? (
            <View
              accessible={false}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={styles.leadingIcon}
            >
              {leadingIcon}
            </View>
          ) : null}
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
            placeholderTextColor={colors.textSecondary}
            selectionColor={colors.primary}
            style={[
              styles.input,
              Boolean(leadingIcon) && styles.inputWithLeadingIcon,
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
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: typography.callout.fontSize,
    lineHeight: typography.callout.lineHeight,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: layout.fieldHeight,
    borderWidth: brut.border,
    borderRadius: radii.pill,
    backgroundColor: brut.white,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  leadingIcon: {
    paddingLeft: 18,
  },
  input: {
    flex: 1,
    minWidth: 0,
    alignSelf: "stretch",
    paddingHorizontal: 18,
    paddingVertical: spacing.md,
    color: brut.ink,
    fontFamily: fonts.regular,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  inputWithLeadingIcon: {
    paddingLeft: 10,
  },
  inputWithTrailingControl: {
    paddingRight: spacing.sm,
  },
  trailingControl: {
    marginRight: 5,
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
