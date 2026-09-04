import { useCallback, useEffect, useState } from "react";

const MILLISECONDS_PER_SECOND = 1_000;

interface ResendCountdown {
  secondsRemaining: number;
  restart: () => void;
}

/**
 * Tracks a resend delay against wall-clock time, so backgrounding the app does
 * not make the displayed countdown drift.
 */
export function useResendCountdown(delaySeconds: number): ResendCountdown {
  const [availableAt, setAvailableAt] = useState(
    () => Date.now() + delaySeconds * MILLISECONDS_PER_SECOND,
  );
  const [secondsRemaining, setSecondsRemaining] = useState(delaySeconds);

  useEffect(() => {
    if (secondsRemaining === 0) {
      return;
    }

    const remainingMilliseconds = Math.max(0, availableAt - Date.now());
    const timeout = setTimeout(
      () => {
        setSecondsRemaining(
          Math.ceil(
            Math.max(0, availableAt - Date.now()) / MILLISECONDS_PER_SECOND,
          ),
        );
      },
      Math.min(MILLISECONDS_PER_SECOND, remainingMilliseconds),
    );

    return () => clearTimeout(timeout);
  }, [availableAt, secondsRemaining]);

  const restart = useCallback(() => {
    setAvailableAt(Date.now() + delaySeconds * MILLISECONDS_PER_SECOND);
    setSecondsRemaining(delaySeconds);
  }, [delaySeconds]);

  return { secondsRemaining, restart };
}
