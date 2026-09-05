import { Router, json, type Request, type RequestHandler } from "express";
 
import { AppError } from "../../errors/appError.js";
import {
    createSession,
    verifyWebhookSignature,
    type DiditWebhookEvent,
} from "../service/id_verification.service.js";
import {
    toVerificationStatus,
    verificationRepo,
} from "../repository/id_verification.repo.js";
 
/*
 * This exists as a placeholder as auth isn't pushed yet. every
 * reference to req.user in this module goes through here, so adopting the real
 * auth layer will be a change to this function
 *
 * Will req.user.id  be the internal integer or the provider's auth_provider_user_id string? The foreign key will need the internal integer
 */
function readUserId(req: Request): number | undefined {
    const { user } = req as Request & { user?: { id?: unknown } };
 
    // Number.isInteger rather than typeof, so an id parsed from a token with Number() cannot slip through as NaN and fail later on the foreign key
    return Number.isInteger(user?.id) ? (user?.id as number) : undefined;
}
 
/**
 * Creates a Didit session and returns the hosted URL for the client.
 * Uses User ID to verify that the requester is authenticated.
 *
 * @param req - incoming request
 * @param res - the http response
 * @param next - passes failures to errorHandler
 */
const startVerification: RequestHandler = async function (req, res, next) {
    const userId = readUserId(req);
 
    if (userId === undefined) {
        next(
            new AppError({
                statusCode: 401,
                code: "UNAUTHENTICATED",
                message: "You must be signed in to verify your age",
            }),
        );
 
        return;
    }
 
    try {
        const session = await createSession(userId);
        await verificationRepo.createPending(userId, session.session_id);
 
        console.log({
            scope: "didit",
            action: "sessionCreated",
            userId,
            sessionId: session.session_id,
        });
 
        res.json({ url: session.url, sessionId: session.session_id });
 
        return;
    } catch (error) {
        console.error({ scope: "didit", action: "startVerification", userId, error });
        next(error);
 
        return;
    }
};
 
/**
 * receives status updates from Didit
 *
 * responds directly rather than going through AppError and errorHandler. the
 * caller is a machine that only reads the status code, and the codes carry
 * meaning here: 401 is a permanent rejection, 200 means settled so stop
 * sending, and 500 asks for a retry (roughly twice more over five minutes)
 *
 * returning 200 on a failed write would tell Didit the delivery succeeded and
 * lose the event permanently, so failures must surface as 500
 *
 * @param req - the delivery, with the parsed body
 * @param res - the http response, read by Didit as an acknowledgement
 */
const handleWebhook: RequestHandler = async function (req, res) {
    const valid = verifyWebhookSignature(
        req.body,
        req.get("x-signature-v2"),
        req.get("x-timestamp"),
    );
 
    if (!valid) {
        console.warn({ scope: "didit", action: "webhookRejected" });
        res.status(401).json({ ok: false });
 
        return;
    }
 
    const event = req.body as DiditWebhookEvent;
 
    // status.updated is the only subscribed type, but a destination can be
    // reconfigured in the console without a deploy
    if (event.webhook_type !== "status.updated" || !event.session_id) {
        res.status(200).json({ ok: true });
 
        return;
    }
 
    // v3 deliveries carry no event id, so the idempotency key is derived. a
    // session reaches each status once, and a retry repeats both fields, so
    // this collides exactly when it should.
    // x-request-id is not usable for this: it sits alongside sentry trace
    // headers and is generated per http request, so a retry would get a fresh
    // one and be processed as new
    const eventKey = `${event.session_id}:${event.status}`;
 
    try {
        const result = await verificationRepo.applyWebhookStatus(
            eventKey,
            event.session_id,
            toVerificationStatus(event.status),
        );
 
        console.log({
            scope: "didit",
            action: "webhookProcessed",
            eventKey,
            sessionId: event.session_id,
            status: event.status,
            result,
        });
 
        res.status(200).json({ ok: true });
 
        return;
    } catch (error) {
        console.error({
            scope: "didit",
            action: "webhookFailed",
            eventKey,
            sessionId: event.session_id,
            error,
        });
 
        res.status(500).json({ ok: false });
 
        return;
    }
};
 
const router = Router();
 
router.post("/start", startVerification);
 
// json() is listed explicitly so this works whether or not app.ts applies it
// globally. X-Signature-V2 signs canonical json rather than raw bytes, so
// re-encoding by the parser is harmless
router.post("/webhook", json(), handleWebhook);
 
export default router;