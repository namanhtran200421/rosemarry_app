export type AuthSessionStatus =
  | "initializing"
  | "unauthenticated"
  | "sending-code"
  | "verifying-code"
  | "signing-in"
  | "authenticated"
  | "logging-out";
