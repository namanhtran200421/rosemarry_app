// Types for error handlers, will be gone in runtime
// see more documentation on how interface work with TypeScript Nodejs if curious
export interface AppErrorOptions {
  statusCode: number; // status code
  code: string; // e.g. USER_NOT_FOUND
  message: string; // user-safe error message
  details?: unknown; // extra information
  cause?: unknown; // original error that caused the application error
}
