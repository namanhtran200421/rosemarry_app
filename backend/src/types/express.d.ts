/**
 * Adds authenticated application identity to Express requests.
 */
import type { UserRole } from "../authentication/types/auth.types.js";
declare global {
  namespace Express {
    interface Request {
      /**
       * This property is only populated after both:
       * 1. Auth0 has validated the access token.
       * 2. The Auth0 user has been resolved to an active database user.
       */
      user?: {
        // Internal users.user_id, not the Auth0 `sub`.
        id: number;
        role: UserRole;
      };
    }
  }
}

export {};