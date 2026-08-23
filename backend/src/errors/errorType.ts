// Types for error handlers, will be gone in runtime
// see more documentation on how interface work with TypeScript Nodejs if curious
export interface AppErrorOptions {
    statusCode: number; //stats code
    code:string; // e.g USER_NOT_FOUND
    message: string; //long message on error
    details?: unknown; // extra info
    cause?: unknown; //original err that caused the app error
}