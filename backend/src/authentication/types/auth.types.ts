/**
 * Roles that control what a Rosemarry user is allowed to do.
 *
 * These values match the `users.user_role` values stored in Postgres.
 */
export type UserRole = "USER" | "STAFF";

/**
 * States that control whether an account can use Rosemarry.
 *
 * These values match the `users.account_status` values stored in Postgres.
 */
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

/**
 * Complete application identity loaded from the Rosemarry database.
 *
 * This type is for backend use. Only the smaller `ApplicationSession` object
 * is returned to the client.
 */
export interface ApplicationUser {
  /** Rosemarry's internal database ID. Used by table relationships. */
  userId: number;

  /** The Auth0 `sub` connected to this user. */
  authProviderUserId: string;

  /** Controls the features and operations available to the user. */
  role: UserRole;

  /** Controls whether the user may access the application. */
  accountStatus: AccountStatus;

  /** Tells the frontend whether the user still needs onboarding. */
  profileExists: boolean;
}

/**
 * Session information returned to the frontend after login.
 *
 * The Auth0 access token remains the real credential. This object only gives
 * the client the application information it needs after authentication.
 */
export interface ApplicationSession {
  /** Rosemarry's internal user ID. */
  userId: number;

  /** The user's application role. */
  role: UserRole;

  /** Whether the user already has a completed profile record. */
  profileExists: boolean;
}
