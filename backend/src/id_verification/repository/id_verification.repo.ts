import pool from "../../config/database.js";
import type { VerificationStatus, VerificationType } from "../types/verification_types.js";
import type { DiditStatus } from "../service/id_verification.service.js";
import type { VerificationRecord } from "../types/verification_types.js";
 
/* every row this module writes is ours */
const PROVIDER = "didit";
 
/** outcome of applying one webhook delivery, for logging */
export type WebhookApplyResult =
    | "applied"
    | "duplicate"
    | "unknown_session"
    | "already_approved";
 
/**
 * collapses Didit's ten statuses onto the five in verification_status_enum
 *
 * Abandoned and Expired both mean the attempt
 * is dead and needs a fresh session, and Kyc Expired is irrelevant to age since someone verified as over 18 will remain verified (age cant decrease)
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
 
 
/**
 * translates a Didit status into the database enum
 *
 * @param status - the status string from a session or webhook
 * @returns the matching verification_status_enum value
 */
export function toVerificationStatus(status: DiditStatus): VerificationStatus {
    return STATUS_MAP[status];
}
 
/** matches postgres rows */
interface VerificationRow {
    verification_id: number;
    user_id: number;
    verification_type: VerificationType | null;
    provider: string;
    provider_reference: string | null;
    status: VerificationStatus;
    verified_at: Date | null;
    expires_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
 
const RETURNED_COLUMNS = `
    verification_id,
    user_id,
    verification_type,
    provider,
    provider_reference,
    status,
    verified_at,
    expires_at,
    created_at,
    updated_at
`;
 
/**
 * Helper function that converts a database row to camelCase for convenience
 *
 * @param row - a row from id_verifications
 * @returns the mapped record
 */
function toRecord(row: VerificationRow): VerificationRecord {
    return {
        verificationId: row.verification_id,
        userId: row.user_id,
        verificationType: row.verification_type,
        provider: row.provider,
        providerReference: row.provider_reference,
        status: row.status,
        verifiedAt: row.verified_at,
        expiresAt: row.expires_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
 
/**
 * Helper function that asserts a query returned at least one row
 *
 * @param rows - result rows from a query expected to return one
 * @param context - what was being queried (for the error message)
 * @returns the first row
 */
function verifyRow<T>(rows: T[], context: string): T {
    const row = rows[0];
 
    if (!row) {
        throw new Error(`expected one row from ${context}, got none`);
    }
 
    return row;
}
 
export interface VerificationRepo {
     /**
     * records a session that has been created but not yet attempted
     *
     * verification_type is left null because no document has been presented,
     * and users who pass facial estimation wont need to 
     *
     * @param userId - internal users.user_id the attempt belongs to
     * @param sessionId - Didit's session id stored as provider_reference
     * @returns the inserted row
     */
    createPending(userId: number, sessionId: string): Promise<VerificationRecord>;
    
    /**
     * finds a user's most recent attempt
     *
     * @param userId - the user to look up
     * @returns the newest row, or null if they have never started one
     */
    findLatestByUserId(userId: number): Promise<VerificationRecord | null>;
 
     /**
     * checks whether the user has ever been approved
     *
     * expires_at is deliberately ignored because
     * someone verified as over 18 will forever remain verified
     * though this may change in the future if re-verification is required
     *
     * @param userId - the user to check
     * @returns true if any attempt reached APPROVED
     */
    isUserVerified(userId: number): Promise<boolean>;
 
    /**
     * claims an event id and applies its status in a single transaction
     *
     * both halves must commit together. claiming without applying would mark
     * the delivery processed while leaving the row untouched, and since a
     * retry is then rejected as a duplicate, that status would never land
     *
     * rows already at APPROVED are left alone. age does not lapse, so a later
     * Declined or Expired must not revoke a verification, and deliveries can
     * arrive out of order
     *
     * @param eventId - the delivery's event_id, reused across retries
     * @param sessionId - Didit's session id, matched against provider_reference
     * @param status - the mapped verification_status_enum value
     * @returns what happened, for logging
     */
    applyWebhookStatus(
        eventId: string,
        sessionId: string,
        status: VerificationStatus,
    ): Promise<WebhookApplyResult>;
}
 
 
export const verificationRepo: VerificationRepo = {
    async createPending(userId, sessionId) {
        const { rows } = await pool.query<VerificationRow>(
            `insert into id_verifications
                (user_id, verification_type, provider, provider_reference, status)
             values ($1, null, $2, $3, 'PENDING')
             returning ${RETURNED_COLUMNS}`,
            [userId, PROVIDER, sessionId],
        );
 
        return toRecord(verifyRow(rows, "insert into id_verifications"));
    },
 
    async findLatestByUserId(userId) {
        const { rows } = await pool.query<VerificationRow>(
            `select ${RETURNED_COLUMNS}
             from id_verifications
             where user_id = $1
             order by created_at desc
             limit 1`,
            [userId],
        );
 
        const row = rows[0];
 
        return row ? toRecord(row) : null;
    },
 
    async isUserVerified(userId) {
        const { rows } = await pool.query<{ verified: boolean }>(
            `select exists (
                select 1
                from id_verifications
                where user_id = $1
                  and status = 'APPROVED'
             ) as verified`,
            [userId],
        );
 
        return rows[0]?.verified ?? false;
    },
 
    async applyWebhookStatus(eventId, sessionId, status) {
        const client = await pool.connect();
 
        try {
            await client.query("begin");
 
            const claim = await client.query(
                `insert into verification_events (event_id)
                 values ($1)
                 on conflict (event_id) do nothing
                 returning event_id`,
                [eventId],
            );
 
            if ((claim.rowCount ?? 0) === 0) {
                await client.query("rollback");
 
                return "duplicate";
            }
 
            const updated = await client.query(
                `update id_verifications
                 set status = $1::verification_status_enum,
                     verified_at = case
                         when $1::verification_status_enum = 'APPROVED' and verified_at is null
                         then now()
                         else verified_at
                     end
                 where provider = $2
                   and provider_reference = $3
                   and status <> 'APPROVED'
                 returning verification_id`,
                [status, PROVIDER, sessionId],
            );
 
            await client.query("commit");
 
            if ((updated.rowCount ?? 0) > 0) {
                return "applied";
            }
 
            // either no row for this session, or it was already approved.
            // both are benign, so this only sharpens the log line
            const existing = await pool.query<{ status: VerificationStatus }>(
                `select status
                 from id_verifications
                 where provider = $1 and provider_reference = $2`,
                [PROVIDER, sessionId],
            );
 
            return existing.rows[0] ? "already_approved" : "unknown_session";
        } catch (error) {
            await client.query("rollback").catch(() => undefined);
 
            throw error;
        } finally {
            client.release();
        }
    },
};