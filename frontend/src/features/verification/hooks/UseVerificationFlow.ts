import { useCallback, useEffect, useRef, useState } from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
 
import { useAuthSession } from "../../auth/session/AuthSessionContext";
import {
  fetchVerificationState,
  startVerification,
  type VerificationStatus,
} from "../api/verification-api";
 
const POLL_INTERVAL_MS = 2_000;
const POLL_TIMEOUT_MS = 90_000;
 
export type VerificationPhase =
  /** Nothing started yet, or the previous attempt ended and can be retried. */
  | "idle"
  /** Reading current state, or waiting for the webhook to land. */
  | "busy"
  /** Approved. The navigator should move the user on. */
  | "approved"
  /** A person is reviewing a document. This does not resolve in seconds. */
  | "inReview"
  /** Declined, expired, or abandoned. Retryable. */
  | "retryable"
  /** The request failed. Distinct from being declined. */
  | "error";
 
export interface VerificationFlow {
  phase: VerificationPhase;
  status: VerificationStatus | null;
  /** True once polling gave up waiting, so the copy can stop promising a result. */
  timedOut: boolean;
  start: () => void;
  refresh: () => void;
}
 
/**
 * Drives one pass through age verification
 *
 * The hosted flow runs in an auth session browser
 * because camera access is unreliable in a WebView and this flow is entirely
 * camera based.
 *
 * 
 * The browser resolves if the deep link fires, dismiss if the user simply
 * closes it and the outcome reaches the backend by webhook regardless. That
 * means a misconfigured scheme degrades to a slightly slower return rather
 * than a broken flow.
 */
export function useVerificationFlow(): VerificationFlow {
  const { getAccessToken } = useAuthSession();
 
  const [phase, setPhase] = useState<VerificationPhase>("busy");
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [timedOut, setTimedOut] = useState(false);
 
  // guards every setState against a component that unmounted mid-request
  const activeRef = useRef(true);
 
  useEffect(() => {
    activeRef.current = true;
 
    return () => {
      activeRef.current = false;
    };
  }, []);
 
  /**
   * Maps a backend status onto a phase.
   *
   * PENDING is the only one that warrants waiting. IN_REVIEW is settled as far
   * as this screen is concerned. A human is involved and that takes hours, so
   * polling it would spin indefinitely.
   */
  const applyStatus = useCallback((next: VerificationStatus | null) => {
    setStatus(next);
 
    if (next === "APPROVED") {
      setPhase("approved");
      return true;
    }
 
    if (next === "IN_REVIEW") {
      setPhase("inReview");
      return true;
    }
 
    if (next === "REJECTED" || next === "EXPIRED" || next === null) {
      setPhase("retryable");
      return true;
    }
 
    setPhase("busy");
    return false;
  }, []);
 
  /** Reads state once. */
  const refresh = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const state = await fetchVerificationState(token);
 
      if (!activeRef.current) {
        return;
      }
 
      applyStatus(state.status);
    } catch {
      if (activeRef.current) {
        setPhase("error");
      }
    }
  }, [applyStatus, getAccessToken]);
 
  /**
   * Polls until the status settles or the timeout expires.
   *
   * Timing out is not a failure, the verification is still running and the
   * webhook will land eventually. It only means this screen should stop
   * implying a result is seconds away.
   */
  const poll = useCallback(async () => {
    const deadline = Date.now() + POLL_TIMEOUT_MS;
 
    while (activeRef.current && Date.now() < deadline) {
      try {
        const token = await getAccessToken();
        const state = await fetchVerificationState(token);
 
        if (!activeRef.current) {
          return;
        }
 
        if (applyStatus(state.status)) {
          return;
        }
      } catch {
        // a single failed poll is usually transient, so keep trying until the
        // deadline rather than dropping the user into an error state
      }
 
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
 
    if (activeRef.current) {
      setTimedOut(true);
    }
  }, [applyStatus, getAccessToken]);
 
  const start = useCallback(async () => {
    setPhase("busy");
    setTimedOut(false);
 
    try {
      const token = await getAccessToken();
      const session = await startVerification(token);
 
      // resolves on success (deep link fired) or dismiss (user closed it).
      // both mean the same thing here: stop waiting on the browser and ask
      // the backend what happened
      await WebBrowser.openAuthSessionAsync(
        session.url,
        Linking.createURL("verification/done"),
      );
 
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
 
  // a returning user may already be approved, in review, or mid-attempt, so
  // read state before offering to start anything
  useEffect(() => {
    void refresh();
  }, [refresh]);
 
  return {
    phase,
    status,
    timedOut,
    start: () => void start(),
    refresh: () => void refresh(),
  };
}