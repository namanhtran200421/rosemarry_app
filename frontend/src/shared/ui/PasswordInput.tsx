import { Feather } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import { type TextInput } from "react-native";

import { colors } from "../theme/tokens";
import { AppTextInput, type AppTextInputProps } from "./AppTextInput";
import { IconButton } from "./IconButton";

type PasswordInputProps = Omit<AppTextInputProps, "secureTextEntry">;

/**
 * Masked password field with an accessible show or hide control.
 *
 * @param props - The same labels, validation, and keyboard settings accepted
 * by the shared text input.
 * @returns A password input that can reveal its value without losing focus.
 */
export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const actionLabel = isPasswordVisible ? "Hide password" : "Show password";

    return (
      <AppTextInput
        {...props}
        ref={ref}
        secureTextEntry={!isPasswordVisible}
        trailingControl={
          <IconButton
            accessibilityLabel={actionLabel}
            onPress={() => setIsPasswordVisible((isVisible) => !isVisible)}
            size={44}
            variant="ghost"
          >
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={colors.textSecondary}
            />
          </IconButton>
        }
      />
    );
  },
);
