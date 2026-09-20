import type { AppErrorOptions } from "./error.types.js";

// just an object to use later
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  // the constructor follows the AppErrorOptions object
  public constructor({
    statusCode,
    code,
    message,
    details,
    cause,
  }: AppErrorOptions) {
    super(message, { cause });

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
