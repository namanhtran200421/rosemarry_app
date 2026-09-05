import crypto from "node:crypto";
 
import { AppError } from "../../errors/appError.js";
 
/**
 * reads a required environment variable and rejects quoted values
 *
 * @param name - the environment variable to read
 * @returns the trimmed value
 */
function required(name: string): string {
    const raw = process.env[name];
 
    if (!raw) {
        throw new Error(`Missing required env var: ${name}`);
    }
 
    const value = raw.trim();
 
    if (/^["'].*["']$/.test(value)) {
        throw new Error(`${name} is wrapped in quotes, remove them.`);
    }
 
    return value;
}
 
// || rather than ?? so an empty DIDIT_BASE_URL in .env falls back to the
// default. ?? only catches undefined, and an empty value produced a request to
// "/session/" with no host
const BASE_URL =
    process.env.DIDIT_BASE_URL?.trim() || "https://verification.didit.me/v3";
const API_KEY = required("DIDIT_API_KEY");
const WORKFLOW_ID = required("DIDIT_WORKFLOW_ID");
const CALLBACK_URL = required("DIDIT_CALLBACK_URL");
const WEBHOOK_SECRET = required("DIDIT_WEBHOOK_SECRET");
 
const REQUEST_TIMEOUT_MS = 10_000;
 
/** how far a delivery's timestamp may drift before it is treated as a replay */
const SIGNATURE_MAX_AGE_S = 300;
 
/** exact, case-sensitive status strings Didit sends — note the single capital K */
export type DiditStatus =
    | "Not Started"
    | "In Progress"
    | "Approved"
    | "Declined"
    | "In Review"
    | "Abandoned"
    | "Resubmitted"
    | "Awaiting User"
    | "Expired"
    | "Kyc Expired";
 
export interface DiditSession {
    session_id: string;
    session_number: number;
    session_token: string;
    status: DiditStatus;
    url: string;
    vendor_data?: string;
    workflow_id?: string;
}
 
export interface DiditWebhookEvent {
    webhook_type: string;
    timestamp: number;
    created_at: number;
    status: DiditStatus;
    session_id?: string;
    vendor_data?: string;
    workflow_id?: string;
    metadata?: unknown;
    /** present on resolved statuses, not read here since only the status matters */
    decision?: unknown;
}
 
/**
 * reserves a verification session with Didit and returns a hosted URL
 * result will arrive later through the webhook
 *
 * @param userId internal users.user_id, sent as vendor_data and echoed back on the webhook
 * @returns the created session, including the URL to send the user to
 */
export async function createSession(userId: number): Promise<DiditSession> {
    let response: Response;
 
    try {
        response = await fetch(`${BASE_URL}/session/`, {
            method: "POST",
            headers: {
                "x-api-key": API_KEY,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                workflow_id: WORKFLOW_ID,
                // vendor_data is a string field, so the numeric id is serialised here and will be parsed back on the webhook
                vendor_data: String(userId),
                callback: CALLBACK_URL,
            }),
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch (cause) {
        // network failure, or the timeout firing
        console.error({ scope: "didit", action: "createSession", userId, cause });
 
        throw new AppError({
            statusCode: 502,
            code: "VERIFICATION_UNAVAILABLE",
            message: "Could not reach the verification provider",
        });
    }
 
    if (!response.ok) {
        const detail = await response.text().catch(() => "");
 
        console.error({
            scope: "didit",
            action: "createSession",
            userId,
            status: response.status,
            detail,
        });
 
        throw new AppError({
            statusCode: 502,
            code: "VERIFICATION_UNAVAILABLE",
            message: "Could not start verification right now",
        });
    }
 
    return (await response.json()) as DiditSession;
}
 
/**
 * rebuilds Didit's json format and sorts keys recursively
 *
 * JSON.stringify already produces compact separators and leaves unicode
 * unescaped, so ordering keys is the only transform needed. whole-valued
 * floats need no handling either, since javascript numbers do not distinguish
 * 100 from 100.0
 *
 * @param value - any part of the parsed webhook body
 * @returns the same value with object keys ordered
 */
function canonicalize(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(canonicalize);
    }
 
    if (value !== null && typeof value === "object") {
        const source = value as Record<string, unknown>;
        const sorted: Record<string, unknown> = {};
 
        for (const key of Object.keys(source).sort()) {
            sorted[key] = canonicalize(source[key]);
        }
 
        return sorted;
    }
 
    return value;
}
 
/**
 * verifies an incoming webhook against the shared secret
 *
 * uses X-Signature-V2, which signs canonical json rather than raw bytes, so
 * express.json() re-encoding the body is harmless and no rawBody middleware
 * is needed
 *
 * this is the security boundary of the integration. the endpoint is public,
 * and without this check anyone could post an Approved status for any session
 *
 * @param body - the already-parsed request body
 * @param signature - the X-Signature-V2 header
 * @param timestamp - the X-Timestamp header
 * @returns true if the delivery came from Didit and is recent
 */
export function verifyWebhookSignature(
    body: unknown,
    signature: string | undefined,
    timestamp: string | undefined,
): boolean {
    if (!signature || !timestamp) {
        return false;
    }
 
    const sentAt = Number(timestamp);
 
    if (!Number.isFinite(sentAt)) {
        return false;
    }
 
    const now = Math.floor(Date.now() / 1000);
 
    if (Math.abs(now - sentAt) > SIGNATURE_MAX_AGE_S) {
        return false;
    }
 
    const expected = crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(JSON.stringify(canonicalize(body)), "utf8")
        .digest("hex");
 
    const expectedBuffer = Buffer.from(expected, "utf8");
    const receivedBuffer = Buffer.from(signature, "utf8");
 
    // length check first, since timingSafeEqual throws on mismatched lengths
    return (
        expectedBuffer.length === receivedBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    );
}