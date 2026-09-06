import { useRef, useState } from "react";
import { StyleSheet, type TextInput, View } from "react-native";

import { spacing } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppTextInput } from "../../../shared/ui/AppTextInput";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
import { PasswordInput } from "../../../shared/ui/PasswordInput";
import { Screen } from "../../../shared/ui/Screen";
import { SegmentedControl } from "../../../shared/ui/SegmentedControl";
import { AuthHeader } from "../components/AuthHeader";
import { useAuthSession } from "../session/AuthSessionContext";
import {
  getAccountCreationFieldError,
  getAuthenticationErrorMessage,
} from "../utils/auth-error-message";
import {
  type EmailAuthMode,
  type EmailCredentialErrors,
  normalizeEmail,
  PASSWORD_REQUIREMENT_MESSAGE,
  validateEmailCredentials,
} from "../utils/email-credentials";

interface EmailAuthScreenProps {
  initialMode: EmailAuthMode;
  onBack: () => void;
}

const EMAIL_AUTH_OPTIONS = [
  { value: "login", label: "Log in" },
  { value: "create", label: "Create account" },
];

/** Native email login and account-creation form backed by Auth0. */
export function EmailAuthScreen({ initialMode, onBack }: EmailAuthScreenProps) {
  const {
    createAccountWithEmailPassword,
    signInWithEmailPassword,
    startupError,
    status,
  } = useAuthSession();
  const [mode, setMode] = useState<EmailAuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<EmailCredentialErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const isCreating = mode === "create";
  const isBusy = status === "signing-in";

  /** Switches form purpose while removing passwords from the previous mode. */
  function handleModeChange(value: string): void {
    if (value !== "login" && value !== "create") {
      return;
    }

    setMode(value);
    setPassword("");
    setConfirmPassword("");
    setFieldErrors({});
    setRequestError(null);
  }

  /** Clears a field's stale validation message as the user corrects it. */
  function clearFieldError(field: keyof EmailCredentialErrors): void {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
    setRequestError(null);
  }

  /** Validates the form, then asks Auth0 to log in or create the account. */
  async function handleSubmit(): Promise<void> {
    if (isBusy) {
      return;
    }

    const errors = validateEmailCredentials(mode, {
      email,
      password,
      confirmPassword,
    });
    setFieldErrors(errors);
    setRequestError(null);

    if (errors.email) {
      emailInputRef.current?.focus();
      return;
    }

    if (errors.password) {
      passwordInputRef.current?.focus();
      return;
    }

    if (errors.confirmPassword) {
      confirmPasswordInputRef.current?.focus();
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    setEmail(normalizedEmail);

    try {
      if (isCreating) {
        await createAccountWithEmailPassword(normalizedEmail, password);
      } else {
        await signInWithEmailPassword(normalizedEmail, password);
      }
    } catch (error) {
      // Keep the email for correction, but clear sensitive password values.
      setPassword("");
      setConfirmPassword("");

      const accountFieldError = isCreating
        ? getAccountCreationFieldError(error)
        : null;

      if (accountFieldError) {
        setFieldErrors((currentErrors) => ({
          ...currentErrors,
          [accountFieldError.field]: accountFieldError.message,
        }));
        setRequestError(null);

        if (accountFieldError.field === "email") {
          emailInputRef.current?.focus();
        } else {
          passwordInputRef.current?.focus();
        }

        return;
      }

      setRequestError(
        getAuthenticationErrorMessage(
          isCreating ? "create-account" : "sign-in",
          error,
        ),
      );
    }
  }

  const displayedError = requestError ?? startupError;

  return (
    <Screen>
      <AuthHeader
        title={isCreating ? "Create your account." : "Welcome back."}
        description={
          isCreating
            ? "Use your email and a secure password to get started."
            : "Enter the email and password you used to sign up."
        }
        onBack={onBack}
        compact
        backDisabled={isBusy}
      />

      <View style={styles.form}>
        <SegmentedControl
          accessibilityLabel="Choose email authentication mode"
          options={EMAIL_AUTH_OPTIONS}
          value={mode}
          onChange={handleModeChange}
          disabled={isBusy}
        />

        {displayedError !== null ? (
          <ErrorMessage message={displayedError} />
        ) : null}

        <AppTextInput
          ref={emailInputRef}
          label="Email"
          value={email}
          errorText={fieldErrors.email}
          placeholder="name@example.com"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          editable={!isBusy}
          onChangeText={(value) => {
            setEmail(value);
            clearFieldError("email");
          }}
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />

        <PasswordInput
          ref={passwordInputRef}
          label="Password"
          value={password}
          errorText={fieldErrors.password}
          helperText={
            isCreating ? PASSWORD_REQUIREMENT_MESSAGE : "Enter your password."
          }
          placeholder="Enter your password"
          textContentType={isCreating ? "newPassword" : "password"}
          autoComplete={isCreating ? "new-password" : "current-password"}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType={isCreating ? "next" : "go"}
          editable={!isBusy}
          onChangeText={(value) => {
            setPassword(value);
            clearFieldError("password");
          }}
          onSubmitEditing={() => {
            if (isCreating) {
              confirmPasswordInputRef.current?.focus();
            } else {
              void handleSubmit();
            }
          }}
        />

        {isCreating ? (
          <PasswordInput
            ref={confirmPasswordInputRef}
            label="Confirm password"
            value={confirmPassword}
            errorText={fieldErrors.confirmPassword}
            helperText="Enter the same password again."
            placeholder="Enter your password again"
            textContentType="newPassword"
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            editable={!isBusy}
            onChangeText={(value) => {
              setConfirmPassword(value);
              clearFieldError("confirmPassword");
            }}
            onSubmitEditing={() => {
              void handleSubmit();
            }}
          />
        ) : null}

        <AppButton
          label={isCreating ? "Create account" : "Log in"}
          busy={isBusy}
          disabled={isBusy}
          accessibilityHint={
            isCreating
              ? "Creates your account and signs you in"
              : "Signs in with your email and password"
          }
          onPress={() => {
            void handleSubmit();
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
});
