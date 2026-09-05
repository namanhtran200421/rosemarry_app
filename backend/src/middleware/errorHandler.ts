import type { ErrorRequestHandler, RequestHandler } from "express";
import {
  InsufficientScopeError,
  UnauthorizedError,
} from "express-oauth2-jwt-bearer";

import { AppError } from "../errors/appError.js";

/**
 * Checks whether Express rejected a malformed JSON request body.
 *
 * @param error - Any value passed to the Express error handler.
 * @returns `true` when the error represents invalid JSON from the client.
 */
function isJsonSyntaxErr(
  error: unknown,
): error is SyntaxError & { status: number } {
  return (
    error instanceof SyntaxError && "status" in error && error.status === 400
  );
}

/**
 * Converts backend errors into a consistent JSON response for API clients.
 *
 * Known application and authentication errors keep their intended HTTP status.
 * Unexpected errors return a generic 500 response so internal details are not
 * exposed in production.
 *
 * @param error - Error passed by a route or middleware through `next(error)`.
 * @param req - Request that was being processed when the error occurred.
 * @param res - Response used to send the error to the API client.
 * @param _next - Required by Express to recognize this as an error handler.
 * @returns Nothing after the JSON error response has been sent.
 */
export const errorHandler: ErrorRequestHandler = function (
  error,
  req,
  res,
  _next,
) {
  console.error({
    method: req.method,
    path: req.originalUrl,
    error,
  });

  /*
   * Application errors created by our own backend.
   */
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined && {
          details: error.details,
        }),
      },
    });

    return;
  }

  /*
   * Authenticated, but does not have the required scope/permission.
   *
   * 403 = "I know who you are, but you are not allowed to do this."
   */
  if (error instanceof InsufficientScopeError) {
    res
      .status(403)
      .set(error.headers)
      .json({
        error: {
          code: "INSUFFICIENT_SCOPE",
          message: "You do not have permission to access this resource",
        },
      });

    return;
  }

  /*
   * Authentication failed.
   *
   * Examples:
   * - no token
   * - expired token
   * - malformed token
   * - invalid signature
   * - wrong issuer
   * - wrong audience
   *
   * 401 = "You have not successfully authenticated."
   */
  if (error instanceof UnauthorizedError) {
    res
      .status(401)
      .set(error.headers)
      .json({
        error: {
          code: "UNAUTHENTICATED",
          message: "A valid access token is required",
        },
      });

    return;
  }

  /*
   * Invalid JSON request body.
   */
  if (isJsonSyntaxErr(error)) {
    res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "The request body contains invalid JSON",
      },
    });

    return;
  }

  /*
   * Anything we did not expect.
   */
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      ...(process.env.NODE_ENV !== "production" &&
        error instanceof Error && {
          stack: error.stack,
        }),
    },
  });
};

/**
 * Creates a standard 404 error when no registered route matches a request.
 *
 * @param req - Request that did not match a route.
 * @param _res - Express response. The shared error handler sends the response.
 * @param next - Passes the new 404 error to the shared error handler.
 * @returns Nothing after the error has been forwarded.
 */
export const notFound: RequestHandler = function (req, _res, next) {
  next(
    new AppError({
      statusCode: 404,
      code: "ROUTE_NOT_FOUND",
      message: `Cannot ${req.method} ${req.originalUrl}`,
    }),
  );
};
