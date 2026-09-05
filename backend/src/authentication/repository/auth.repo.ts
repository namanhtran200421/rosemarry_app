import pool from "../../config/database.js";
import type {
  AccountStatus,
  ApplicationUser,
  UserRole,
} from "../types/auth.types.js";

/**
 * Describes one user row returned by Postgres.
 *
 * Database columns use snake_case. The rest of the backend uses camelCase, so
 * this private type keeps the database format inside the repository layer.
 */
interface UserRow {
  user_id: number;
  auth_provider_user_id: string;
  account_status: AccountStatus;
  user_role: UserRole;
  profile_exists: boolean;
}

/**
 * Converts a database user row into the format used by backend services.
 *
 * @param row - User data returned by Postgres.
 * @returns The same user data with camelCase property names.
 */
function toApplicationUser(row: UserRow): ApplicationUser {
  return {
    userId: row.user_id,
    authProviderUserId: row.auth_provider_user_id,
    accountStatus: row.account_status,
    role: row.user_role,
    profileExists: row.profile_exists,
  };
}

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
  const { rows } = await pool.query<UserRow>(
    `
      select
        users.user_id,
        users.auth_provider_user_id,
        users.account_status,
        users.user_role,
        exists (
          select 1
          from profiles
          where profiles.user_id = users.user_id
        ) as profile_exists
      from users
      where users.auth_provider_user_id = $1
      limit 1
    `,
    [providerUserId],
  );

  const row = rows[0];

  return row ? toApplicationUser(row) : null;
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
  await pool.query(
    `
      insert into users (auth_provider_user_id)
      values ($1)
      on conflict (auth_provider_user_id) do nothing
    `,
    [providerUserId],
  );

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
