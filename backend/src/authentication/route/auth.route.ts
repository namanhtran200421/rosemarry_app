import { Router, type RequestHandler } from "express";

import {
  readAuthenticatedSubject,
  validateAccessToken,
} from "../../middleware/auth.middleware.js";
import { createApplicationSession } from "../service/auth.service.js";

/**
 * Creates session data needed by the frontend after login.
 *
 * The access token has already been checked by `validateAccessToken` before
 * this handler runs. This endpoint may create a database user on their first
 * successful login.
 *
 * @param req - Express request containing the verified Auth0 token.
 * @param res - Express response used to return the application session.
 * @param next - Passes errors to the shared Express error handler.
 * @returns A promise that completes after the response has been sent.
 */
const createSessionHandler: RequestHandler = async function (req, res, next) {
  try {
    const providerUserId = readAuthenticatedSubject(req);
    const session = await createApplicationSession(providerUserId);

    res.status(200).json(session);
  } catch (error: unknown) {
    next(error);
  }
};

const router = Router();

/**
 * Exchanges a valid Auth0 access token for session information.
 *
 * The response contains `{ userId, role, profileExists }`.
 */
router.post("/session", validateAccessToken, createSessionHandler);

export default router;
