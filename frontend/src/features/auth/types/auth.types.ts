export type AuthSessionStatus =
  | "initializing"
  | "unauthenticated"
  | "sending-code"
  | "verifying-code"
  | "authenticated"
  | "logging-out";
