import pool from "../../config/database.js";
import type { VerificationStatus, VerificationType } from "../types/verification_types.js";
import type { DiditStatus } from "../service/id_verification.service.js";
 import type { VerificationRecord } from "../types/verification_types.js";

 
/* every row this module writes is ours */
const PROVIDER = "didit";
 
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

export function toVerificationStatus(status: DiditStatus): VerificationStatus {
    return STATUS_MAP[status];
}

 
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
 
function expectOne<T>(rows: T[], context: string): T {
    const row = rows[0];
 
    if (!row) {
        throw new Error(`expected one row from ${context}, got none`);
    }
 
    return row;
}
 
export interface VerificationRepo {
    createPending(userId: number, sessionId: string): Promise<VerificationRecord>;
    findLatestByUserId(userId: number): Promise<VerificationRecord | null>;
    isUserVerified(userId: number): Promise<boolean>;
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
 
        return toRecord(expectOne(rows, "insert into id_verifications"));
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
};