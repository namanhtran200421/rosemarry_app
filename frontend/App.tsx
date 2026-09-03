import { AppNavigator } from "./src/application/navigation/AppNavigator";
import { AppProviders } from "./src/application/providers/AppProviders";

export default function App() {
  return (
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  );
}
