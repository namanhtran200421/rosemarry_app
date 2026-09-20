import type { DiditStatus } from "./didit.client.js";
import type { VerificationStatus } from "./verification.types.js";

/**
 * Collapses Didit's provider statuses into Rosemarry's verification states.
 *
 * Abandoned and expired attempts require a fresh session. A provider-side KYC
 * expiry is also treated as an expired attempt; a previously approved user
 * remains approved because the repository never overwrites an approval.
 */
const STATUS_MAP: Record<DiditStatus, VerificationStatus> = {
  "Not Started": "PENDING",
  "In Progress": "PENDING",
  "Awaiting User": "PENDING",
  Resubmitted: "PENDING",
  "In Review": "IN_REVIEW",
  Approved: "APPROVED",
  Declined: "REJECTED",
  Abandoned: "EXPIRED",
  Expired: "EXPIRED",
  "Kyc Expired": "EXPIRED",
};

/** Translates a Didit status into the application's verification status. */
export function toVerificationStatus(
  status: DiditStatus,
): VerificationStatus {
  return STATUS_MAP[status];
}
