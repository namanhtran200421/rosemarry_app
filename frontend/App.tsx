import {
  DynaPuff_400Regular,
  DynaPuff_500Medium,
  DynaPuff_600SemiBold,
  DynaPuff_700Bold,
  useFonts,
} from "@expo-google-fonts/dynapuff";

import { AppNavigator } from "./src/application/navigation/AppNavigator";
import { AppProviders } from "./src/application/providers/AppProviders";
import { LoadingScreen } from "./src/shared/ui/LoadingScreen";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    DynaPuff_400Regular,
    DynaPuff_500Medium,
    DynaPuff_600SemiBold,
    DynaPuff_700Bold,
  });

  // A font failure falls through to the system face rather than blocking sign-in.
  const canRender = fontsLoaded || fontError !== null;

  return (
    <AppProviders>
      {canRender ? (
        <AppNavigator />
      ) : (
        <LoadingScreen label="Preparing Rosemarry" />
      )}
    </AppProviders>
  );
}
