import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AdditionalSignInOptions } from "../../features/auth/components/AdditionalSignInOptions";
import { EmailAuthScreen } from "../../features/auth/screens/EmailAuthScreen";
import { LoginScreen } from "../../features/auth/screens/LoginScreen";
import { VerifyCodeScreen } from "../../features/auth/screens/VerifyCodeScreen";
import type { EmailAuthMode } from "../../features/auth/utils/email-credentials";
import { LegalScreen } from "../../features/onboarding/screens/LegalScreen";
import {
  PRIVACY_DOCUMENT,
  TERMS_DOCUMENT,
} from "../../features/onboarding/screens/legal-content";
import { WelcomeScreen } from "../../features/onboarding/screens/WelcomeScreen";

type AuthStackParamList = {
  Welcome: undefined;
  Terms: undefined;
  Privacy: undefined;
  Login: undefined;
  EmailAuth: { initialMode: EmailAuthMode };
  VerifyCode: { phoneNumber: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** Public entry, legal, phone, email/password, and OTP routes. */
export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome">
        {({ navigation }) => (
          <WelcomeScreen
            onStart={() => navigation.navigate("Login")}
            onSignIn={() =>
              navigation.navigate("EmailAuth", { initialMode: "login" })
            }
            onOpenTerms={() => navigation.navigate("Terms")}
            onOpenPrivacy={() => navigation.navigate("Privacy")}
            additionalSignInOptions={
              <AdditionalSignInOptions
                onContinueWithEmail={() =>
                  navigation.navigate("EmailAuth", { initialMode: "create" })
                }
              />
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Terms">
        {({ navigation }) => (
          <LegalScreen
            document={TERMS_DOCUMENT}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Privacy">
        {({ navigation }) => (
          <LegalScreen
            document={PRIVACY_DOCUMENT}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Login">
        {({ navigation }) => (
          <LoginScreen
            onBack={() => navigation.goBack()}
            onContinueWithEmail={() =>
              navigation.navigate("EmailAuth", { initialMode: "login" })
            }
            onCodeSent={(phoneNumber) => {
              navigation.navigate("VerifyCode", { phoneNumber });
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="EmailAuth">
        {({ navigation, route }) => (
          <EmailAuthScreen
            initialMode={route.params.initialMode}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="VerifyCode">
        {({ navigation, route }) => (
          <VerifyCodeScreen
            phoneNumber={route.params.phoneNumber}
            onChangeNumber={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
