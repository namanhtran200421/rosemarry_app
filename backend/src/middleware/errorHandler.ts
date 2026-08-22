import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../errors/appError";

/**
 * checks if an unknown error is a JSON syntax error
 * caused by a incorrect (malformed) request body from user
 *
 * @param err - the error to check
 * @returns True if the error is a SyntaxError with HTTP status 400
 */
function isJsonSyntaxErr(
  err: unknown,
): err is SyntaxError & { status: number } {
  return err instanceof SyntaxError && "status" in err && err.status === 400;
}

function isAppError(err:unknown): err is AppError{
    return (typeof err == 'object' && err !== null && 'statusCode' in err && 'code' in err && 'message' in err)
};

/**
 * console.error logs errors
 * return json error response
 * handle application errors, and malform json reqs and unexpected server errors
 * @param error - error being handled
 * @param req - the incoming http requests
 * @param res - the http response
 * @param next - not used, but kept (pass control to another function)
 * @returns
 */
export const errorHandler: ErrorRequestHandler = function (
  error,
  req,
  res,
  next,
) {
  // leave this for logging for now
  console.error({ method: req.method, path: req.originalUrl, error });

  // error's description fields must exist in AppError blueprint
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

  // Handles malformed JSON
  if (isJsonSyntaxErr(error)) {
    res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "The request body contains invalid JSON",
      },
    });

    return;
  }

  // and the classic unexpected server error
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
 * Handle request that dont match any route
 * Forwards a status 404 to AppError
 * Since route not found is not a typical Express error
 *
 * @param req - incoming requests
 * @param res - responses
 * @param next - continue through express next function
 */
export const notFound: RequestHandler = function (req, res, next) {
  next(
    new AppError({
      statusCode: 404,
      code: "ROUTE_NOT_FOUND",
      message: `Cannot ${req.method} ${req.originalUrl}`,
    }),
  );
};
