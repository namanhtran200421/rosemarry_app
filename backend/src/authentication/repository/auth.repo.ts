import { db } from "../../config/database.js";
import type { ApplicationUser } from "../types/auth.types.js";

/**
 * Finds a user by their verified Auth0 user ID.
 *
 * The query also checks whether the user has a profile. `profileExists` is a
 * calculated value, so it does not need its own column in the database.
 *
 * @param providerUserId - The verified `sub` value from an Auth0 access token.
 * @returns The matching user, or `null` when the user has not signed in before.
 */
async function findByProviderUserId(
  providerUserId: string,
): Promise<ApplicationUser | null> {
  const user = await db
    .selectFrom("users")
    .select((eb) => [
      "userId",
      "authProviderUserId",
      "accountStatus",

      // ApplicationUser calls this `role`, and that name reaches the client in
      // the session response, so the column is aliased rather than renamed.
      "userRole as role",

      eb
        .exists(
          eb
            .selectFrom("profiles")
            .select("userId")
            .whereRef("profiles.userId", "=", "users.userId"),
        )
        .$castTo<boolean>()
        .as("profileExists"),
    ])
    .where("authProviderUserId", "=", providerUserId)
    .limit(1)
    .executeTakeFirst();

  return user ?? null;
}

/**
 * Finds an existing user or creates one after their first Auth0 login.
 *
 * The database has a unique constraint on `auth_provider_user_id`. Combined
 * with `on conflict do nothing`, it prevents two requests from creating the
 * same user twice.
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

  // Read the row after the insert so this also works when another request
  // created the user at the same time.
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
