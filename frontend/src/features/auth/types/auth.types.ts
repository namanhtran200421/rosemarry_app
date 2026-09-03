export type LoginConnection = "phone" | "google" | "apple";

export type AuthSessionStatus =
  | "initializing"
  | "unauthenticated"
  | "authenticating"
  | "authenticated"
  | "logging-out";
