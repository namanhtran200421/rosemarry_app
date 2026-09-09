import type { PropsWithChildren } from "react";

import { LoadingScreen } from "../../../shared/ui/LoadingScreen";
import { useVerificationFlow } from "../hooks/UseVerificationFlow";
import { VerificationScreen } from "../screens/VerificationScreen";

/**
 * Stands between an authenticated session and the rest of the app.
 *
 * Owns the single instance of useVerificationFlow, so polling happens once
 * rather than in every screen that cares about verification state.
 *
 * Placed here rather than in the sign-up flow on purpose: a user who abandons
 * verification and reopens the app later, or who lands somewhere from a
 * notification, passes through the same check.
 */
export function VerificationGate({ children }: PropsWithChildren) {
  const { phase, status, timedOut, start, refresh } = useVerificationFlow();

  if (phase === "approved") {
    return <>{children}</>;
  }

  // timedOut leaves the phase at busy, since the check really is still
  // running. the screen takes over at that point so the user is not left
  // watching a spinner with no way out
  if (phase === "busy" && !timedOut) {
    return <LoadingScreen label="Checking your verification" />;
  }

  return (
    <VerificationScreen
      phase={phase}
      status={status}
      timedOut={timedOut}
      onStart={start}
      onRefresh={refresh}
    />
  );
}
