import { AppError } from "../../errors/appError.js";
import { authRepo } from "../repository/auth.repo.js";
import type {
  ApplicationSession,
  ApplicationUser,
} from "../types/auth.types.js";

/**
 * Checks whether a user is allowed to access.
 *
 * A valid Auth0 token proves the user's identity, but can still deny
 * access when the application account is suspended or deleted.
 *
 * @param user - The user loaded from the database.
 * @returns Nothing when the account is active.
 * @throws AppError with status 403 when the account cannot access the app.
 */
export function assertActiveUser(user: ApplicationUser): void {
  if (user.accountStatus === "SUSPENDED") {
    throw new AppError({
      statusCode: 403,
      code: "ACCOUNT_SUSPENDED",
      message: "This account has been suspended",
    });
  }

  if (user.accountStatus === "DELETED") {
    throw new AppError({
      statusCode: 403,
      code: "ACCOUNT_DELETED",
      message: "This account is no longer available",
    });
  }
}

/**
 * Creates the session information returned after a successful Auth0 login.
 *
 * A new database user is created on first login. Later logins reuse the same
 * user record and internal user ID.
 *
 * @param providerUserId - The verified `sub` value from an Auth0 access token.
 * @returns Session data used by the frontend to choose the next screen.
 * @throws AppError when the account is suspended or deleted.
 */
export async function createApplicationSession(
  providerUserId: string,
): Promise<ApplicationSession> {
  const user = await authRepo.findOrCreateByProviderUserId(providerUserId);

  assertActiveUser(user);

  return {
    userId: user.userId,
    role: user.role,
    profileExists: user.profileExists,
  };
}

/**
 * Loads an existing user before a protected application route runs.
 *
 * Unlike `createApplicationSession`, this function does not create users. The
 * client must complete the session endpoint before using protected features.
 *
 * @param providerUserId - The verified `sub` value from an Auth0 access token.
 * @returns The matching active user.
 * @throws AppError when the user does not exist, is suspended, or is deleted.
 */
export async function findActiveApplicationUser(
  providerUserId: string,
): Promise<ApplicationUser> {
  const user = await authRepo.findByProviderUserId(providerUserId);

  if (!user) {
    throw new AppError({
      statusCode: 401,
      code: "APPLICATION_USER_NOT_FOUND",
      message: "Complete application sign in before accessing this resource",
    });
  }

  assertActiveUser(user);

  return user;
}
