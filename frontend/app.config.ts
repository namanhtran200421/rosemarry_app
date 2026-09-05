import type { ConfigContext, ExpoConfig } from "expo/config";
import { config as loadEnvironment } from "dotenv";

// Dynamic config is evaluated before Expo loads application variables in some
// commands, so load the project's single environment file explicitly.
// Existing CI/EAS variables keep precedence.
loadEnvironment({ path: ".env", quiet: true });

function requireBuildEnvironmentVariable(
  name: string,
  value: string | undefined,
): string {
  if (!value) {
    throw new Error(`${name} is required to build the native application`);
  }

  return value;
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Rosemarry",
  slug: "rosemarry",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "app.rosemarry.mobile",
  },
  android: {
    package: "app.rosemarry.mobile",
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    [
      "react-native-auth0",
      {
        domain: requireBuildEnvironmentVariable(
          "EXPO_PUBLIC_AUTH0_DOMAIN",
          process.env.EXPO_PUBLIC_AUTH0_DOMAIN,
        ),
        customScheme: "rosemarry",
      },
    ],
    "expo-font",
  ],
});
