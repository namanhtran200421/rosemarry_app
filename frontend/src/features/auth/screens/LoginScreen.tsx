import { useRef, useState } from "react";
import { StyleSheet, type TextInput, View } from "react-native";

import { spacing } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppTextInput } from "../../../shared/ui/AppTextInput";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
import { Screen } from "../../../shared/ui/Screen";
import { AdditionalSignInOptions } from "../components/AdditionalSignInOptions";
import { AuthHeader } from "../components/AuthHeader";
import { useAuthSession } from "../session/AuthSessionContext";
import { getAuthenticationErrorMessage } from "../utils/auth-error-message";
import {
  isValidPhoneNumber,
  normalizePhoneNumber,
} from "../utils/phone-number";

interface LoginScreenProps {
  onCodeSent: (phoneNumber: string) => void;
  onBack: () => void;
  onContinueWithEmail: () => void;
}

export function LoginScreen({
  onCodeSent,
  onBack,
  onContinueWithEmail,
}: LoginScreenProps) {
  const { requestSmsCode, status } = useAuthSession();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const isSending = status === "sending-code";
  const isAdditionalLoginRunning = status === "signing-in";
  const isBusy = isSending || isAdditionalLoginRunning;

  function handlePhoneNumberChange(value: string): void {
    setPhoneNumber(value);
    setFieldError(null);
    setRequestError(null);
  }

  async function handleSendCode(): Promise<void> {
    if (isBusy) {
      return;
    }

    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

    if (!isValidPhoneNumber(normalizedPhoneNumber)) {
      setFieldError("Enter a mobile number with its country code.");
      phoneInputRef.current?.focus();
      return;
    }

    setPhoneNumber(normalizedPhoneNumber);
    setFieldError(null);
    setRequestError(null);

    try {
      await requestSmsCode(normalizedPhoneNumber);
      onCodeSent(normalizedPhoneNumber);
    } catch (error) {
      setRequestError(getAuthenticationErrorMessage("send-code", error));
    }
  }

  return (
    <Screen>
      <AuthHeader
        title="What’s your mobile number?"
        description="We’ll text you a verification code to sign in securely."
        onBack={onBack}
      />

      <View style={styles.form}>
        <AppTextInput
          ref={phoneInputRef}
          label="Mobile number"
          value={phoneNumber}
          errorText={fieldError ?? undefined}
          helperText="Include your country code, for example +61."
          placeholder="+61 412 345 678"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="send"
          editable={!isBusy}
          onChangeText={handlePhoneNumberChange}
          onSubmitEditing={() => {
            void handleSendCode();
          }}
        />

        <AppButton
          label="Send verification code"
          busy={isSending}
          disabled={isBusy}
          accessibilityHint="Sends a one-time code to this mobile number"
          onPress={function onPressSendCode() {
            void handleSendCode();
          }}
        />

        {requestError !== null ? <ErrorMessage message={requestError} /> : null}

        <AdditionalSignInOptions
          disabled={isSending}
          onContinueWithEmail={onContinueWithEmail}
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
