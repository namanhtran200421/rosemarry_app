import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../../features/auth/screens/LoginScreen";
import { VerifyCodeScreen } from "../../features/auth/screens/VerifyCodeScreen";
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
  VerifyCode: { phoneNumber: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** Public entry, legal, phone-number, and OTP routes. */
export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome">
        {({ navigation }) => (
          <WelcomeScreen
            onStart={() => navigation.navigate("Login")}
            onSignIn={() => navigation.navigate("Login")}
            onOpenTerms={() => navigation.navigate("Terms")}
            onOpenPrivacy={() => navigation.navigate("Privacy")}
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
            onCodeSent={(phoneNumber) => {
              navigation.navigate("VerifyCode", { phoneNumber });
            }}
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
