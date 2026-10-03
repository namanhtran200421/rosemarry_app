import type { RequestHandler } from "express";

import { readAuthenticatedSubject } from "./auth.middleware.js";
import { createApplicationSession } from "./auth.service.js";

/**
 * Creates session data needed by the frontend after login.
 *
 * The access token has already been validated by middleware
 * before this handler runs.
 */
export const createSessionHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    // Extract the authenticated Auth0 subject from the request.
    const providerUserId = readAuthenticatedSubject(req);

    // Ask the service layer to create/load the application session.
    const session =
      await createApplicationSession(providerUserId);

    // Return HTTP response.
    res.status(200).json(session);
  } catch (error: unknown) {
    // Forward errors to the shared Express error handler.
    next(error);
  }
};