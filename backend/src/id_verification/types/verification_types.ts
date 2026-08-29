export type VerificationStatus =
    | "PENDING"
    | "IN_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "EXPIRED";
 
/** matching with verification_type_enum, null when no document is presented */
export type VerificationType =
    | "PASSPORT"
    | "DRIVERS_LICENSE"
    | "NATIONAL_ID"
    | "PROOF_OF_AGE_CARD"
    | "RESIDENCE_PERMIT";

export interface VerificationRecord {
    verificationId: number;
    userId: number;
    verificationType: VerificationType | null;
    provider: string;
    providerReference: string | null;
    status: VerificationStatus;
    verifiedAt: Date | null;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};