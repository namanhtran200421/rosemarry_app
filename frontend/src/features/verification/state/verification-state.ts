import type {
  VerificationState,
  VerificationStatus,
} from "../api/verification-api";

export type VerificationPhase =
  "idle" | "busy" | "approved" | "inReview" | "retryable" | "error";

export function resolveVerificationPhase(
  state: VerificationState,
): VerificationPhase {
  if (state.ageVerified || state.status === "APPROVED") {
    return "approved";
  }

  if (state.status === "IN_REVIEW") {
    return "inReview";
  }

  if (
    state.status === "PENDING" ||
    state.status === "REJECTED" ||
    state.status === "EXPIRED"
  ) {
    return "retryable";
  }

  return "idle";
}

export function isSettledVerificationStatus(
  status: VerificationStatus | null,
): boolean {
  return (
    status === "APPROVED" ||
    status === "IN_REVIEW" ||
    status === "REJECTED" ||
    status === "EXPIRED"
  );
}
