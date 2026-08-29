import { AppError } from "../../errors/appError.js";
 
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
 
const BASE_URL = process.env.DIDIT_BASE_URL ?? "https://verification.didit.me/v3";
const API_KEY = required("DIDIT_API_KEY");
const WORKFLOW_ID = required("DIDIT_WORKFLOW_ID");
const CALLBACK_URL = required("DIDIT_CALLBACK_URL");
 
const REQUEST_TIMEOUT_MS = 10_000;
 
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