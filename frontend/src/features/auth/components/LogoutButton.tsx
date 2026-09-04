import { useState } from "react";
import { View } from "react-native";

import { AppButton } from "../../../shared/ui/AppButton";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
import { useAuthSession } from "../session/AuthSessionContext";
import { getAuthenticationErrorMessage } from "../utils/auth-error-message";

export function LogoutButton() {
  const { logout, status } = useAuthSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogout(): Promise<void> {
    setErrorMessage(null);

    try {
      await logout();
    } catch (error) {
      setErrorMessage(getAuthenticationErrorMessage("logout", error));
    }
  }

  return (
    <View>
      <AppButton
        label="Log out"
        intent="danger"
        busy={status === "logging-out"}
        onPress={function onPressLogout() {
          void handleLogout();
        }}
      />

      {errorMessage !== null ? <ErrorMessage message={errorMessage} /> : null}
    </View>
  );
}
