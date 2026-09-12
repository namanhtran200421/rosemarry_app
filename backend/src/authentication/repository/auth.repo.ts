import { db } from "../../config/database.js";
import type { ApplicationUser } from "../types/auth.types.js";

/**
 * Finds a user by their verified Auth0 user ID.
 *
 * The profile is left joined because a newly authenticated user may not have
 * started onboarding yet and therefore may not have a profile row.
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
      "users.userRole as role",
      "profiles.onboardCompletedAt",
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
    .values({
      authProviderUserId: providerUserId,
    })
    .onConflict((oc:any) =>
      oc.column("authProviderUserId").doNothing(),
    )
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