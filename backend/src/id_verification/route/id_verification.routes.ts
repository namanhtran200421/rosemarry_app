import { Router, type Request, type RequestHandler } from "express";
 
import { AppError } from "../../errors/appError.js";
import { createSession } from "../service/id_verification.service.js";
import { verificationRepo } from "../repository/id_verification.repo.js";

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
 
const router = Router();
 
router.post("/start", startVerification);
 
export default router;