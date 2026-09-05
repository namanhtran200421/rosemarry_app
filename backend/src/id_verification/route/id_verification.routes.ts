import { Response, Router, type Request, type RequestHandler } from "express";
 
import { AppError } from "../../errors/appError.js";
import { createSession } from "../service/id_verification.service.js";
import { verificationRepo } from "../repository/id_verification.repo.js";

/**
 * Returns the internal Rosemarry user ID populated by
 * requireApplicationUser.
 *
 * Keeping the undefined case provides defense in depth if the router is ever
 * mounted without its required authentication middleware.
 * 
 * Steve fix: simpified the function.
 */
function readUserId(req: Request): number | undefined {
  return req.user?.id;
}
 
/**
 * Creates a Didit session and returns the hosted URL for the client.
 * Uses User ID to verify that the requester is authenticated.
 *
 * @param req - incoming request
 * @param res - the http response
 * @param next - passes failures to errorHandler
 */
const startVerification: RequestHandler = async function (req:Request, res:Response, next) {
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