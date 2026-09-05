import type { Request, RequestHandler } from "express";
import { auth } from "express-oauth2-jwt-bearer";

import { findActiveApplicationUser } from "../authentication/service/auth.service.js";
import { env } from "../config/env.js";
import { AppError } from "../errors/appError.js";

/**
 * Checks Auth0 access tokens before protected route handlers run.
 *
 * This middleware checks the token's signature, issuer, audience, and expiry.
 * When validation succeeds, the verified token data is available at
 * `req.auth.payload`. When validation fails, the shared error handler returns
 * a 401 response to the client.
 */
export const validateAccessToken = auth({
  issuerBaseURL: env.auth0.issuerBaseUrl,
  audience: env.auth0.audience,
});

/**
 * Reads the user ID from an access token that Auth0 has already verified.
 *
 * This function must only run after `validateAccessToken`. Reading data from a
 * token that has not been verified would allow a client to fake its identity.
 *
 * @param req - Express request containing the verified Auth0 token.
 * @returns The external Auth0 user ID stored in the token's `sub` field.
 * @throws AppError when the verified token does not identify a user.
 */
export function readAuthenticatedSubject(req: Request): string {
  const subject = req.auth?.payload.sub;

  if (typeof subject !== "string" || subject.length === 0) {
    throw new AppError({
      statusCode: 401,
      code: "INVALID_TOKEN_SUBJECT",
      message: "The access token does not identify a user",
    });
  }

  return subject;
}

/**
 * Connects a verified Auth0 identity to a Rosemarry database user.
 *
 * After this middleware succeeds, later handlers can safely use `req.user.id`
 * and `req.user.role`. Both values come from the backend, not from client input.
 *
 * @param req - Express request containing the verified Auth0 identity.
 * @param _res - Express response. It is not used by this middleware.
 * @param next - Continues the request or forwards an authentication error.
 * @returns A promise that completes when the user lookup is finished.
 */
export const requireApplicationUser: RequestHandler = async function (
  req,
  _res,
  next,
) {
  try {
    // Auth0 user ID, such as "sms|abc123".
    const providerUserId = readAuthenticatedSubject(req);

    // Find the internal Rosemarry user and confirm the account is active.
    const user = await findActiveApplicationUser(providerUserId);

    // Store only trusted identity data for later route handlers.
    req.user = {
      id: user.userId,
      role: user.role,
    };

    next();
  } catch (error) {
    // Let the shared error handler create the correct client response.
    next(error);
  }
};
