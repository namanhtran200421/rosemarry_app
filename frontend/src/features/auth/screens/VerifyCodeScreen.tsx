import { useRef, useState } from "react";
import { StyleSheet, Text, type TextInput, View } from "react-native";

import { colors, spacing, typography } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppTextInput } from "../../../shared/ui/AppTextInput";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
import { Screen } from "../../../shared/ui/Screen";
import { AuthHeader } from "../components/AuthHeader";
import { useResendCountdown } from "../hooks/useResendCountdown";
import { useAuthSession } from "../session/AuthSessionContext";
import { getAuthenticationErrorMessage } from "../utils/auth-error-message";

const RESEND_DELAY_SECONDS = 30;
const VALID_CODE = /^\d{4,8}$/;

interface VerifyCodeScreenProps {
  phoneNumber: string;
  onChangeNumber: () => void;
}

export function VerifyCodeScreen({
  phoneNumber,
  onChangeNumber,
}: VerifyCodeScreenProps) {
  const { requestSmsCode, status, verifySmsCode } = useAuthSession();
  const [code, setCode] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { secondsRemaining, restart: restartResendCountdown } =
    useResendCountdown(RESEND_DELAY_SECONDS);
  const codeInputRef = useRef<TextInput>(null);
  const isSending = status === "sending-code";
  const isVerifying = status === "verifying-code";
  const isBusy = isSending || isVerifying;

  function handleCodeChange(value: string): void {
    setCode(value.replace(/\D/g, ""));
    setFieldError(null);
    setRequestError(null);
  }

  async function handleVerifyCode(): Promise<void> {
    if (isBusy) {
      return;
    }

    if (!VALID_CODE.test(code)) {
      setFieldError("Enter the code from the text message.");
      codeInputRef.current?.focus();
      return;
    }

    setFieldError(null);
    setRequestError(null);
    setStatusMessage(null);

    try {
      await verifySmsCode(phoneNumber, code);
    } catch (error) {
      setRequestError(getAuthenticationErrorMessage("verify-code", error));
    }
  }

  async function handleResendCode(): Promise<void> {
    if (isBusy || secondsRemaining > 0) {
      return;
    }

    setRequestError(null);
    setStatusMessage(null);

    try {
      await requestSmsCode(phoneNumber);
      restartResendCountdown();
      setStatusMessage("A new verification code was sent.");
    } catch (error) {
      setRequestError(getAuthenticationErrorMessage("send-code", error));
    }
  }

  return (
    <Screen>
      <AuthHeader
        title="Enter your code."
        description={`We sent a verification code to ${phoneNumber}.`}
        onBack={onChangeNumber}
      />

      <View style={styles.form}>
        <AppTextInput
          ref={codeInputRef}
          label="Verification code"
          value={code}
          errorText={fieldError ?? undefined}
          helperText="Enter the code from your text message."
          placeholder="123456"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          autoCorrect={false}
          returnKeyType="done"
          maxLength={8}
          editable={!isBusy}
          onChangeText={handleCodeChange}
          onSubmitEditing={() => {
            void handleVerifyCode();
          }}
        />

        <AppButton
          label="Verify and continue"
          busy={isVerifying}
          disabled={isBusy}
          onPress={function onPressVerifyCode() {
            void handleVerifyCode();
          }}
        />

        <AppButton
          label={
            secondsRemaining > 0
              ? `Resend code in ${secondsRemaining}s`
              : "Resend code"
          }
          intent="neutral"
          busy={isSending}
          disabled={isBusy || secondsRemaining > 0}
          onPress={function onPressResendCode() {
            void handleResendCode();
          }}
        />

        {statusMessage ? (
          <Text accessibilityLiveRegion="polite" style={styles.statusMessage}>
            {statusMessage}
          </Text>
        ) : null}

        {requestError ? <ErrorMessage message={requestError} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  statusMessage: {
    minHeight: typography.body.lineHeight,
    color: colors.textMuted,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
});
