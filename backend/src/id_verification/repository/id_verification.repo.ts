import pool, { db } from "../../config/database.js";
import type { VerificationStatus } from "../types/verification_types.js";
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
        return db
            .insertInto("idVerifications")
            .values({
                userId,
                verificationType: null,
                provider: PROVIDER,
                providerReference: sessionId,
                status: "PENDING",
            })
            .returningAll()
            .executeTakeFirstOrThrow(
                () => new Error("expected one row from insert into id_verifications, got none"),
            );
    },

    async findLatestByUserId(userId) {
        const record = await db
            .selectFrom("idVerifications")
            .selectAll()
            .where("userId", "=", userId)
            .orderBy("createdAt", "desc")
            .limit(1)
            .executeTakeFirst();

        return record ?? null;
    },

    async isUserVerified(userId) {
        const approved = await db
            .selectFrom("idVerifications")
            .select("verificationId")
            .where("userId", "=", userId)
            .where("status", "=", "APPROVED")
            .limit(1)
            .executeTakeFirst();

        return approved !== undefined;
    },

    // Left on the raw pool deliberately. This is the webhook idempotency path,
    // and its enum casts and conditional verified_at would become sql`` escape
    // hatches under the query builder, buying churn rather than safety.
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