import { db } from "../../infrastructure/database/database.js";
import type { ApplicationUser } from "./auth.types.js";

/**
 * Finds a user by their verified Auth0 user ID.
 *
 * The profile join exposes the onboarding completion timestamp when one has
 * been recorded. The profile is left joined because a newly authenticated user
 * may not have started onboarding; missing and unfinished profiles return null.
 *
 * @param providerUserId - The verified `sub` value from an Auth0 access token.
 * @returns The matching user, or `null` when the user has not signed in before.
 */
async function findByProviderUserId(
  providerUserId: string,
): Promise<ApplicationUser | null> {
  const user = await db
    .selectFrom("users")
    .leftJoin("profiles", "profiles.userId", "users.userId")
    .select([
      "users.userId",
      "users.authProviderUserId",
      "users.accountStatus",
      // ApplicationUser calls this `role`, and that name reaches the client in
      // the session response, so the column is aliased rather than renamed.
      "users.userRole as role",
      "profiles.onboardCompletedAt as onboardCompletedAt",
    ])
    .where("users.authProviderUserId", "=", providerUserId)
    .limit(1)
    .executeTakeFirst();
  return user ?? null;
}

/**
 * Finds an existing user or creates one after their first Auth0 login.
 *
 * The database has a unique constraint on `auth_provider_user_id`. Combined
 * with `on conflict do nothing`, it prevents concurrent requests from creating
 * duplicate users.
 *
 * @param providerUserId - The verified `sub` value from an Auth0 access token.
 * @returns The existing or newly created user.
 * @throws Error when the user cannot be read after the insert attempt.
 */
async function findOrCreateByProviderUserId(
  providerUserId: string,
): Promise<ApplicationUser> {
  await db
    .insertInto("users")
    .values({ authProviderUserId: providerUserId })
    .onConflict((oc) => oc.column("authProviderUserId").doNothing())
    .execute();

  const user = await findByProviderUserId(providerUserId);

  if (!user) {
    throw new Error("User was not available after find or create");
  }

  return user;
}

/**
 * Database operations used by the authentication service.
 */
export const authRepo = {
  findByProviderUserId,
  findOrCreateByProviderUserId,
};
