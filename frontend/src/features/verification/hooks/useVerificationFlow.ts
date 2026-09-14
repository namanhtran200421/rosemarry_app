import { useCallback, useEffect, useRef, useState } from "react";
import { Linking } from "react-native";

import { environment } from "../../../shared/config/environment";
import {
  fetchVerificationState,
  startVerification,
  type VerificationStatus,
} from "../api/verification-api";
import {
  isSettledVerificationStatus,
  resolveVerificationPhase,
  type VerificationPhase,
} from "../state/verification-state";

const POLL_INTERVAL_MS = 2_000;
const POLL_TIMEOUT_MS = 90_000;

type GetAccessToken = () => Promise<string>;

export interface VerificationFlow {
  phase: VerificationPhase;
  status: VerificationStatus | null;
  timedOut: boolean;
  start: () => void;
  refresh: () => void;
}

export function useVerificationFlow(
  getAccessToken: GetAccessToken,
): VerificationFlow {
  const [phase, setPhase] = useState<VerificationPhase>("busy");
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;

    return () => {
      activeRef.current = false;
    };
  }, []);

  const applyState = useCallback(
    (state: Awaited<ReturnType<typeof fetchVerificationState>>) => {
      setStatus(state.status);
      setPhase(resolveVerificationPhase(state));
    },
    [],
  );

  const refreshRequest = useCallback(async () => {
    setPhase("busy");
    setTimedOut(false);

    if (environment.authMode === "mock") {
      setPhase("idle");
      return;
    }

    try {
      const token = await getAccessToken();
      const state = await fetchVerificationState(token);

      if (activeRef.current) {
        applyState(state);
      }
    } catch {
      if (activeRef.current) {
        setPhase("error");
      }
    }
  }, [applyState, getAccessToken]);

  const poll = useCallback(async () => {
    const deadline = Date.now() + POLL_TIMEOUT_MS;

    while (activeRef.current && Date.now() < deadline) {
      try {
        const token = await getAccessToken();
        const state = await fetchVerificationState(token);

        if (!activeRef.current) {
          return;
        }

        applyState(state);

        if (state.ageVerified || isSettledVerificationStatus(state.status)) {
          return;
        }
      } catch {
        // Webhook delivery can race a transient request failure; retry briefly.
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    if (activeRef.current) {
      setTimedOut(true);
    }
  }, [applyState, getAccessToken]);

  const startRequest = useCallback(async () => {
    setPhase("busy");
    setTimedOut(false);

    if (environment.authMode === "mock") {
      await Promise.resolve();

      if (activeRef.current) {
        setStatus("APPROVED");
        setPhase("approved");
      }

      return;
    }

    try {
      const token = await getAccessToken();
      const session = await startVerification(token);
      await Linking.openURL(session.url);

      if (!activeRef.current) {
        return;
      }

      await poll();
    } catch {
      if (activeRef.current) {
        setPhase("error");
      }
    }
  }, [getAccessToken, poll]);

  useEffect(() => {
    const initialCheck = setTimeout(() => {
      void refreshRequest();
    }, 0);

    return () => clearTimeout(initialCheck);
  }, [refreshRequest]);

  return {
    phase,
    status,
    timedOut,
    start: () => void startRequest(),
    refresh: () => void refreshRequest(),
  };
}
