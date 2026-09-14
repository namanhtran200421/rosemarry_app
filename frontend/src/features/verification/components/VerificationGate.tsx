import type { PropsWithChildren, ReactNode } from "react";

import { LoadingScreen } from "../../../shared/ui/LoadingScreen";
import { useVerificationFlow } from "../hooks/useVerificationFlow";
import { VerificationScreen } from "../screens/VerificationScreen";

interface VerificationGateProps extends PropsWithChildren {
  getAccessToken: () => Promise<string>;
  accountAction: ReactNode;
}

/** Keeps unverified authenticated users out of onboarding and the main app. */
export function VerificationGate({
  children,
  getAccessToken,
  accountAction,
}: VerificationGateProps) {
  const { phase, status, timedOut, start, refresh } =
    useVerificationFlow(getAccessToken);

  if (phase === "approved") {
    return <>{children}</>;
  }

  if (phase === "busy" && !timedOut) {
    return <LoadingScreen label="Checking your verification" />;
  }

  return (
    <VerificationScreen
      accountAction={accountAction}
      phase={phase}
      status={status}
      timedOut={timedOut}
      onStart={start}
      onRefresh={refresh}
    />
  );
}
